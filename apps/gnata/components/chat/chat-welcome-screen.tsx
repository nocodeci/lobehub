import { Button } from "@/components/ui/button";
import { GnataLogo } from "@/components/GnataLogo";
import { cn } from "@/lib/utils";
import {
  ZapIcon,
  MessageCircleDashedIcon,
  WandSparklesIcon,
  BoxIcon,
} from "lucide-react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const chatModes = [
  { id: "fast", label: "Rapide", icon: ZapIcon },
  { id: "in-depth", label: "Détaillé", icon: MessageCircleDashedIcon },
  { id: "magic", label: "Vibe AI", icon: WandSparklesIcon, pro: true },
  { id: "holistic", label: "Holistique", icon: BoxIcon },
];

interface ChatWelcomeScreenProps {
  onMessageChange: (value: string) => void;
  onSend: () => void;
  selectedMode: string;
  onModeChange: (modeId: string) => void;
}

export function ChatWelcomeScreen({
  onMessageChange,
  onSend,
  selectedMode,
  onModeChange,
}: ChatWelcomeScreenProps) {
  const placeholders = [
    "Crée-moi un site e-commerce pour vendre des chaussures...",
    "Je veux un portfolio minimaliste pour mes photos...",
    "Génère une landing page pour mon application SaaS...",
    "Fais un site de restaurant avec réservation à Paris...",
    "Un blog tech moderne avec dark mode...",
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 md:px-8">
      <div className="w-full max-w-[640px] space-y-9 -mt-12">
        <div className="flex justify-center">
          <div className="flex items-center justify-center size-20 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <GnataLogo className="size-12" />
          </div>
        </div>

        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Bonjour, je suis Gnata AI
          </h1>
          <p className="text-xl text-muted-foreground">
            Que construisons-nous aujourd&apos;hui ?
          </p>
        </div>

        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={(e) => onMessageChange(e.target.value)}
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
        />

        <div className="flex flex-wrap items-center justify-center gap-2">
          {chatModes.map((mode) => (
            <Button
              key={mode.id}
              variant={selectedMode === mode.id ? "secondary" : "ghost"}
              className={cn("gap-2", selectedMode === mode.id && "bg-accent")}
              onClick={() => onModeChange(mode.id)}
            >
              <mode.icon className="size-4" />
              <span>{mode.label}</span>
              {mode.pro && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium">
                  Pro
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 text-center">
        <p className="text-sm text-muted-foreground">
          Powered by Vibe Coders.
        </p>
      </div>
    </div>
  );
}


