"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Session, Player } from "@/types";
import { distributeScore } from "@/lib/scoring/zero-sum";
import { saveSession } from "@/lib/db/session-repository";

interface SessionContextValue {
  session: Session | null;
  setSession: (session: Session | null) => void;
  updatePlayerScore: (playerId: string, delta: number) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updateSession: (updates: Partial<Session>) => void;
  persistSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const updatePlayerScore = useCallback(
    (playerId: string, delta: number) => {
      if (!session) return;
      const updatedPlayers = distributeScore(session.players, playerId, delta);
      setSession((prev) =>
        prev
          ? {
              ...prev,
              players: updatedPlayers,
              updatedAt: Date.now(),
            }
          : prev
      );
    },
    [session]
  );

  const addPlayer = useCallback(
    (player: Player) => {
      if (!session) return;
      setSession((prev) =>
        prev
          ? {
              ...prev,
              players: [...prev.players, player],
              updatedAt: Date.now(),
            }
          : prev
      );
    },
    [session]
  );

  const removePlayer = useCallback(
    (playerId: string) => {
      if (!session) return;
      setSession((prev) =>
        prev
          ? {
              ...prev,
              players: prev.players.filter((p) => p.id !== playerId),
              updatedAt: Date.now(),
            }
          : prev
      );
    },
    [session]
  );

  const updateSession = useCallback((updates: Partial<Session>) => {
    setSession((prev) =>
      prev ? { ...prev, ...updates, updatedAt: Date.now() } : prev
    );
  }, []);

  const persistSession = useCallback(() => {
    if (!session) return;
    saveSession(session);
  }, [session]);

  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(() => {
      saveSession(session);
    }, 500);
    return () => clearTimeout(timer);
  }, [session]);

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        updatePlayerScore,
        addPlayer,
        removePlayer,
        updateSession,
        persistSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

export function useActiveSession() {
  const { session } = useSession();
  return session;
}
