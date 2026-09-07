import { Bot, AlertTriangle } from "lucide-react";
import type { ChatMessage } from "../types";
import { ReferencedTransactions } from "./ReferencedTransactions";

export function ChatMessageBubble({
  message,
  onFollowUp,
}: {
  message: ChatMessage;
  onFollowUp: (text: string) => void;
}) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2 text-xs text-white shadow-sm">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="flex max-w-[90%] gap-2">
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
            message.isError ? "bg-danger-soft text-danger" : "bg-accent-soft text-accent-dark"
          }`}
        >
          {message.isError ? <AlertTriangle className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
        </span>
        <div>
          <div
            className={`whitespace-pre-line rounded-2xl rounded-bl-sm px-3.5 py-2 text-xs leading-relaxed ${
              message.isError
                ? "border border-danger/30 bg-danger-soft text-danger"
                : "border border-border-app bg-bg-panel text-text-primary"
            }`}
          >
            {message.text}
          </div>

          {message.referencedExceptionIds && message.referencedExceptionIds.length > 0 && (
            <ReferencedTransactions exceptionIds={message.referencedExceptionIds} />
          )}

          {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {message.suggestedFollowUps.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onFollowUp(suggestion)}
                  className="rounded-full border border-border-app bg-bg-panel px-2.5 py-1 text-[10px] font-medium text-text-secondary transition-all duration-150 hover:border-accent hover:text-accent-dark active:scale-95"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
