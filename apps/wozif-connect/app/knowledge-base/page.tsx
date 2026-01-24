"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Database, FileText, Loader2, Plus, Search } from "lucide-react";

type KnowledgeBaseListItem = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count: { documents: number; sources: number };
};

export default function KnowledgeBasePage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id as string | undefined;

  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [activeKbId, setActiveKbId] = useState<string | null>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const activeKb = useMemo(
    () => knowledgeBases.find((k) => k.id === activeKbId) || null,
    [knowledgeBases, activeKbId],
  );

  const fetchKBs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/knowledge-bases");
      const data = await res.json();
      if (data?.success) {
        setKnowledgeBases(data.knowledgeBases || []);
        if (!activeKbId && data.knowledgeBases?.[0]?.id) {
          setActiveKbId(data.knowledgeBases[0].id);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchKBs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const createKB = async () => {
    const name = newName.trim();
    if (!name) return;

    setCreating(true);
    try {
      const res = await fetch("/api/knowledge-bases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (data?.success) {
        setNewName("");
        await fetchKBs();
        setActiveKbId(data.knowledgeBase?.id || null);
      } else {
        alert(data?.error || "Erreur création");
      }
    } finally {
      setCreating(false);
    }
  };

  const uploadPdf = async () => {
    if (!activeKbId) return;
    if (!pdfFile) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", pdfFile);
      form.append("title", pdfFile.name);

      const res = await fetch(`/api/knowledge-bases/${activeKbId}/documents`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (data?.success) {
        setPdfFile(null);
        await fetchKBs();
        alert(`PDF indexé: ${data.document?.title} (${data.document?.chunks} chunks)`);
      } else {
        alert(data?.details ? `${data.error}\n${data.details}` : data?.error || "Erreur upload");
      }
    } finally {
      setUploading(false);
    }
  };

  const search = async () => {
    if (!activeKbId) return;
    const q = query.trim();
    if (!q) return;

    setSearching(true);
    try {
      const res = await fetch(`/api/knowledge-bases/${activeKbId}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, limit: 6 }),
      });
      const data = await res.json();
      if (data?.success) {
        setResults(data.results || []);
      } else {
        alert(data?.error || "Erreur recherche");
      }
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden font-sans">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden text-white/90">
        <DashboardHeader />

        <div className="flex-1 overflow-y-auto custom-scrollbar md:p-8 p-4">
          <div className="max-w-[1400px] mx-auto space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Database className="h-5 w-5 text-white/70" />
                </div>
                <div>
                  <h1 className="text-lg font-black text-white">Knowledge Base</h1>
                  <p className="text-xs text-white/50">Connecte des sources (PDF maintenant, Google Sheets / Postgres ensuite)</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nom de la base (ex: FAQ Support)"
                  className="w-[280px] bg-white/5 border-white/10 text-white"
                />
                <Button onClick={createKB} disabled={creating || !newName.trim()}>
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Créer
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-white/60 uppercase tracking-widest">Bases</p>
                    <Button variant="ghost" size="sm" onClick={fetchKBs} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rafraîchir"}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {knowledgeBases.length === 0 && (
                      <div className="text-xs text-white/40">Aucune base. Créez-en une.</div>
                    )}
                    {knowledgeBases.map((kb) => (
                      <button
                        key={kb.id}
                        onClick={() => setActiveKbId(kb.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all ${activeKbId === kb.id ? "bg-white/10 border-white/15" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">{kb.name}</p>
                            <p className="text-[10px] text-white/50">{kb._count.documents} docs • {kb._count.sources} sources</p>
                          </div>
                          <Badge className="bg-white/10 text-white/70 border-none text-[9px]">ID …{kb.id.slice(-6)}</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 lg:col-span-2">
                <CardContent className="p-4 space-y-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-white/60 uppercase tracking-widest">PDF Upload (MVP)</p>
                    {activeKb && (
                      <Badge className="bg-indigo-500/15 text-indigo-200 border-none text-[10px]">{activeKb.name}</Badge>
                    )}
                  </div>

                  {!activeKbId ? (
                    <div className="text-xs text-white/40">Sélectionne une base à gauche.</div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <label className="flex-1">
                          <div className="flex items-center gap-2 p-3 rounded-2xl bg-black/20 border border-white/10">
                            <FileText className="h-4 w-4 text-white/60" />
                            <span className="text-xs text-white/70">{pdfFile ? pdfFile.name : "Choisir un PDF"}</span>
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                            />
                          </div>
                        </label>
                        <Button onClick={uploadPdf} disabled={uploading || !pdfFile}>
                          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Indexer"}
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Tester la recherche (ex: livraison, garantie, prix...)"
                          className="flex-1 bg-white/5 border-white/10 text-white"
                        />
                        <Button onClick={search} disabled={searching || !query.trim()}>
                          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                          Rechercher
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {results.length === 0 ? (
                          <div className="text-xs text-white/40">Aucun résultat. Indexe un PDF puis cherche.</div>
                        ) : (
                          results.map((r) => (
                            <div key={r.id} className="p-3 rounded-2xl bg-black/20 border border-white/10">
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-[11px] font-bold text-white/80 truncate">{r.document?.title}</p>
                                <Badge className="bg-white/10 text-white/70 border-none text-[9px]">chunk #{r.chunkIndex}</Badge>
                              </div>
                              <p className="text-xs text-white/60 leading-relaxed line-clamp-4">{r.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
