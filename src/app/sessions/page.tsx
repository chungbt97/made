"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SessionList } from "@/components/session/session-list";

export default function SessionsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("unlocked") !== "true") {
      window.location.replace("/");
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8">
      <SessionList onOpenSession={(id) => router.push(`/session/${id}`)} />
    </div>
  );
}
