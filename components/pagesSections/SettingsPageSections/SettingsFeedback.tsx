"use client";

import { Typography } from "@/components";
import { useEffect, useState, type FormEvent } from "react";

export function SettingsFeedback() {
  const [comment, setComment] = useState("");
  const [commentSent, setCommentSent] = useState(false);

  useEffect(() => {
    if (!commentSent) return;

    const timeoutId = window.setTimeout(() => {
      setCommentSent(false);
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [commentSent]);

  function sendComment() {
    if (!comment.trim()) return;

    setCommentSent(true);
    setComment("");
  }

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendComment();
  }

  return (
    <section className="space-y-3">
      <Typography
        component="h2"
        variant="caption1"
        className="text-[16px] uppercase tracking-[0.02em] text-ink-muted"
      >
        Un commentaire, une idée ?
      </Typography>
      <form
        className="overflow-hidden rounded-[22px] border-2 border-border bg-surface p-5"
        onSubmit={handleCommentSubmit}
      >
        <textarea
          aria-label="Votre commentaire"
          className="min-h-[112px] w-full resize-none border-0 p-0 text-[16px] leading-tight text-text placeholder:text-[#c5bcad] focus:outline-none"
          onChange={(event) => {
            setComment(event.target.value);
            setCommentSent(false);
          }}
          placeholder="Dites-nous ce qui manque ou ce qui vous gêne dans Fillo..."
          value={comment}
        />
        <button
          className="mt-5 min-h-14 w-full touch-manipulation rounded-[18px] bg-orange px-4 text-[18px] font-bold text-navy transition-colors hover:bg-[#e99d25] active:bg-[#d88f1d]"
          onClick={sendComment}
          type="button"
        >
          Envoyer
        </button>
        <Typography
          aria-live="polite"
          component="p"
          variant="body-sm"
          className={`mt-3 min-h-[18px] text-center text-green ${
            commentSent ? "visible" : "invisible"
          }`}
        >
          Merci pour votre retour.
        </Typography>
      </form>
    </section>
  );
}
