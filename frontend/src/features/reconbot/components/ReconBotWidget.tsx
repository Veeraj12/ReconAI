"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, RotateCcw, Loader2 } from "lucide-react";
import { useReconBotContext } from "../ReconBotProvider";
import { ChatMessageBubble } from "./ChatMessageBubble";

export function ReconBotWidget() {
  const { messages, isSending, send, clear, isAvailable } = useReconBotContext();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending, open]);

  if (!isAvailable) return null;

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    send(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="animate-fade-in-up mb-3 flex h-[520px] w-[360px] flex-col overflow-hidden rounded-2xl border border-border-app bg-bg-panel shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-app bg-row-alt px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-accent-dark">
                <MessageCircle className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold text-text-primary">Recon Bot</p>
                <p className="text-[10px] text-text-secondary">Local &amp; deterministic — no external AI</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clear}
                title="Clear conversation"
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-row-hover hover:text-text-primary"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                title="Close"
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-row-hover hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3.5 py-3.5">
            {messages.map((message) => (
              <ChatMessageBubble key={message.id} message={message} onFollowUp={send} />
            ))}
            {isSending && (
              <div className="flex items-center gap-2 text-[11px] text-text-secondary">
                <Loader2 className="h-3.5 w-3.5 animate-spin-slow" />
                Thinking…
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border-app bg-row-alt p-2.5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Ask about your exceptions…"
              disabled={isSending}
              className="flex-1 rounded-lg border border-border-app bg-bg-panel px-3 py-2 text-xs text-text-primary outline-none focus:border-accent disabled:opacity-60"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending || !input.trim()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-white transition-all duration-150 hover:bg-accent-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center rounded-full bg-accent text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-accent-dark active:scale-95"
        style={{ height: "52px", width: "52px" }}
        aria-label="Toggle Recon Bot"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  );
}
