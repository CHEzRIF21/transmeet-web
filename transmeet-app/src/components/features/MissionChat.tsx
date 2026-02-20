"use client";

import { useState, useRef, useEffect } from "react";
import { useMissionMessages } from "@/hooks/useMissionMessages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MissionChatProps {
  missionId: string;
  currentUserId: string;
  initialMessages: { id: string; sender_id: string; content: string; created_at: string }[];
}

export function MissionChat({ missionId, currentUserId, initialMessages }: MissionChatProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const messages = useMissionMessages(missionId, initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mission_id: missionId, content: content.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setContent("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[400px] flex-col rounded-lg border bg-card">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "max-w-[80%] rounded-lg px-3 py-2 text-sm",
              m.sender_id === currentUserId
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p>{m.content}</p>
            <p className={cn("mt-1 text-xs", m.sender_id === currentUserId ? "text-primary-foreground/80" : "text-muted-foreground")}>
              {new Date(m.created_at).toLocaleString()}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t p-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Votre message…"
          className="flex-1"
          disabled={sending}
        />
        <Button type="submit" disabled={sending || !content.trim()}>
          Envoyer
        </Button>
      </form>
    </div>
  );
}
