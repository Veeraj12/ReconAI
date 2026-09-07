"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api-client";
import { useReconciliationContext } from "../reconciliation/ReconciliationProvider";
import { reconbotApi } from "./api";
import type { BotContextPayload, ChatMessage } from "./types";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "bot",
  text: "Hi — I can answer questions about this reconciliation's exceptions and patterns. Try \"give me a summary\" or \"why do we have so many amount mismatches?\"",
  suggestedFollowUps: ["Give me a summary", "What patterns did you find?"],
};

export function useReconBot() {
  const { data } = useReconciliationContext();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [context, setContext] = useState<BotContextPayload | null>(null);
  const [isSending, setIsSending] = useState(false);

  // A fresh reconciliation result (new upload, or a reset) invalidates
  // any previous conversation — it was about different underlying data.
  useEffect(() => {
    setMessages([WELCOME_MESSAGE]);
    setContext(null);
  }, [data]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !data || isSending) return;

      setMessages((prev) => [...prev, { id: nextId(), role: "user", text: trimmed }]);
      setIsSending(true);

      try {
        const response = await reconbotApi.ask(trimmed, data, context);
        setContext(response.context);
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "bot",
            text: response.answer,
            suggestedFollowUps: response.suggestedFollowUps,
            referencedExceptionIds: response.referencedExceptionIds,
          },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: "bot",
            text: err instanceof ApiError ? err.message : "Something went wrong answering that — try again.",
            isError: true,
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [data, context, isSending]
  );

  const clear = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setContext(null);
  }, []);

  return { messages, isSending, send, clear, isAvailable: data !== null };
}
