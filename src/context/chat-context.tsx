"use client";

/* ChatProvider — estado global del widget del chat IA.
 *
 * Antes (FASE 2): el ChatWidget mantenía su propio useState(isOpen).
 * Nadie más podía abrir el chat desde fuera del componente.
 *
 * Ahora: el estado vive en este Provider. El widget consume `isOpen` y
 * los handlers `openChat / closeChat / toggleChat`. Cualquier componente
 * dentro del árbol del provider puede llamar `useChat().openChat()` para
 * abrir el drawer desde botones externos (CTAs en FAQ, Contact, etc.).
 *
 * openChat() es idempotente: si ya está abierto no hace nada visible
 * (la re-llamada no causa side-effects ni anima de nuevo). El widget
 * gestiona el foco al input cuando isOpen pasa false → true.
 */

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

type ChatContextValue = {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const toggleChat = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <ChatContext.Provider value={{ isOpen, openChat, closeChat, toggleChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return ctx;
}
