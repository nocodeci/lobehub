
import os

backup_path = "/Users/koffiyohanerickouakou/Library/Application Support/Antigravity/User/History/-3e04c9e6/i55F.tsx"
target_path = "/Users/koffiyohanerickouakou/wozif/apps/wozif-connect/app/automations/new/page.tsx"

with open(backup_path, 'r') as f:
    content = f.read()

# Define the markers precisely
marker_sidebar_start = '<aside className="w-72 border-r border-white/10 bg-card/60 flex flex-col overflow-hidden">'
marker_help_box = '{/* Help Box */}'
marker_canvas_start = '{/* Canvas Main Container */}'
marker_bottom_panel = '{/* Standardized Bottom Panel - Logs & Data inspector */}'
marker_right_panel = '{/* Floating Right Panel - Drawer Style */}'

# We will reconstruct the whole section between sidebar start and right panel start.

idx_sidebar = content.find(marker_sidebar_start)
idx_right = content.find(marker_right_panel)

if idx_sidebar != -1 and idx_right != -1:
    before = content[:idx_sidebar]
    after = content[idx_right:]
    
    # We need to extract the Sidebar content (without the Canvas and Help box mess)
    # The sidebar content ends where Help Box would normally end if it wasn't broken.
    # Looking at the code, Help Box starts at 4161 and seems to be the end of Sidebar.
    
    # Actually, let's just use the known structure to fix it.
    
    # Let's extract Sidebar from idx_sidebar to marker_help_box
    idx_help = content.find(marker_help_box, idx_sidebar)
    sidebar_content = content[idx_sidebar:idx_help]
    
    # Extract Canvas content from marker_canvas_start to marker_bottom_panel
    idx_canvas = content.find(marker_canvas_start)
    idx_bottom = content.find(marker_bottom_panel)
    canvas_content = content[idx_canvas:idx_bottom]
    
    # Reconstruct
    rebuilt = sidebar_content
    rebuilt += """                  {/* Help Box - FIXED */}
                  <div className="p-4 border-t border-white/10 mt-auto">
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="h-3 w-3 text-primary" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Astuce</span>
                      </div>
                      <p className="text-[9px] text-muted-foreground/60 leading-relaxed">
                        Utilisez les connecteurs pour lier les blocs entre eux. Le déclencheur est toujours le premier bloc.
                      </p>
                    </div>
                  </div>
                </aside>

                {/* Workflow Canvas - FIXED */}
                <div className="flex-1 relative overflow-hidden bg-background/50 select-none">
"""
    # Now add the canvas content, but we need to clean up its ending
    # The canvas_content in the backup currently ends with broken divs.
    # Let's clean it up. We find where it starts (the first <div after marker_canvas_start)
    
    # Actually, I'll just write a known good structure for the canvas container.
    # The canvas_content starts with <div className="flex-1 relative overflow-hidden bg-background/50 select-none">
    # which is already in my rebuilt above.
    
    inner_canvas_ptr = content.find('<div className="flex-1 relative overflow-hidden bg-background/50 select-none">')
    inner_canvas_content = content[inner_canvas_ptr + len('<div className="flex-1 relative overflow-hidden bg-background/50 select-none">'):idx_bottom]
    
    # Remove the broken closing divs at the end of inner_canvas_content
    # It has things like </div> </div> )} </div> </div> which are wrong.
    # The inner canvas content should end just after idx_bottom was found.
    # No, idx_bottom is outside.
    
    # Let's find the true end of the canvas content. 
    # It ends with the close of the node picker or the last fragment.
    # In the backup at 4664 we have </> and then )} and </div> </div>.
    
    true_canvas_end = content.rfind('</>', idx_sidebar, idx_bottom)
    if true_canvas_end != -1:
        inner_canvas_content = content[inner_canvas_ptr + len('<div className="flex-1 relative overflow-hidden bg-background/50 select-none">'):true_canvas_end + 3]
        
    rebuilt += inner_canvas_content
    rebuilt += """
                </div>

                {/* Standardized Bottom Panel - FIXED */}
                <AnimatePresence>
                  {isBottomPanelOpen && (
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      style={{ height: bottomPanelHeight }}
                      className="absolute bottom-0 left-0 right-0 z-[150] bg-[#111111]/95 backdrop-blur-xl border-t border-white/10 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
                    >
                      {/* Resize handle */}
                      <div
                        className="h-1 w-full cursor-ns-resize hover:bg-primary/40 transition-colors flex items-center justify-center group"
                        onMouseDown={handleBottomPanelResize}
                      >
                        <div className="h-1 w-12 rounded-full bg-white/10 group-hover:bg-primary/60 transition-colors" />
                      </div>

                      {/* Header area with tabs */}
                      <div className="flex items-center justify-between px-4 py-1 border-b border-white/5 bg-black/20">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setBottomPanelTab("logs")}
                            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${bottomPanelTab === "logs" ? "bg-white/10 text-white" : "text-muted-foreground hover:bg-white/5"}`}
                          >
                            <div className="flex items-center gap-2">
                              <Terminal className="h-3 w-3" /> Console
                              {executionLogs.some((l) => typeof l === 'object' && l.status === 'error') && (
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                              )}
                            </div>
                          </button>
                          <button
                            onClick={() => setBottomPanelTab("data")}
                            className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${bottomPanelTab === "data" ? "bg-white/10 text-white" : "text-muted-foreground hover:bg-white/5"}`}
                          >
                            <div className="flex items-center gap-2">
                              <Activity className="h-3 w-3" /> Inspecteur
                            </div>
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-4 w-px bg-white/10" />
                          <button
                            onClick={() => setIsBottomPanelOpen(false)}
                            className="p-1.5 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-all"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 overflow-hidden p-4">
                        {bottomPanelTab === "logs" ? (
                          <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Historique d'exécution</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                              {executionLogs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                                  <Activity className="h-10 w-10 mb-2" />
                                  <p className="text-xs">Aucun log disponible</p>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {executionLogs.map((log, i) => {
                                    const isRichLog = typeof log === 'object' && log.nodeType;
                                    const status = isRichLog ? log.status : (typeof log === 'string' && log.includes('[ERROR]') ? 'error' : 'success');
                                    const nodeName = isRichLog ? log.nodeName : 'Étape';
                                    const message = isRichLog ? log.message : (typeof log === 'string' ? log.replace(/\[.*?\]\\s*/, '') : String(log));
                                    return (
                                      <div key={i} className={`p-3 rounded-xl border ${status === 'error' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-[10px] font-bold text-white">{nodeName}</span>
                                          <span className="text-[8px] text-muted-foreground uppercase">{status}</span>
                                        </div>
                                        <p className="text-[10px] text-white/70 font-mono truncate">{message}</p>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Variables de Contexte</h3>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                              {Object.keys(nodeResults).length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                                  <Zap className="h-10 w-10 mb-2" />
                                  <p className="text-xs">Videz les caches ou simulez pour voir les données</p>
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {Object.entries(nodeResults).reverse().map(([nodeId, result]) => {
                                    if (!result.data || Object.keys(result.data).length === 0) return null;
                                    return (
                                      <div key={nodeId} className="bg-white/5 border border-white/10 rounded-xl p-3">
                                        <div className="text-[10px] font-bold text-white/50 mb-2 truncate">#{nodeId} - BLOC {nodeId}</div>
                                        <div className="space-y-2">
                                          {Object.entries(result.data).map(([key, value]) => (
                                            <div key={key} className="flex flex-col gap-1 bg-black/40 rounded-lg p-2">
                                              <code className="text-[10px] text-emerald-400 font-bold">{"{{"}{key}{"}}"}</code>
                                              <span className="text-[10px] text-white/80 truncate">{String(value)}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

"""
    # Note that 5164-5166 (the old closing part) are already handled in the built string.
    # We need to skip the old ones in the 'after' string to avoid duplicates.
    # The old closing was: 
    # 5164: </div> (closes 4051)
    # 5165: </motion.div> (closes 3955)
    # 5166: )} (closes 3954)
    # 5167: (Empty or next mode)
    
    # Let's find the start of the next section "Mode: Products Management"
    idx_next_mode = content.find('{/* Mode: Products Management */}')
    after_clean = content[idx_next_mode:]
    
    with open(target_path, 'w') as f:
        f.write(before + rebuilt + after_clean)
        
    print("RESTORED AND PATCIHED SUCCESSFULLY (V4)")
else:
    print(f"Markers not found: sidebar={idx_sidebar}, right={idx_right}")
