"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CARD_COLORS = [
  "#E68457",
  "#FFE8B4",
  "#293681",
  "#4274D9",
  "#95CCDD",
  "#FFF78D",
  "#467235",
  "#D6FB61",
  "#F6850C",
  "#DE3E3E",
];

function pickColor(existing: string[]): string {
  const available = CARD_COLORS.filter((c) => !existing.includes(c));
  if (available.length > 0) {
    return available[Math.floor(Math.random() * available.length)];
  }
  return CARD_COLORS[Math.floor(Math.random() * CARD_COLORS.length)];
}

interface PlayerFormProps {
  onSubmit: (name: string, color: string) => void;
  onCancel: () => void;
  existingColors?: string[];
}

export function PlayerForm({
  onSubmit,
  onCancel,
  existingColors = [],
}: PlayerFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(() => pickColor(existingColors));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), color);
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
