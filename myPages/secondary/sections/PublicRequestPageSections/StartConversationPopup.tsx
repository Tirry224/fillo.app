"use client";

import { useActionState, useEffect, useState } from "react";
import { Button, Card, PasswordField, TextField, Typography } from "@/app/components";
import {
  checkClientAccountExistsAction,
  startConversationAction,
  type StartConversationState,
} from "@/lib/actions/clientAuth";

const initialState: StartConversationState = { error: null };

export function StartConversationPopup({
  clientId,
  phone,
  requestText,
  onClose,
}: {
  clientId: string;
  phone: string;
  requestText: string;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<"checking" | "create" | "login">("checking");
  const [state, formAction, pending] = useActionState(startConversationAction, initialState);

  useEffect(() => {
    let cancelled = false;
    checkClientAccountExistsAction(phone).then((exists) => {
      if (!cancelled) {
        setMode(exists ? "login" : "create");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [phone]);

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
      <Card className="grid w-full max-w-sm gap-4 p-5 shadow-lg" warm>
        <Typography component="p" variant="h4" className="text-center">
          {mode === "login" ? "Retrouvez votre accès Fillo" : "Créez votre accès Fillo"}
        </Typography>

        {mode === "checking" ? (
          <Typography component="p" variant="body-base" className="text-center">
            Vérification en cours...
          </Typography>
        ) : (
          <form className="grid gap-4" action={formAction}>
            <input type="hidden" name="clientId" value={clientId} />
            <input type="hidden" name="phone" value={phone} />
            <input type="hidden" name="requestText" value={requestText} />
            <input type="hidden" name="mode" value={mode} />

            <Typography component="p" variant="caption2">
              {mode === "login"
                ? `Un compte existe déjà pour le ${phone}. Entrez votre mot de passe pour continuer la conversation.`
                : `Numéro : ${phone}. Choisissez un email et un mot de passe pour créer votre accès et discuter avec la boutique.`}
            </Typography>

            {mode === "create" ? (
              <TextField
                autoComplete="email"
                label="Votre email"
                name="email"
                placeholder="vous@exemple.com"
                type="email"
                required
              />
            ) : null}

            <PasswordField
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              name="password"
              placeholder="••••••••"
              required
            />

            {state.error ? (
              <Typography component="p" variant="caption2" className="text-[#b33434]">
                {state.error}
              </Typography>
            ) : null}

            <div className="grid grid-cols-2 gap-3">
              <Button disabled={pending} onClick={onClose} type="button" variant="secondary">
                Annuler
              </Button>
              <Button disabled={pending} type="submit">
                {pending ? "Un instant..." : "Discuter"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
