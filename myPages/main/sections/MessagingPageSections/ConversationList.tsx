import Link from "next/link";
import { Avatar, Typography } from "@/app/components";
import type { ShopConversation } from "@/lib/types";

export function ConversationList({ conversations }: { conversations: ShopConversation[] }) {
  if (conversations.length === 0) {
    return (
      <Typography component="p" variant="body-base" className="text-center text-ink-muted">
        Aucune conversation pour l&apos;instant. Recherchez un client pour en démarrer une.
      </Typography>
    );
  }

  return (
    <div className="grid gap-2">
      {conversations.map((conversation) => (
        <Link
          className="flex items-center gap-3 rounded-[var(--radius-control)] border border-border bg-surface p-3 shadow-sm transition-colors hover:border-blue"
          href={`/messagerie/${conversation.id}`}
          key={conversation.id}
        >
          <Avatar initials={conversation.clientInitials} />
          <div className="grid min-w-0 flex-1 gap-0.5">
            <Typography
              component="p"
              variant="body-base"
              className={`truncate ${conversation.unread ? "font-bold" : ""}`}
            >
              {conversation.clientName}
            </Typography>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {conversation.lastMessageAt ? (
              <Typography component="span" variant="caption2" className="text-ink-muted">
                {new Date(conversation.lastMessageAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </Typography>
            ) : null}
            {conversation.unread ? (
              <span aria-label="Message non lu" className="size-2.5 rounded-full bg-[#c53f3f]" />
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
