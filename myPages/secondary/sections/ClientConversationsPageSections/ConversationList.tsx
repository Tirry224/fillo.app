import Link from "next/link";
import { Avatar, Typography } from "@/app/components";
import type { ClientConversation } from "@/lib/types";

export function ConversationList({ conversations }: { conversations: ClientConversation[] }) {
  if (conversations.length === 0) {
    return (
      <Typography component="p" variant="body-base" className="text-center text-ink-muted">
        Vous n&apos;avez pas encore de conversation. Rendez-vous sur la page d&apos;une
        boutique pour lui envoyer une demande.
      </Typography>
    );
  }

  return (
    <div className="grid gap-2">
      {conversations.map((conversation) => (
        <Link
          className="flex items-center gap-3 rounded-[var(--radius-control)] border border-border bg-surface p-3 shadow-sm transition-colors hover:border-blue"
          href={`/mes-conversations/${conversation.id}`}
          key={conversation.id}
        >
          <Avatar initials={conversation.shopInitial} />
          <div className="grid min-w-0 flex-1 gap-0.5">
            <Typography component="p" variant="body-base" className="truncate font-bold">
              {conversation.shopName}
            </Typography>
          </div>
          {conversation.lastMessageAt ? (
            <Typography component="span" variant="caption2" className="shrink-0 text-ink-muted">
              {new Date(conversation.lastMessageAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
              })}
            </Typography>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
