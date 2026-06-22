"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "./session-provider";

export function AppProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
