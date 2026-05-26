"use client";

export type ChatRole = "user" | "assistant";

export interface ChatMessageProps {
  role: ChatRole;
  content: string;
  streaming?: boolean;
}

export function ChatMessage({ role, content, streaming }: ChatMessageProps) {
  const isUser = role === "user";
  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={[
          "max-w-[85%] rounded-lg px-3.5 py-2.5 text-[0.875rem] leading-relaxed whitespace-pre-wrap break-words",
          isUser
            ? "bg-[rgba(192,57,43,0.10)] text-[#5c1a1a]"
            : "bg-white text-[#1a0808] border border-[rgba(245,198,194,0.45)]",
        ].join(" ")}
        aria-label={isUser ? "Tu mensaje" : "Mensaje del asistente"}
      >
        {content}
        {streaming && !isUser && (
          <span
            aria-hidden="true"
            className="inline-block ml-1 h-3 w-[2px] align-middle bg-[#c0392b]/70 animate-pulse"
          />
        )}
      </div>
    </div>
  );
}
