"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, Zap, Activity, Users, AlertTriangle, FileSearch, Loader2, Globe, Terminal, ShieldAlert, Cpu } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ScamAlertCard } from "@/components/scam-alert-card"
import { createClient } from "@supabase/supabase-js"

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// Engaging Terminal Scan Sequence
const SCAN_STEPS = [
  "Initializing Sovereign Protocol...",
  "Extracting URL entities and payloads...",
  "Pinging global RDAP/WHOIS registries...",
  "Analyzing domain age & registrar history...",
  "Cross-referencing Syndicate Threat Feed...",
  "Synthesizing heuristic matrix via Gemini Core...",
  "Finalizing verdict..."
]

export default function Home() {
  const [content, setContent] = useState("")
  const [brandName, setBrandName] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanStep, setScanStep] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [recentThreats, setRecentThreats] = useState<any[]>([])
  const [totalStopped, setTotalStopped] = useState(1248)

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    fetchCommunityData(supabase)
    const channel = supabase.channel('threats').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_threats' }, () => { fetchCommunityData(supabase) }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchCommunityData = async (supabase: any) => {
    const { data } = await supabase.from('community_threats').select('*').order('created_at', { ascending: false }).limit(4)
    const { count } = await supabase.from('community_threats').select('*', { count: 'exact', head: true })
    if (data) setRecentThreats(data)
    if (count) setTotalStopped(1248 + count)
  }

  // Animation hook for the terminal
  useEffect(() => {
    let interval: any;
    if (isScanning) {
      interval = setInterval(() => {
        setScanStep((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
      }, 1200);
    } else {
      setScanStep(0);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const runScan = async () => {
    if (!content) return
    setIsScanning(true)
    setResult(null)
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        body: JSON.stringify({ content, brandName })
      })
      const responseText = await res.text();
      if (!res.ok) throw new Error(responseText || "Node Offline");
      setResult(JSON.parse(responseText))
    } catch (e: any) {
      alert(`Node Sync Error: ${e.message}`);
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <Zap className="h-3 w-3 fill-primary animate-pulse" /> Syndicate OS Activated
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.85] uppercase italic drop-shadow-2xl">
              Weaponize<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Intelligence.</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Don't just ask an AI. Our engine extracts URLs, pings global DNS registries for domain age, and synthesizes hard forensic evidence to catch student scams.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Console */}
      <section className="py-12 z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* The Forensic Scanner */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-8 rounded-[2rem] bg-card/80 backdrop-blur-2xl border border-border shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Terminal className="text-primary h-6 w-6" />
                    <h3 className="text-xl font-black text-foreground uppercase tracking-widest">Active Probe Node</h3>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/50" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>

                <div className="space-y-4 relative">
                  <input className="w-full h-14 bg-background/50 border border-border rounded-xl px-6 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground transition-all" placeholder="Target Identifier (Company/Recruiter Name)..." value={brandName} onChange={e => setBrandName(e.target.value)} />
                  <textarea className="w-full h-56 bg-background/50 border border-border rounded-2xl p-6 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground transition-all resize-none" placeholder="Paste the suspicious email, job offer, or raw URLs here. Our engine will automatically extract and ping domains..." value={content} onChange={e => setContent(e.target.value)} />
                  
                  {/* Cyber Overlay during scan */}
                  <AnimatePresence>
                    {isScanning && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-8 border border-primary/50 shadow-[inset_0_0_50px_rgba(99,102,241,0.1)]">
                        <Cpu className="h-16 w-16 text-primary animate-pulse mb-6" />
                        <div className="h-2 w-full max-w-md bg-zinc-800 rounded-full overflow-hidden mb-4">
                          <motion.div className="h-full bg-primary" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 8, ease: "linear" }} />
                        </div>
                        <p className="font-mono text-primary font-bold text-sm tracking-widest uppercase">{SCAN_STEPS[scanStep]}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button onClick={runScan} disabled={isScanning || !content} className="mt-6 w-full h-16 text-lg font-black rounded-xl bg-foreground text-background hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100 dark:bg-white dark:text-black">
                  {isScanning ? "Probing Target..." : "Initiate Full Forensic Scan"}
                </button>

                {/* THE RESULT MANIFEST */}
                {result && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 pt-8 border-t border-border space-y-8">
                    
                    {/* Real Data Proof */}
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-400 overflow-x-auto">
                      <p className="text-primary font-bold mb-2">// RAW FORENSIC TELEMETRY</p>
                      <pre>{result.forensic_data}</pre>
                    </div>

                    <div className={cn("p-8 rounded-2xl border-2 space-y-6 relative overflow-hidden", result.verdict === "SCAM" ? "bg-red-500/5 border-red-500/30" : result.verdict === "CAUTION" ? "bg-amber-500/5 border-amber-500/30" : "bg-emerald-500/5 border-emerald-500/30")}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Final Verdict</p>
                          <h4 className={cn("text-4xl font-black uppercase italic tracking-tighter", result.verdict === "SCAM" ? "text-red-500" : "text-emerald-500")}>
                            {result.verdict}
                          </h4>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">AI Confidence</p>
                          <div className="text-2xl font-mono font-bold text-foreground">{result.confidence}%</div>
                        </div>
                      </div>
                      
                      <p className="text-lg font-medium text-foreground italic border-l-4 border-primary pl-4">"{result.analysis}"</p>
                      
                      {result.red_flags?.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {result.red_flags.map((flag: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-bold text-muted-foreground p-3 rounded-lg border border-border bg-background">
                              <ShieldAlert className="h-4 w-4 text-red-500 shrink-0" /> {flag}
                            </div>
                          ))}
                        </div>
                      )}

                      {result.verdict === "SCAM" && <ScamAlertCard result={result} brandName={brandName || "Unknown Entity"} />}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* The Live Syndicate Feed */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-[2rem] bg-card/80 backdrop-blur-2xl border border-border shadow-2xl relative overflow-hidden h-full">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-500 animate-pulse" />
                    <span className="text-sm font-black uppercase tracking-widest text-foreground">Global Feed</span>
                  </div>
                  <Globe className="h-5 w-5 text-muted-foreground opacity-50" />
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                    <div className="text-4xl font-black text-foreground font-mono">{totalStopped.toLocaleString()}</div>
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1">Threats Neutralized</div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Live Signatures</p>
                    <div className="space-y-3 relative">
                      {/* Gradient fade for list */}
                      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-card to-transparent z-10" />
                      
                      {recentThreats.map((t, i) => (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="p-4 rounded-xl bg-background border border-border relative overflow-hidden group">
                          <div className="absolute left-0 top-0 w-1 h-full bg-red-500 group-hover:w-full transition-all duration-500 opacity-10" />
                          <div className="flex justify-between items-start relative z-10">
                            <div>
                              <p className="text-xs font-bold text-foreground truncate max-w-[140px]">{t.brand_name}</p>
                              <p className="text-[10px] font-mono text-muted-foreground truncate max-w-[140px] mt-1">{t.domain}</p>
                            </div>
                            <span className="text-[8px] font-black bg-red-500/10 text-red-500 px-2 py-1 rounded border border-red-500/20 uppercase tracking-widest">{t.category}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

function cn(...inputs: any[]) { return inputs.filter(Boolean).join(" ") }
