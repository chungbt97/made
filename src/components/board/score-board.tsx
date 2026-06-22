"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Player } from "@/types";

interface ScoreBoardProps {
  players: Player[];
}

export function ScoreBoard({ players }: ScoreBoardProps) {
  if (players.length === 0) return null;

  const data = players.map((p) => ({
    name: p.name,
    score: Math.round(p.score * 100) / 100,
  }));

  const leader = [...players].sort((a, b) => b.score - a.score)[0];
  const lowest = [...players].sort((a, b) => a.score - b.score)[0];

  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-[#faf5e8] p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#0a0a0a]">
          Bảng điểm
        </h2>
        <div className="flex gap-4 text-xs text-[#6a6a6a]">
          <span>
            Dẫn đầu:{" "}
            <span className="font-semibold text-[#22c55e]">{leader.name}</span>
          </span>
          <span>
            Thấp nhất:{" "}
            <span className="font-semibold text-[#ef4444]">{lowest.name}</span>
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -8, bottom: 4 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fill: "#6a6a6a", fontSize: 12 }}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6a6a6a", fontSize: 12 }}
              axisLine={{ stroke: "#e5e5e5" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#faf5e8",
                border: "1px solid #e5e5e5",
                borderRadius: 12,
                color: "#0a0a0a",
                fontSize: 13,
              }}
              formatter={(value) => [
                `${Number(value) > 0 ? "+" : ""}${value}`,
                "Điểm",
              ]}
            />
            <ReferenceLine
              y={0}
              stroke="#6a6a6a"
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={48}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.score >= 0 ? "#22c55e" : "#ef4444"}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
