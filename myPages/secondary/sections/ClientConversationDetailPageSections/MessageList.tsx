import { Typography } from "@/app/components";
import type { Message } from "@/lib/types";

export function MessageList({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return (
      <Typography component="p" variant="body-base" className="text-center text-ink-muted">
        Aucun message pour l&apos;instant.
      </Typography>
    );
  }

  return (
    <div className="grid gap-2 py-2">
      {messages.map((message) => {
        const isClient = message.senderRole === "client";
        return (
          <div
            className={`max-w-[80%] rounded-[var(--radius-control)] px-3 py-2 ${
              isClient ? "justify-self-end bg-navy text-white" : "justify-self-start bg-surface-warm text-text"
            }`}
            key={message.id}
          >
            <Typography
              component="p"
              variant="body-base"
              className={`whitespace-pre-wrap break-words ${isClient ? "text-white" : "text-text"}`}
            >
              {message.body}
            </Typography>
            <Typography
              component="p"
              variant="caption2"
              className={isClient ? "mt-1 text-white/70" : "mt-1 text-ink-muted"}
            >
              {new Date(message.createdAt).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </div>
        );
      })}
    </div>
  );
}
