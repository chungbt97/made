"use client";

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-[#3a3a3a]">
          {label}
        </label>
      )}
      <input
        className={`h-11 rounded-xl border border-[#e5e5e5] bg-[#fffaf0] px-4 text-sm text-[#0a0a0a] placeholder-[#9a9a9a] transition-colors focus:border-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] ${className}`}
        {...props}
      />
    </div>
  );
}
