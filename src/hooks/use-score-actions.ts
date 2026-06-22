"use client";

import { useCallback } from "react";
import { useSession } from "@/providers/session-provider";

export function useScoreActions() {
  const { session, updatePlayerScore, setSession } = useSession();

  const increase = useCallback(
    (playerId: string) => {
      if (!session) return;
      updatePlayerScore(playerId, session.scoreStep);
    },
    [session, updatePlayerScore]
  );

  const decrease = useCallback(
    (playerId: string) => {
      if (!session) return;
      updatePlayerScore(playerId, -session.scoreStep);
    },
    [session, updatePlayerScore]
  );

  const setStep = useCallback(
    (step: number) => {
      if (!session) return;
      setSession({
        ...session,
        scoreStep: step,
        updatedAt: Date.now(),
      });
    },
    [session, setSession]
  );

  return { increase, decrease, setStep };
}
