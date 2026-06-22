"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-[#0a0a0a] text-white hover:bg-[#2a2a2a] disabled:bg-[#ccc] disabled:text-[#999]",
  secondary:
    "bg-[#fffaf0] text-[#0a0a0a] border border-[#e5e5e5] hover:bg-[#f5f0e0]",
  ghost: "bg-transparent text-[#3a3a3a] hover:bg-[#f5f0e0]",
  danger: "bg-[#ef4444] text-white hover:bg-[#dc2626]",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1 text-xs h-8",
  md: "px-5 py-2 text-sm h-11",
  lg: "px-8 py-3 text-base h-12",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] focus:ring-offset-2 focus:ring-offset-[#fffaf0] disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
