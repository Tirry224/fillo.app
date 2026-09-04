"use client";

import { useActionState } from "react";
import { Button, TextAreaField, Typography } from "@/app/components";
import { sendShopMessageAction, type SendShopMessageState } from "@/lib/actions/shopMessages";

const initialState: SendShopMessageState = { error: null };

export function MessageForm({ conversationId }: { conversationId: string }) {
  const [state, formAction, pending] = useActionState(sendShopMessageAction, initialState);

  return (
    <form action={formAction} className="grid gap-2" key={state.sentAt ?? 0}>
      <input name="conversationId" type="hidden" value={conversationId} />
      <TextAreaField
        label="Votre réponse"
        name="body"
        placeholder="Écrivez votre réponse..."
        required
        rows={2}
      />
      {state.error ? (
        <Typography component="p" variant="caption2" className="text-[#b33434]">
          {state.error}
        </Typography>
      ) : null}
      <Button disabled={pending} fullWidth type="submit">
        {pending ? "Envoi..." : "Envoyer"}
      </Button>
    </form>
  );
}
