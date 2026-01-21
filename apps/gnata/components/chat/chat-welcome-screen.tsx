import { Button } from "@/components/ui/button";
import { GnataLogo } from "@/components/GnataLogo";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  Palette,
  Rocket,
  AppWindow,
  Briefcase,
  PanelsTopLeft,
  Smartphone
} from "lucide-react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const chatModes = [
  { id: "ecommerce", label: "E-commerce", icon: ShoppingBag },
  { id: "portfolio", label: "Portfolio", icon: Palette },
  { id: "saas", label: "SaaS / App", icon: AppWindow, pro: true },
  { id: "landing", label: "Landing Page", icon: Rocket },
  { id: "mobile", label: "App Mobile", icon: Smartphone, pro: true },
  { id: "vitrine", label: "Site Vitrine", icon: Briefcase },
  { id: "custom", label: "Sur Mesure", icon: PanelsTopLeft },
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
    "Je veux un site e-commerce pour vendre des chaussures...",
    "Je souhaiterais un portfolio minimaliste pour mes photos...",
    "J'ai besoin d'une landing page pour mon application SaaS...",
    "Je veux un site de restaurant avec réservation à Paris...",
    "Je souhaiterais un blog tech moderne avec dark mode...",
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
                <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-400 border border-purple-500/20 shadow-sm shadow-purple-500/10">
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


