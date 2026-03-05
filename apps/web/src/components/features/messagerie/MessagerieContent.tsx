"use client";

import { useState, useMemo } from "react";
import { Search, Send, Paperclip, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const NAVY = "#1B2B5E";
const GOLD = "#F5A623";

type MessageType = "sent" | "received" | "system";

interface Message {
  id: string;
  type: MessageType;
  text: string;
  time: string;
  read?: boolean;
}

interface Conversation {
  id: string;
  contactName: string;
  missionRef: string;
  online: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  messages: Message[];
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    contactName: "Trans Bénin Express",
    missionRef: "MSN-2024-001",
    online: true,
    lastMessage: "Le chargement sera terminé vers 14h, je vous tiens au courant.",
    lastMessageTime: "14:32",
    unread: 2,
    messages: [
      {
        id: "m1",
        type: "system",
        text: "Mission #MSN-2024-001 confirmée",
        time: "10:00",
      },
      {
        id: "m2",
        type: "sent",
        text: "Bonjour, pouvez-vous confirmer l'heure de chargement prévue ?",
        time: "10:15",
        read: true,
      },
      {
        id: "m3",
        type: "received",
        text: "Bonjour, oui le chargement est prévu demain matin à 8h.",
        time: "10:22",
      },
      {
        id: "m4",
        type: "sent",
        text: "Parfait, merci pour la précision.",
        time: "10:25",
        read: true,
      },
      {
        id: "m5",
        type: "received",
        text: "Le chargement sera terminé vers 14h, je vous tiens au courant.",
        time: "14:32",
      },
    ],
  },
  {
    id: "2",
    contactName: "Logistics Sahel SARL",
    missionRef: "MSN-2024-002",
    online: false,
    lastMessage: "D'accord, je vous envoie les documents ce soir.",
    lastMessageTime: "Hier",
    unread: 0,
    messages: [
      {
        id: "m6",
        type: "system",
        text: "Mission #MSN-2024-002 en cours de chargement",
        time: "09:00",
      },
      {
        id: "m7",
        type: "received",
        text: "Pouvez-vous m'envoyer la carte grise du véhicule pour les formalités ?",
        time: "11:00",
      },
      {
        id: "m8",
        type: "sent",
        text: "D'accord, je vous envoie les documents ce soir.",
        time: "18:45",
        read: true,
      },
    ],
  },
  {
    id: "3",
    contactName: "Flotte Ouest",
    missionRef: "MSN-2024-003",
    online: true,
    lastMessage: "Merci pour votre confiance !",
    lastMessageTime: "11:20",
    unread: 0,
    messages: [
      {
        id: "m9",
        type: "system",
        text: "Mission #MSN-2024-003 livrée avec succès",
        time: "10:30",
      },
      {
        id: "m10",
        type: "received",
        text: "La livraison a bien eu lieu. Tout est conforme.",
        time: "10:45",
      },
      {
        id: "m11",
        type: "sent",
        text: "Merci pour votre confiance !",
        time: "11:20",
        read: true,
      },
    ],
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function MessagerieContent() {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return MOCK_CONVERSATIONS;
    const q = search.toLowerCase();
    return MOCK_CONVERSATIONS.filter((c) =>
      c.contactName.toLowerCase().includes(q) ||
      c.missionRef.toLowerCase().includes(q)
    );
  }, [search]);

  const activeConversation = activeId
    ? MOCK_CONVERSATIONS.find((c) => c.id === activeId)
    : null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] -mx-6 -mb-6">
      {/* Left column - Conversations list */}
      <div
        className={cn(
          "flex flex-col border-r bg-card w-full md:w-80 shrink-0",
          activeId && "hidden md:flex"
        )}
      >
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              type="button"
              onClick={() => setActiveId(conv.id)}
              className={cn(
                "w-full flex items-start gap-3 p-4 text-left hover:bg-muted/50 transition-colors border-b",
                activeId === conv.id && "bg-muted/30"
              )}
              style={activeId === conv.id ? { backgroundColor: `${NAVY}08` } : undefined}
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback
                  className="text-xs font-medium"
                  style={{ backgroundColor: `${NAVY}20`, color: NAVY }}
                >
                  {getInitials(conv.contactName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{conv.contactName}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {conv.lastMessageTime}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm text-muted-foreground truncate flex-1">
                    {conv.lastMessage}
                  </p>
                  {conv.unread > 0 && (
                    <span
                      className="shrink-0 flex items-center justify-center h-5 min-w-5 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: GOLD }}
                    >
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right column - Active conversation */}
      <div
        className={cn(
          "flex flex-col flex-1 bg-background",
          !activeId && "hidden md:flex md:items-center md:justify-center"
        )}
      >
        {activeConversation ? (
          <>
            <div className="flex items-center gap-3 p-4 border-b shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setActiveId(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback
                  className="text-xs font-medium"
                  style={{ backgroundColor: `${NAVY}20`, color: NAVY }}
                >
                  {getInitials(activeConversation.contactName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">
                  {activeConversation.contactName}
                </p>
                <p className="text-xs text-muted-foreground">
                  #{activeConversation.missionRef}
                  {activeConversation.online && (
                    <span className="ml-2 inline-flex items-center gap-1 text-green-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      En ligne
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeConversation.messages.map((msg) => {
                if (msg.type === "system") {
                  return (
                    <div
                      key={msg.id}
                      className="flex justify-center"
                    >
                      <span className="text-xs italic text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                        {msg.text} — {msg.time}
                      </span>
                    </div>
                  );
                }
                const isSent = msg.type === "sent";
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      isSent ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-2",
                        isSent
                          ? "rounded-br-md"
                          : "rounded-bl-md bg-muted/60"
                      )}
                      style={
                        isSent
                          ? { backgroundColor: GOLD, color: NAVY }
                          : undefined
                      }
                    >
                      <p className="text-sm">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] opacity-80">{msg.time}</span>
                        {isSent && msg.read && (
                          <span className="text-[10px] opacity-80">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 p-4 border-t shrink-0"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground"
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Écrire un message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0"
                style={{ backgroundColor: GOLD, color: NAVY }}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </>
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center text-center p-8">
            <p className="text-muted-foreground">
              Sélectionnez une conversation
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
