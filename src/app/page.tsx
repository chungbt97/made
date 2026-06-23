"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("unlocked") === "true") {
      const target = sessionStorage.getItem("redirectTarget") || "/sessions";
      sessionStorage.removeItem("redirectTarget");
      router.replace(target);
    } else {
      setChecking(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: input.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem("unlocked", "true");
        sessionStorage.setItem("role", data.role || "viewer");
        const target = sessionStorage.getItem("redirectTarget") || "/sessions";
        sessionStorage.removeItem("redirectTarget");
        router.replace(target);
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    }
  };

  if (checking) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffaf0]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#0a0a0a]">Hello World</h1>
        {submitted && (
          <p className="mt-3 text-lg text-[#3a3a3a]">
            Hello World: {input}
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center gap-4">
          <div className="w-72">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập mã..."
              autoFocus
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}
