"use client";

import type { Session } from "@/types";
import { formatDate } from "@/lib/utils/dates";
import { Button } from "@/components/ui/button";

interface SessionItemProps {
  session: Session;
  onOpen: (id: string) => void;
  onRename: (session: Session) => void;
  onDelete: (id: string) => void;
}

export function SessionItem({
  session,
  onOpen,
  onRename,
  onDelete,
}: SessionItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-[#e5e5e5] bg-[#f5f0e0] p-4 transition-colors hover:bg-[#ebe6d6]">
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-[#0a0a0a]">
          {session.name}
        </h3>
        <p className="mt-0.5 text-xs text-[#6a6a6a]">
          {session.players.length} người chơi &middot; Cập nhật:{" "}
          {formatDate(session.updatedAt)}
        </p>
      </div>
      <div className="ml-4 flex shrink-0 gap-1.5">
        <Button size="sm" onClick={() => onOpen(session.id)}>
          Mở
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onRename(session)}
        >
          Sửa
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete(session.id)}
        >
          Xoá
        </Button>
      </div>
    </div>
  );
}
