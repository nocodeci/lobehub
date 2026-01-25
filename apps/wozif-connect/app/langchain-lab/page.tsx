"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ApiResponse =
  | {
      success: true;
      sessionId: string;
      output: string;
      memorySize: number;
    }
  | {
      success: false;
      error: string;
      details?: string;
    };

export default function LangChainLabPage() {
  const [prompt, setPrompt] = React.useState("");
  const [systemPrompt, setSystemPrompt] = React.useState("Tu es un agent IA utile.");
  const [model, setModel] = React.useState("gpt-4o-mini");
  const [temperature, setTemperature] = React.useState("0.4");
  const [useMemory, setUseMemory] = React.useState(true);
  const [sessionId, setSessionId] = React.useState<string>("");

  const [isRunning, setIsRunning] = React.useState(false);
  const [output, setOutput] = React.useState("");
  const [error, setError] = React.useState<string>("");
  const [details, setDetails] = React.useState<string>("");

  const run = async (resetMemory: boolean) => {
    setIsRunning(true);
    setError("");
    setDetails("");

    try {
      const res = await fetch("/api/langchain-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          systemPrompt,
          model,
          temperature: Number.isFinite(Number(temperature)) ? Number(temperature) : undefined,
          useMemory,
          sessionId: sessionId || undefined,
          resetMemory,
        }),
      });

      const data = (await res.json()) as ApiResponse;

      if (!data.success) {
        setError(data.error);
        setDetails(data.details || "");
        setOutput("");
        return;
      }

      setSessionId(data.sessionId);
      setOutput(data.output);
    } catch (e: any) {
      setError("Erreur client");
      setDetails(e?.message || String(e));
      setOutput("");
    } finally {
      setIsRunning(false);
    }
  };

  const canRun = prompt.trim().length > 0 && !isRunning;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight">LangChain Lab</h1>
            <p className="text-sm text-muted-foreground">
              Page publique pour tester une intégration LangChain côté serveur.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Public</Badge>
            <Badge variant="outline">Session: {sessionId ? sessionId : "nouvelle"}</Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Modèle, system prompt, mémoire.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Modèle</label>
                <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="gpt-4o-mini" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Température</label>
                <Input value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="0.4" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">System prompt</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={useMemory}
                onChange={(e) => setUseMemory(e.target.checked)}
                className="h-4 w-4"
              />
              Utiliser la mémoire (session)
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test</CardTitle>
            <CardDescription>Envoie un prompt à l’agent.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Écris ton prompt ici..."
                className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={() => run(false)} disabled={!canRun}>
                {isRunning ? "Running..." : "Run"}
              </Button>
              <Button onClick={() => run(true)} disabled={!canRun} variant="outline">
                Reset mémoire + Run
              </Button>
              <Button
                onClick={() => {
                  setSessionId("");
                  setOutput("");
                  setError("");
                  setDetails("");
                }}
                variant="ghost"
                disabled={isRunning}
              >
                Nouvelle session
              </Button>
            </div>

            {error ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 space-y-2">
                <div className="text-sm font-semibold text-red-300">{error}</div>
                {details ? (
                  <pre className="text-xs text-red-200/80 whitespace-pre-wrap break-words">{details}</pre>
                ) : null}
              </div>
            ) : null}

            {output ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-2">
                <div className="text-xs text-muted-foreground">Output</div>
                <pre className="text-sm whitespace-pre-wrap break-words">{output}</pre>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
