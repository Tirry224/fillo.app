"use client";

import { useActionState } from "react";
import { Button, TextAreaField, Typography } from "@/app/components";
import { sendClientMessageAction, type SendMessageState } from "@/lib/actions/messages";

const initialState: SendMessageState = { error: null };

export function MessageForm({ conversationId }: { conversationId: string }) {
  const [state, formAction, pending] = useActionState(sendClientMessageAction, initialState);

  return (
    <form action={formAction} className="grid gap-2" key={state.sentAt ?? 0}>
      <input name="conversationId" type="hidden" value={conversationId} />
      <TextAreaField
        label="Votre message"
        name="body"
        placeholder="Écrivez votre message..."
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
