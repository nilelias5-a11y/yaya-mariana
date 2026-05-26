import Anthropic from "@anthropic-ai/sdk";
import { createHash } from "node:crypto";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat-system-prompt";
import { checkRateLimit } from "@/lib/chat-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_USER_MESSAGES = 20;
const MAX_CHARS_PER_MESSAGE = 500;
const CLOSING_MESSAGE =
  "Llevamos buena conversación. Para seguir, mejor que escribas al equipo en info@yaya-mariana.com — te leerán pronto, con calma.";

type ChatRole = "user" | "assistant";
interface ChatMessage {
  role: ChatRole;
  content: string;
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff && xff.length > 0) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function anonymizeIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function sse(data: object): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

function jsonError(status: number, error: string, extra?: Record<string, unknown>): Response {
  return new Response(JSON.stringify({ error, ...extra }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function sseStream(emit: (controller: ReadableStreamDefaultController, enc: TextEncoder) => Promise<void> | void): Response {
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await emit(controller, enc);
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const ipHash = anonymizeIp(ip);

  const rl = checkRateLimit(ipHash);
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: "rate_limit", retryAfter: rl.retryAfter }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rl.retryAfter ?? 60),
        },
      },
    );
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "invalid_json");
  }

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return jsonError(400, "messages_required");
  }

  const sanitized: ChatMessage[] = [];
  for (const raw of body.messages) {
    if (
      !raw ||
      typeof raw !== "object" ||
      (raw as ChatMessage).role !== "user" &&
        (raw as ChatMessage).role !== "assistant" ||
      typeof (raw as ChatMessage).content !== "string"
    ) {
      return jsonError(400, "invalid_message");
    }
    const m = raw as ChatMessage;
    const content = m.content.trim();
    if (content.length === 0) continue;
    if (m.role === "user" && content.length > MAX_CHARS_PER_MESSAGE) {
      return jsonError(400, "message_too_long", { max: MAX_CHARS_PER_MESSAGE });
    }
    sanitized.push({ role: m.role, content });
  }

  if (sanitized.length === 0) {
    return jsonError(400, "no_valid_messages");
  }
  if (sanitized[sanitized.length - 1].role !== "user") {
    return jsonError(400, "last_must_be_user");
  }
  if (sanitized[0].role !== "user") {
    return jsonError(400, "first_must_be_user");
  }

  const userMessageCount = sanitized.filter((m) => m.role === "user").length;
  console.log(
    `[chat] ip=${ipHash} userMsgs=${userMessageCount} totalMsgs=${sanitized.length}`,
  );

  if (userMessageCount > MAX_USER_MESSAGES) {
    return sseStream((controller, enc) => {
      controller.enqueue(enc.encode(sse({ text: CLOSING_MESSAGE })));
      controller.enqueue(enc.encode(sse({ done: true, reason: "max_messages" })));
    });
  }

  return sseStream(async (controller, enc) => {
    try {
      const anthropicStream = getClient().messages.stream({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        thinking: { type: "disabled" },
        output_config: { effort: "low" },
        system: [
          {
            type: "text",
            text: CHAT_SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: sanitized,
      });

      anthropicStream.on("text", (delta: string) => {
        controller.enqueue(enc.encode(sse({ text: delta })));
      });

      const final = await anthropicStream.finalMessage();
      const usage = final.usage;
      console.log(
        `[chat] ip=${ipHash} cacheRead=${usage.cache_read_input_tokens ?? 0} cacheWrite=${usage.cache_creation_input_tokens ?? 0} in=${usage.input_tokens} out=${usage.output_tokens} stop=${final.stop_reason}`,
      );
      controller.enqueue(enc.encode(sse({ done: true })));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[chat] ip=${ipHash} error=${message}`);
      controller.enqueue(
        enc.encode(
          sse({
            error: "Tengo un problema técnico. Intenta de nuevo en un momento.",
          }),
        ),
      );
    }
  });
}
