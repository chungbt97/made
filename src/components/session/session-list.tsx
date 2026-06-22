"use client";

import { useState, useEffect, useCallback } from "react";
import type { Session } from "@/types";
import { getAllSessions } from "@/lib/db/session-repository";
import { SessionItem } from "./session-item";
import { SessionForm } from "./session-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";

interface SessionListProps {
  onOpenSession: (id: string) => void;
}

export function SessionList({ onOpenSession }: SessionListProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [renameTarget, setRenameTarget] = useState<Session | null>(null);

  const loadSessions = useCallback(async () => {
    const all = await getAllSessions();
    setSessions(all);
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleCreate = () => setShowCreate(true);
  const handleRename = (session: Session) => setRenameTarget(session);

  const handleDelete = async (id: string) => {
    const { deleteSession } = await import("@/lib/db/session-repository");
    await deleteSession(id);
    loadSessions();
  };

  const handleCreateSubmit = async (name: string) => {
    const { saveSession } = await import("@/lib/db/session-repository");
    const newSession: Session = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      scoreStep: 10,
      players: [],
    };
    await saveSession(newSession);
    setShowCreate(false);
    onOpenSession(newSession.id);
  };

  const handleRenameSubmit = async (name: string) => {
    if (!renameTarget) return;
    const { saveSession } = await import("@/lib/db/session-repository");
    await saveSession({ ...renameTarget, name });
    setRenameTarget(null);
    loadSessions();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0a0a0a]">
          Phiên chơi
        </h1>
        <Button onClick={handleCreate}>Tạo phiên mới</Button>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          title="Chưa có phiên chơi nào"
          description="Tạo một phiên chơi mới để bắt đầu theo dõi điểm số."
          action={<Button onClick={handleCreate}>Tạo phiên mới</Button>}
        />
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((s) => (
            <SessionItem
              key={s.id}
              session={s}
              onOpen={onOpenSession}
              onRename={handleRename}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Tạo phiên mới"
      >
        <SessionForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>

      <Modal
        isOpen={renameTarget !== null}
        onClose={() => setRenameTarget(null)}
        title="Đổi tên phiên"
      >
        <SessionForm
          onSubmit={handleRenameSubmit}
          onCancel={() => setRenameTarget(null)}
          initialName={renameTarget?.name}
        />
      </Modal>
    </div>
  );
}
