"use client";

import { useEffect } from "react";
import { AppProvider } from "@/providers/app-provider";
import { InstallPrompt } from "@/components/ui/install-prompt";
import { triggerInitialSync } from "@/lib/db/session-repository";
import { setupOnlineListener } from "@/lib/sync/session-sync";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    triggerInitialSync();
    const cleanup = setupOnlineListener();
    return cleanup;
  }, []);

  return (
    <AppProvider>
      {children}
      <InstallPrompt />
    </AppProvider>
  );
}
