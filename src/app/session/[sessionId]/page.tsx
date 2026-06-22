"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Player } from "@/types";
import { getSession } from "@/lib/db/session-repository";
import { useSession } from "@/providers/session-provider";
import { ScoreBoard } from "@/components/board/score-board";
import { PlayerList } from "@/components/player/player-list";
import { PlayerForm } from "@/components/player/player-form";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function GamePage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const { session, setSession, addPlayer } = useSession();
  const [ready, setReady] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [undoHistory, setUndoHistory] = useState<
    Record<string, Player[]>
  >({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!params.sessionId) return;
      const s = await getSession(params.sessionId);
      if (cancelled) return;
      if (s) setSession(s);
      setReady(true);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params.sessionId, setSession]);

  const handleApplyScore = useCallback(
    (playerId: string, delta: number) => {
      if (!session) return;
      setUndoHistory((prev) => ({
        ...prev,
        [playerId]: session.players,
      }));
      const updatedPlayers = session.players.map((p) =>
        p.id === playerId ? { ...p, score: p.score + delta } : p
      );
      setSession({ ...session, players: updatedPlayers, updatedAt: Date.now() });
    },
    [session, setSession]
  );

  const handleUndo = useCallback(
    (playerId: string) => {
      if (!session) return;
      const snapshot = undoHistory[playerId];
      if (!snapshot) return;
      setSession({ ...session, players: snapshot, updatedAt: Date.now() });
      setUndoHistory((prev) => {
        const next = { ...prev };
        delete next[playerId];
        return next;
      });
    },
    [session, setSession, undoHistory]
  );

  const handleAddPlayer = (name: string, color: string) => {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      color,
      score: 0,
    };
    addPlayer(newPlayer);
    setShowAddPlayer(false);
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[#6a6a6a]">Đang tải...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <EmptyState
          title="Không tìm thấy phiên chơi"
          description="Phiên chơi này không tồn tại hoặc đã bị xoá."
          action={<Button onClick={() => router.push("/")}>Quay lại</Button>}
        />
      </div>
    );
  }

  const totalScore = session.players.reduce((sum, p) => sum + p.score, 0);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-4 sm:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            ←
          </Button>
          <h1 className="text-xl font-bold text-[#0a0a0a]">{session.name}</h1>
        </div>
        <Button size="sm" onClick={() => setShowAddPlayer(true)}>
          + Thêm
        </Button>
      </div>

      <div className="mb-8">
        <ScoreBoard players={session.players} />
      </div>

      <PlayerList
        players={session.players}
        onApplyScore={handleApplyScore}
        onUndo={handleUndo}
        undoHistory={Object.fromEntries(
          session.players.map((p) => [p.id, !!undoHistory[p.id]])
        )}
        onAddPlayer={() => setShowAddPlayer(true)}
      />

      <div className="mt-6 text-center text-xs text-[#6a6a6a]">
        Tổng điểm: {totalScore === 0 ? "0" : totalScore > 0 ? `+${totalScore}` : totalScore}
      </div>

      <Modal
        isOpen={showAddPlayer}
        onClose={() => setShowAddPlayer(false)}
        title="Thêm người chơi"
      >
        <PlayerForm
          onSubmit={handleAddPlayer}
          onCancel={() => setShowAddPlayer(false)}
          existingColors={session.players.map((p) => p.color)}
        />
      </Modal>
    </div>
  );
}
