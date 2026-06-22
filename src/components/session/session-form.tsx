"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SessionFormProps {
  onSubmit: (name: string) => void;
  onCancel: () => void;
  initialName?: string;
}

export function SessionForm({ onSubmit, onCancel, initialName }: SessionFormProps) {
  const [name, setName] = useState(initialName ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
    setName("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        label="Tên phiên"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nhập tên phiên chơi..."
        autoFocus
      />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Huỷ
        </Button>
        <Button type="submit" disabled={!name.trim()}>
          Xác nhận
        </Button>
      </div>
    </form>
  );
}
