import { useEffect, useRef } from "react";
import { type Message as TMessage } from "ai/react";
import { Message } from "./Message";
import { MessageSquare } from "lucide-react";

interface MessagesProps {
  messages: TMessage[];
}

export const Messages = ({ messages }: MessagesProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Scroll to bottom initially
    container.scrollTop = container.scrollHeight;

    // Observer to detect new messages and scroll
    const observer = new MutationObserver(() => {
      container.scrollTop = container.scrollHeight;
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [messages]);

  return (
    <div
      ref={messagesContainerRef}
      className="flex max-h-[calc(100vh-3.5rem-7rem)] flex-1 flex-col overflow-y-auto p-4"
    >
      {messages.length ? (
        messages.map((message, i) => (
          <Message key={i} content={message.content} isUserMessage={message.role === "user"} />
        ))
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="size-8 text-blue-500" />
          <h3 className="font-semibold text-xl text-white">You're all set!</h3>
          <p className="text-zinc-500 text-sm">Ask your first question to get started.</p>
        </div>
      )}
    </div>
  );
};
