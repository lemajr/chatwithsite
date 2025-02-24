"use client";

import { useState, useEffect } from "react";
import { ChatWrapper } from "@/components/ChatWrapper";
import { UrlModal } from "@/components/UrlModal";

const Page = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState([]);

  useEffect(() => {
    const startSession = async () => {
      if (!url) return;

      try {
        const res = await fetch("/api/session", {
          method: "POST",
          body: JSON.stringify({ url }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        setSessionId(data.sessionId);
        setInitialMessages(data.initialMessages);
      } catch (error) {
        console.error("Failed to start session:", error);
      }
    };

    startSession();
  }, [url]);

  if (!url) {
    return <UrlModal onSubmit={setUrl} />;
  }

  if (!sessionId) {
    return <p className="text-center text-white">Initializing chat...</p>;
  }

  return <ChatWrapper sessionId={sessionId} initialMessages={initialMessages} />;
};

export default Page;
