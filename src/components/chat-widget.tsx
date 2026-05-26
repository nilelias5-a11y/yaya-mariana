"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChatMessage, type ChatRole } from "./chat-message";
import { useChat } from "@/context/chat-context";

interface Message {
  role: ChatRole;
  content: string;
}

const MAX_CHARS = 500;
const INITIAL_GREETING: Message = {
  role: "assistant",
  content:
    "Hola. Soy el asistente de Yaya Mariana. ¿En qué puedo ayudarte? Puedo hablar de las variedades de fresa, el cultivo, la conservación o los envíos.",
};

export function ChatWidget() {
  const pathname = usePathname();
  const { isOpen, toggleChat, closeChat } = useChat();
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 150);
      return () => window.clearTimeout(id);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    if (text.length > MAX_CHARS) {
      setError(`El mensaje no puede superar ${MAX_CHARS} caracteres.`);
      return;
    }
    setError(null);

    const userMsg: Message = { role: "user", content: text };
    const baseMessages = [...messages, userMsg];
    setMessages([...baseMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    const transcript = baseMessages
      .filter((m, i) => !(i === 0 && m === INITIAL_GREETING))
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: transcript }),
      });

      if (!res.ok || !res.body) {
        if (res.status === 429) {
          setError("Has escrito muchos mensajes seguidos. Espera un momento y vuelve a intentarlo.");
        } else if (res.status === 400) {
          setError("Ese mensaje no se ha podido enviar. Inténtalo de nuevo.");
        } else {
          setError("Tengo un problema técnico. Intenta de nuevo en un momento.");
        }
        setMessages((prev) => prev.slice(0, -1));
        setIsStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let sep: number;
        while ((sep = buffer.indexOf("\n\n")) !== -1) {
          const chunk = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          if (!chunk.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(chunk.slice(6));
            if (typeof payload.text === "string") {
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                next[next.length - 1] = {
                  ...last,
                  content: last.content + payload.text,
                };
                return next;
              });
            } else if (typeof payload.error === "string") {
              setError(payload.error);
            }
          } catch {
            // skip malformed chunk
          }
        }
      }
    } catch {
      setError("Tengo un problema técnico. Intenta de nuevo en un momento.");
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.role === "assistant" && last.content === "") {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  if (pathname?.startsWith("/checkout")) return null;

  return (
    <>
      <button
        type="button"
        onClick={toggleChat}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat con el asistente"}
        aria-expanded={isOpen}
        className="fixed z-40 flex items-center justify-center transition-shadow duration-200"
        style={{
          right: "calc(1.25rem + env(safe-area-inset-right))",
          bottom: "calc(6rem + env(safe-area-inset-bottom))",
          width: 56,
          height: 56,
          borderRadius: "9999px",
          backgroundColor: "#c0392b",
          color: "#ffffff",
          boxShadow:
            "0 8px 22px rgba(122, 26, 26, 0.28), 0 0 0 0 rgba(232, 196, 191, 0)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow =
            "0 10px 26px rgba(122, 26, 26, 0.32), 0 0 0 8px rgba(232, 196, 191, 0.22)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow =
            "0 8px 22px rgba(122, 26, 26, 0.28), 0 0 0 0 rgba(232, 196, 191, 0)";
        }}
      >
        {isOpen ? (
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Asistente de Yaya Mariana"
          className="fixed z-40 flex flex-col font-sans"
          style={{
            right: "calc(1.25rem + env(safe-area-inset-right))",
            bottom: "calc(1.25rem + env(safe-area-inset-bottom))",
            width: "min(380px, calc(100vw - 2.5rem))",
            height: "min(580px, calc(100vh - 2.5rem - 6rem))",
            backgroundColor: "#fdf6f5",
            borderRadius: 12,
            border: "1px solid rgba(245,198,194,0.7)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.9) inset, 0 18px 48px rgba(122,26,26,0.18), 0 4px 12px rgba(192,57,43,0.08)",
            overflow: "hidden",
            animation: "ym-chat-rise 280ms cubic-bezier(0.19,1,0.22,1)",
          }}
        >
          <header
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid rgba(245,198,194,0.55)" }}
          >
            <div className="flex flex-col">
              <span className="text-[0.95rem] font-semibold text-[#5c1a1a]">
                Yaya Mariana
              </span>
              <span className="text-[0.7rem] text-[#7a3a3a]">
                Asistente del proyecto
              </span>
            </div>
            <button
              type="button"
              onClick={closeChat}
              aria-label="Cerrar chat"
              className="flex h-9 w-9 items-center justify-center rounded-md text-[#7a3a3a] transition-colors hover:bg-[rgba(192,57,43,0.08)]"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
            aria-live="polite"
            aria-busy={isStreaming}
          >
            {messages.map((m, i) => (
              <ChatMessage
                key={i}
                role={m.role}
                content={m.content || (isStreaming && i === messages.length - 1 ? "…" : "")}
                streaming={isStreaming && i === messages.length - 1 && m.role === "assistant"}
              />
            ))}
            {error && (
              <div
                role="status"
                className="text-[0.78rem] italic text-[#7a1a1a]/80 px-1"
              >
                {error}
              </div>
            )}
          </div>

          <div
            className="px-3 py-3"
            style={{ borderTop: "1px solid rgba(245,198,194,0.55)" }}
          >
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta…"
                rows={1}
                maxLength={MAX_CHARS}
                disabled={isStreaming}
                className="flex-1 resize-none rounded-md border border-[#d8b8b4] bg-white px-3 py-2 text-[0.875rem] text-[#1a0808] placeholder:text-[#7a3a3a]/55 focus:outline-none focus:border-[#c0392b] focus:ring-2 focus:ring-[rgba(192,57,43,0.18)] disabled:opacity-60"
                style={{ maxHeight: 90 }}
                aria-label="Escribe tu pregunta"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={isStreaming || input.trim().length === 0}
                aria-label="Enviar mensaje"
                className="flex h-9 w-9 items-center justify-center rounded-md text-white transition-opacity disabled:opacity-40"
                style={{ backgroundColor: "#c0392b" }}
              >
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[0.66rem] text-[#7a3a3a]/65">
              <span>{input.length} / {MAX_CHARS}</span>
              <span className="italic">Enter envía · Shift+Enter salto de línea</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes ym-chat-rise {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
