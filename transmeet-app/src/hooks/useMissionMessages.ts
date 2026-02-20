"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface MissionMessage {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export function useMissionMessages(missionId: string | null, initialMessages: MissionMessage[] = []) {
  const [messages, setMessages] = useState<MissionMessage[]>(initialMessages);

  useEffect(() => {
    if (!missionId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`mission:${missionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `mission_id=eq.${missionId}` },
        (payload) => {
          const newRow = payload.new as MissionMessage;
          setMessages((prev) => [...prev, newRow]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [missionId]);

  return messages;
}
