"use client";

import { useEffect, useState } from "react";
import { Button } from "./button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm rounded-2xl border border-[#e5e5e5] bg-[#faf5e8] p-4 shadow-lg">
      <p className="mb-3 text-sm text-[#3a3a3a]">
        Cài đặt ứng dụng để sử dụng nhanh hơn!
      </p>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleInstall}>
          Cài đặt
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setShow(false)}>
          Bỏ qua
        </Button>
      </div>
    </div>
  );
}
