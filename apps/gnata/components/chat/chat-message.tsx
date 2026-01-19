import { cn } from "@/lib/utils";
import { GnataLogo } from "../GnataLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoUpload } from "./logo-upload";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  toolInvocations?: any[];
}

interface ChatMessageProps {
  message: Message;
  onSend?: (content: string) => void;
}

export function ChatMessage({ message, onSend }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-4",
        message.sender === "user" ? "justify-end" : "justify-start"
      )}
    >
      {message.sender === "ai" && (
        <div className="shrink-0">
          <div className="size-8 rounded-full bg-secondary flex items-center justify-center">
            <GnataLogo className="size-6" />
          </div>
        </div>
      )}

      <div
        className={cn(
          "rounded-2xl px-4 py-3 max-w-[80%] overflow-hidden text-sm leading-relaxed", // Added typography styles back
          message.sender === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-secondary"
        )}
      >
        <ReactMarkdown
          components={{
            a: ({ node, ...props }: any) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline text-blue-500 hover:text-blue-400 break-words"
              />
            ),
            p: ({ node, ...props }: any) => <p {...props} className="mb-1 last:mb-0" />,
            ul: ({ node, ...props }: any) => <ul {...props} className="list-disc pl-4 space-y-1" />,
            ol: ({ node, ...props }: any) => <ol {...props} className="list-decimal pl-4 space-y-1" />,
          }}
        >
          {message.content}
        </ReactMarkdown>

        {/* Render Logo Upload if requested by tool */}
        {message.sender === "ai" && message.toolInvocations?.some(tool => tool.toolName === 'requestLogo') && (
          <LogoUpload onUpload={(file) => {
            console.log("Uploaded logo:", file.name);
            if (onSend) {
              onSend("Voilà mon logo, qu'en penses-tu ?");
            }
          }} />
        )}
      </div>

      {message.sender === "user" && (
        <div className="shrink-0">
          <Avatar className="size-8">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>
              <span className="bg-muted flex size-full items-center justify-center rounded-full">
                U
              </span>
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
}

