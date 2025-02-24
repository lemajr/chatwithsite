"use client";

import { Message, useChat } from "ai/react";
import { ChatInput } from "./ChatInput";
import { Messages } from "./messages";

export const ChatWrapper = ({
  sessionId,
  initialMessages,
}: {
  sessionId: string;
  initialMessages: Message[];
}) => {
  const { messages, handleInputChange, handleSubmit, input, setInput } = useChat({
    api: "/api/chat-stream",
    body: { sessionId },
    initialMessages,
  });

  return (
    <div className="relative min-h-full bg-zinc-900 flex flex-col justify-between gap-2">
      {/* Messages container with overflow */}
      <div
        className="flex-1 text-black bg-zinc-800 flex flex-col overflow-y-auto p-4"
      >
        <Messages messages={messages} />
      </div>

      {/* Chat Input */}
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        setInput={setInput}
      />
    </div>
  );
};
