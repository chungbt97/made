"use client";

import { useEffect } from "react";
import { AppProvider } from "@/providers/app-provider";
import { InstallPrompt } from "@/components/ui/install-prompt";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <AppProvider>
      {children}
      <InstallPrompt />
    </AppProvider>
  );
}
