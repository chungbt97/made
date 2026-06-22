"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CARD_COLORS = [
  "#ff4d8b",
  "#1a3a3a",
  "#b8a4ed",
  "#ffb084",
  "#e8b94a",
  "#f5f0e0",
];

interface PlayerFormProps {
  onSubmit: (name: string, color: string) => void;
  onCancel: () => void;
}

export function PlayerForm({ onSubmit, onCancel }: PlayerFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(CARD_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), color);
    setName("");
    setColor(CARD_COLORS[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Tên người chơi"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nhập tên người chơi..."
        autoFocus
      />

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#3a3a3a]">
          Màu thẻ
        </label>
        <div className="flex flex-wrap gap-2">
          {CARD_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`h-9 w-9 rounded-xl border-2 transition-all ${
                color === c ? "border-[#0a0a0a] scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Huỷ
        </Button>
        <Button type="submit" disabled={!name.trim()}>
          Thêm
        </Button>
      </div>
    </form>
  );
}
