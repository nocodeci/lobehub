import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PaperclipIcon } from "lucide-react";
import { ChatMessage } from "./chat-message";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  toolInvocations?: any[];
}

interface ChatConversationViewProps {
  messages: Message[];
  message: string;
  onMessageChange: (value: string) => void;
  onSend: (content: string) => void;
  isLoading?: boolean;
}

function ChatTypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 select-none items-center justify-center rounded-full border bg-card text-primary shadow-sm">
        <div className="size-4 animate-pulse rounded-full bg-primary/20" />
      </div>
      <div className="mt-1 flex gap-1 rounded-2xl bg-muted px-4 py-3">
        <span className="size-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:-0.3s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:-0.15s]" />
        <span className="size-1.5 animate-bounce rounded-full bg-foreground/30" />
      </div>
    </div>
  );
}

export function ChatConversationView({
  messages,
  message,
  onMessageChange,
  onSend,
  isLoading,
}: ChatConversationViewProps) {
  const scrollEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
        <div className="max-w-[640px] mx-auto space-y-6">

          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onSend={onSend} />
          ))}
          {isLoading && <ChatTypingIndicator />}
          <div ref={scrollEndRef} />
        </div>
      </div>

      <div className="border-t border-border px-4 md:px-8 py-[17px]">
        <div className="max-w-[640px] mx-auto">
          <div className="rounded-2xl border border-border bg-secondary dark:bg-card p-1">
            <div className="rounded-xl border border-border dark:border-transparent bg-card dark:bg-secondary">
              <Textarea
                placeholder="Continuez la conversation..."
                value={message}
                onChange={(e) => onMessageChange(e.target.value)}
                className="min-h-[80px] resize-none border-0 bg-transparent px-4 py-3 text-base placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (message.trim()) {
                      onSend(message);
                      onMessageChange("");
                    }
                  }
                }}
              />

              <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 rounded-full border border-border dark:border-input bg-card dark:bg-secondary hover:bg-accent"
                  >
                    <PaperclipIcon className="size-4 text-muted-foreground" />
                  </Button>
                </div>

                <Button
                  size="sm"
                  onClick={() => {
                    if (message.trim()) {
                      onSend(message);
                      onMessageChange("");
                    }
                  }}
                  className="h-7 px-4"
                >
                  Envoyer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

