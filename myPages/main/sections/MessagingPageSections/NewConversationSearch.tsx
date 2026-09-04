"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, SearchField, Typography } from "@/app/components";
import { startShopConversationAction } from "@/lib/actions/shopMessages";
import { normalizePhone } from "@/lib/utils/phone";
import type { Client } from "@/lib/types";

export function NewConversationSearch({
  clients,
  existingConversationClientIds,
}: {
  clients: Client[];
  existingConversationClientIds: string[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pendingClientId, setPendingClientId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const normalizedQuery = normalizePhone(query);
  const matches =
    normalizedQuery.length >= 3
      ? clients.filter((client) => normalizePhone(client.phone).includes(normalizedQuery))
      : [];

  function handleStart(clientId: string) {
    setError(null);
    setPendingClientId(clientId);
    startTransition(async () => {
      const result = await startShopConversationAction(clientId);
      setPendingClientId(null);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(`/messagerie/${result.conversationId}`);
    });
  }

  return (
    <div className="grid gap-2">
      <SearchField
        label="Rechercher un client par numéro"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Rechercher un client par numéro"
        value={query}
      />
      {error ? (
        <Typography component="p" variant="caption2" className="text-[#b33434]">
          {error}
        </Typography>
      ) : null}
      {matches.length > 0 ? (
        <div className="grid gap-2">
          {matches.map((client) => {
            const hasConversation = existingConversationClientIds.includes(client.id);
            return (
              <div
                className="flex items-center gap-3 rounded-[var(--radius-control)] border border-border bg-surface p-3"
                key={client.id}
              >
                <Avatar initials={client.initials} />
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <Typography component="p" variant="body-base" className="truncate font-bold">
                    {client.name}
                  </Typography>
                  <Typography component="p" variant="caption2" className="text-ink-muted">
                    {client.phone}
                  </Typography>
                </div>
                <Button
                  disabled={isPending && pendingClientId === client.id}
                  onClick={() => handleStart(client.id)}
                  size="sm"
                  type="button"
                >
                  {isPending && pendingClientId === client.id
                    ? "..."
                    : hasConversation
                      ? "Ouvrir"
                      : "Démarrer"}
                </Button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
