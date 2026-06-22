"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const [checking, setChecking] = useState(true);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("unlocked") === "true") {
      window.location.replace("/sessions");
    } else {
      setChecking(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "25251325") {
      sessionStorage.setItem("unlocked", "true");
      window.location.replace("/sessions");
    } else {
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
