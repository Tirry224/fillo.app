"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Typography } from "@/app/components";
import { Bell, BellOff, Check } from "lucide-react";
import { updateShopSettingsAction } from "@/lib/actions/shop";
import type { Shop } from "@/lib/types";

export function DashboardHeader({
  shop,
  emailNotifications,
}: {
  shop: Shop;
  emailNotifications: boolean;
}) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const publicUrl = `https://fillo.app/${shop.slug}`;

  useEffect(() => {
    if (copyState === "idle") {
      return;
    }

    const resetTimer = window.setTimeout(() => {
      setCopyState("idle");
    }, 2500);

    return () => window.clearTimeout(resetTimer);
  }, [copyState]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  function handleToggleNotifications() {
    startTransition(async () => {
      const result = await updateShopSettingsAction({
        emailNotifications: !emailNotifications,
      });
      if (result.error) {
        window.alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <header className="-mx-4 -mt-6 grid gap-5 rounded-b-[var(--radius-card)] bg-navy px-4 pb-5 pt-6 text-white sm:-mx-6 sm:-mt-8 sm:px-6">
      <div className="flex items-start justify-between">
        <div className="grid gap-1">
          <Typography component="h1" variant="h4" className="text-white">
            {shop.name}
          </Typography>
          <Typography
            component="p"
            variant="caption3"
            className="text-white/70"
          >
            Tableau de bord
          </Typography>
        </div>
        <div className="flex gap-2" aria-label="Actions du tableau de bord">
          <button
            aria-label={
              emailNotifications
                ? "Désactiver les notifications"
                : "Activer les notifications"
            }
            className="flex size-9 items-center justify-center rounded-[var(--radius-control)] bg-white/10 text-sm disabled:opacity-60"
            disabled={pending}
            onClick={handleToggleNotifications}
            type="button"
          >
            {emailNotifications ? (
              <Bell aria-hidden="true" size={17} />
            ) : (
              <BellOff aria-hidden="true" size={17} />
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-2 rounded-[var(--radius-control)] bg-white/10 p-3">
        <Typography component="p" variant="caption3" className="text-orange">
          Votre lien client
        </Typography>
        <div className="flex items-center justify-between gap-3">
          <Link
            aria-label="Ouvrir le formulaire public de la boutique"
            className="min-w-0 truncate"
            href={`/${shop.slug}`}
          >
            <Typography
              component="span"
              variant="caption1"
              className="text-white underline"
            >
              fillo.app/{shop.slug}
            </Typography>
          </Link>
          <button
            aria-describedby="copy-status"
            aria-label="Copier le lien client"
            className="inline-flex min-h-9 shrink-0 items-center rounded-[var(--radius-control)] bg-orange px-3 py-2 text-xs font-bold text-navy"
            onClick={handleCopy}
            type="button"
          >
            {copyState === "copied" ? (
              <span className="inline-flex items-center gap-1">
                <Check aria-hidden="true" size={14} />
                Copié
              </span>
            ) : (
              "Copier"
            )}
          </button>
        </div>
        <p aria-live="polite" className="sr-only" id="copy-status">
          {copyState === "copied"
            ? "Lien client copié."
            : copyState === "error"
              ? "Impossible de copier le lien client."
              : ""}
        </p>
      </div>
    </header>
  );
}
