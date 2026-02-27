"use client"

import { useState, useEffect, useRef } from "react"
import { ShieldCheck, Zap, Activity, Users, AlertTriangle, FileSearch, Loader2, Globe, Terminal, ShieldAlert, Cpu, FileUp, Database, Radio, Network } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ScamAlertCard } from "@/components/scam-alert-card"
import { createClient } from "@supabase/supabase-js"

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const SCAN_STEPS = [
  "UPLINK: Establishing Sovereign Handshake...",
  "EXTRACT: Isolating PDF text artifacts...",
  "PROBE: Pinging RDAP domain registries...",
  "ANALYZE: Comparing category heuristics...",
  "SYNTHESIZE: Engaging Gemini 2.0 Flash Core...",
  "VERDICT: Sealing evidence manifest..."
]

export default function Home() {
  const [content, setContent] = useState("")
  const [brandName, setBrandName] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanStep, setScanStep] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [recentThreats, setRecentThreats] = useState<any[]>([])
  const [totalStopped, setTotalStopped] = useState(1248)
  const [isParsingPdf, setIsParsingPdf] = useState(false)
  
  // Resource Management State
  const [nodeHealth, setNodeHealth] = useState(100)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    fetchCommunityData(supabase)
    const channel = supabase.channel('threats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_threats' }, () => {
        fetchCommunityData(supabase)
      }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchCommunityData = async (supabase: any) => {
    const { data } = await supabase.from('community_threats').select('*').order('created_at', { ascending: false }).limit(4)
    const { count } = await supabase.from('community_threats').select('*', { count: 'exact', head: true })
    if (data) setRecentThreats(data)
    if (count) setTotalStopped(1248 + count)
  }

  useEffect(() => {
    let interval: any;
    if (isScanning) {
      interval = setInterval(() => {
        setScanStep((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
      }, 1200);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsParsingPdf(true)
    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ""
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        fullText += textContent.items.map((item: any) => item.str).join(" ")
      }
      setContent(fullText)
    } catch (err) {
      alert("Extraction failure.")
    } finally {
      setIsParsingPdf(false)
    }
  }

  const runScan = async () => {
    if (!content || nodeHealth < 10) return
    setIsScanning(true)
    setResult(null)
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        body: JSON.stringify({ content, brandName })
      })
      const responseText = await res.text();
      if (!res.ok) throw new Error(responseText);
      const data = JSON.parse(responseText);
      setResult(data)
      // Decrease node health to protect resources (User sees this)
      setNodeHealth(prev => Math.max(0, prev - 15))
    } catch (e: any) {
      alert(`Sync Error: ${e.message}`);
    } finally {
      setIsScanning(false)
    }
  }

  // Auto-regenerate node health
  useEffect(() => {
    const interval = setInterval(() => {
      setNodeHealth(prev => Math.min(100, prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col w-full min-h-screen bg-background relative selection:bg-primary selection:text-white">
      {/* Immersive Hacker OS Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#6366f108,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

      {/* Hero OS Launch */}
      <section className="relative pt-32 pb-16 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(99,102,241,0.1)]">
              <Radio className="h-3 w-3 animate-pulse" /> Global Defense Matrix Active
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-foreground leading-[0.8] uppercase italic">
              Digital<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-emerald-400">Immunity.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto font-medium italic opacity-80 leading-relaxed">
              "We extract the DNA of fraud. One student's scan strengthens the immune system of the entire Syndicate."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main OS Console */}
      <section className="pb-32 z-10">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Probe Control */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-3xl border border-border shadow-2xl relative group overflow-hidden">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Terminal className="text-primary h-5 w-5" />
                    <h3 className="text-sm font-black text-foreground uppercase tracking-[0.3em]">Lead_Extraction_Node</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Node_Capacity</span>
                      <div className="w-24 h-1.5 bg-accent rounded-full overflow-hidden">
                        <motion.div className="h-full bg-primary" animate={{ width: `${nodeHealth}%` }} />
                      </div>
                    </div>
                    <button onClick={() => fileInputRef.current?.click()} className="h-10 w-10 rounded-xl bg-accent border border-border flex items-center justify-center hover:text-primary transition-all">
                      <FileUp size={18} />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
                  </div>
                </div>

                <div className="space-y-4 relative">
                  <input className="w-full h-14 bg-background/50 border border-border rounded-xl px-6 font-mono text-xs focus:border-primary outline-none text-foreground transition-all uppercase placeholder:text-zinc-600" placeholder="Target_Entity_Name..." value={brandName} onChange={e => setBrandName(e.target.value)} />
                  <textarea className="w-full h-64 bg-background/50 border border-border rounded-3xl p-8 font-mono text-xs focus:border-primary outline-none text-foreground transition-all resize-none placeholder:text-zinc-600" placeholder="DEPOSIT SUSPICIOUS PAYLOAD HERE..." value={content} onChange={e => setContent(e.target.value)} />
                  
                  <AnimatePresence>
                    {isScanning && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-12 border-2 border-primary/30">
                        <Cpu className="h-20 w-16 text-primary animate-pulse mb-8" />
                        <div className="w-full max-w-sm space-y-4 text-center">
                          <p className="font-mono text-primary font-bold text-[10px] tracking-[0.4em] uppercase">{SCAN_STEPS[scanStep]}</p>
                          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-primary shadow-[0_0_15px_#6366f1]" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 8, ease: "linear" }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button onClick={runScan} disabled={isScanning || !content || nodeHealth < 10} className="mt-8 w-full h-20 text-xl font-black rounded-2xl bg-foreground text-background hover:scale-[1.01] transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-4 dark:bg-white dark:text-black disabled:opacity-30">
                  {isScanning ? "Probing..." : nodeHealth < 10 ? "Node Cooling Down..." : "Synchronize Verification"}
                </button>

                {/* THE MANIFEST OUTPUT */}
                {result && (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-12 space-y-10">
                    <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/50 font-mono text-[10px] text-zinc-500 relative overflow-hidden">
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-primary font-bold tracking-[0.2em]">RAW_FORENSIC_STREAM</p>
                        <span className="text-[8px] animate-pulse">LIVE_FEED</span>
                      </div>
                      <pre className="leading-relaxed opacity-80 whitespace-pre-wrap">{result.forensic_data}</pre>
                    </div>

                    <div className={cn("p-10 rounded-[3rem] border-2 space-y-8 relative overflow-hidden", result.verdict === "SCAM" ? "bg-red-500/[0.03] border-red-500/30" : "bg-emerald-500/[0.03] border-emerald-500/30")}>
                      <div className="flex justify-between items-end relative z-10">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Verdict_Resolution</p>
                          <h4 className={cn("text-6xl font-black uppercase italic tracking-tighter", result.verdict === "SCAM" ? "text-red-500" : "text-emerald-500")}>
                            {result.verdict}
                          </h4>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Node_Confidence</p>
                          <div className="text-4xl font-mono font-bold text-foreground">{result.confidence}%</div>
                        </div>
                      </div>
                      
                      <p className="text-xl font-medium text-foreground italic leading-relaxed border-l-4 border-primary pl-8 py-2">"{result.analysis}"</p>
                      
                      {result.verdict === "SCAM" && <ScamAlertCard result={result} brandName={brandName || "Untrusted_Origin"} />}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* RIGHT: Syndicate Pulse */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-card/40 backdrop-blur-3xl border border-border shadow-2xl relative overflow-hidden h-full">
                <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
                  <div className="flex items-center gap-3">
                    <Network className="h-5 w-5 text-primary" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Syndicate_Grid</span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                
                <div className="space-y-8">
                  <div className="p-8 rounded-3xl bg-accent/50 border border-border shadow-inner">
                    <div className="flex items-baseline gap-2">
                      <div className="text-5xl font-black text-foreground font-mono leading-none">{totalStopped.toLocaleString()}</div>
                      <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                    </div>
                    <div className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mt-4 opacity-80">Threats_Neutralized</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Recent_Dispatches</p>
                      <Database className="h-3 w-3 text-zinc-700" />
                    </div>
                    <div className="space-y-3">
                      {recentThreats.map((t, i) => (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="p-5 rounded-2xl bg-accent/30 border border-border group overflow-hidden relative transition-all hover:bg-accent/50">
                          <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-foreground uppercase tracking-tight truncate max-w-[140px]">{t.brand_name}</p>
                              <p className="text-[9px] font-mono text-muted-foreground truncate max-w-[140px] opacity-60">{t.domain}</p>
                            </div>
                            <span className="text-[7px] font-black bg-primary/10 text-primary px-2 py-1 rounded-lg border border-primary/20 uppercase tracking-[0.2em]">{t.category}</span>
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
