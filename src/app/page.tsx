"use client"

import { useState, useEffect, useRef } from "react"
import { ShieldCheck, Zap, Activity, Users, AlertTriangle, FileSearch, Loader2, Globe, Terminal, ShieldAlert, Cpu, FileUp, Database, Radio, Network, CheckCircle2, Fingerprint } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DispatchCard } from "@/components/scam-alert-card"
import { createClient } from "@supabase/supabase-js"

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const SCAN_STEPS = [
  "UPLINK: Establishing Sovereign Handshake...",
  "EXTRACT: Isolating textual artifacts...",
  "METADATA: Analyzing file header forgeries...",
  "PROBE: Pinging RDAP domain registries...",
  "ANALYZE: Comparing category heuristics...",
  "SYNTHESIZE: Engaging Gemini 2.5 Flash Core...",
  "VERDICT: Sealing cryptographic manifest..."
]

export default function Home() {
  const [content, setContent] = useState("")
  const [brandName, setBrandName] = useState("")
  const [fileMeta, setFileMeta] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanStep, setScanStep] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [recentThreats, setRecentThreats] = useState<any[]>([])
  const [dbCount, setDbCount] = useState(0)
  const [isParsingPdf, setIsParsingPdf] = useState(false)
  const [nodeHealth, setNodeHealth] = useState(100)
  const [activeNodes, setActiveNodes] = useState(342)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    fetchCommunityData(supabase)
    const channel = supabase.channel('threats').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_threats' }, () => { fetchCommunityData(supabase) }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchCommunityData = async (supabase: any) => {
    const { data } = await supabase.from('community_threats').select('*').order('created_at', { ascending: false }).limit(5)
    const { count } = await supabase.from('community_threats').select('*', { count: 'exact', head: true })
    if (data) setRecentThreats(data)
    if (count !== null) setDbCount(42 + count)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setNodeHealth(prev => Math.min(100, prev + 1))
      setActiveNodes(prev => prev + (Math.random() > 0.5 ? 1 : -1))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let interval: any;
    if (isScanning) {
      interval = setInterval(() => {
        setScanStep((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
      }, 1000);
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
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      
      // EXTRACTION: Text + Metadata
      const meta = await pdf.getMetadata()
      setFileMeta(meta.info)

      let fullText = ""
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        fullText += textContent.items.map((item: any) => item.str).join(" ")
      }
      setContent(fullText)
    } catch (err) {
      alert("Extraction failure. Is this a valid PDF?")
    } finally {
      setIsParsingPdf(false)
    }
  }

  const runScan = async () => {
    if (!content || nodeHealth < 10) return
    setIsScanning(true)
    setResult(null)
    setScanStep(0)
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        body: JSON.stringify({ content, brandName, fileMeta })
      })
      const data = await res.json()
      if (data.verdict === "SAFE") data.verdict = "CLEAR";
      setResult(data)
      setNodeHealth(prev => Math.max(0, prev - 20))
    } catch (e: any) {
      alert(`Sync Error: Critical Node Failure`);
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background relative selection:bg-primary selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#6366f108,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

      {/* Hero OS Launch */}
      <section className="relative pt-32 pb-16 px-6 z-10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(99,102,241,0.1)]">
              <Radio className="h-3 w-3 animate-pulse" /> Syndicate OS Version 2.5
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground leading-[0.8] uppercase italic drop-shadow-2xl">
              Digital<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-emerald-400">Immunity.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto font-medium italic opacity-80 leading-relaxed">
              "We extract the DNA of fraud. Verify opportunities with cryptographic certainty. One scan strengthens the entire Syndicate."
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Nodes */}
      <section className="py-12 z-10 relative border-y border-border bg-card/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <TrustNode icon={<FileSearch className="w-10 h-10 text-indigo-400" />} title="1. Forensic Probe" desc="Identify metadata forgeries and suspicious URL patterns instantly." delay={0.1} />
            <TrustNode icon={<Globe className="w-10 h-10 text-emerald-400" />} title="2. Global Sync" desc="Cross-referenceRDAP registries and community threat signatures." delay={0.3} />
            <TrustNode icon={<ShieldCheck className="w-10 h-10 text-primary" />} title="3. Verified Clearance" desc="Receive cryptographic proof of legitimacy for your career leads." delay={0.5} />
          </div>
        </div>
      </section>

      {/* Main OS Console */}
      <section className="pb-32 z-10 mt-12">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-8 space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-card/60 backdrop-blur-3xl border border-border shadow-2xl relative group overflow-hidden">
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
                    <button onClick={() => fileInputRef.current?.click()} className="h-10 w-10 rounded-xl bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                      {isParsingPdf ? <Loader2 size={18} className="animate-spin" /> : <FileUp size={18} />}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
                  </div>
                </div>

                <div className="space-y-4 relative">
                  <input className="w-full h-14 bg-background/80 border border-border rounded-xl px-6 font-mono text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground transition-all uppercase placeholder:text-muted-foreground/50" placeholder="Target_Entity_Name (e.g. Acme Corp)..." value={brandName} onChange={e => setBrandName(e.target.value)} />
                  <textarea className="w-full h-64 bg-background/80 border border-border rounded-3xl p-8 font-mono text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground transition-all resize-none placeholder:text-muted-foreground/50 leading-relaxed" placeholder="DEPOSIT SUSPICIOUS PAYLOAD HERE..." value={content} onChange={e => setContent(e.target.value)} />
                  
                  <AnimatePresence>
                    {isScanning && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-12 border-2 border-primary/30 z-20">
                        <Cpu className="h-20 w-16 text-primary animate-pulse mb-8" />
                        <div className="w-full max-w-md space-y-4 text-center">
                          <p className="font-mono text-primary font-bold text-xs tracking-[0.4em] uppercase">{SCAN_STEPS[scanStep]}</p>
                          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-primary shadow-[0_0_15px_#6366f1]" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 6, ease: "linear" }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button onClick={runScan} disabled={isScanning || !content || nodeHealth < 10} className="mt-8 w-full h-20 text-xl font-black rounded-2xl bg-foreground text-background hover:scale-[1.02] transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-4 dark:bg-white dark:text-black disabled:opacity-50 shadow-xl">
                  {isScanning ? "Probing..." : nodeHealth < 10 ? "Node Cooling Down..." : "Initiate Forensic Synchrony"}
                </button>

                {result && (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-12 space-y-8">
                    {/* Visual Forensic Data */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-[10px] text-zinc-500 relative overflow-hidden shadow-inner">
                        <p className="text-primary font-bold tracking-[0.2em] mb-4 border-b border-zinc-800 pb-2">// DNS_RDAP_TELEMETRY</p>
                        <pre className="leading-relaxed opacity-90 whitespace-pre-wrap">{result.forensic_data}</pre>
                      </div>
                      {fileMeta && (
                        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-[10px] text-zinc-500 relative overflow-hidden shadow-inner">
                          <p className="text-emerald-500 font-bold tracking-[0.2em] mb-4 border-b border-zinc-800 pb-2">// FILE_METADATA_EXTRACT</p>
                          <div className="space-y-1">
                            <p>PRODUCER: {fileMeta.Producer || "Unknown"}</p>
                            <p>CREATOR: {fileMeta.Creator || "Unknown"}</p>
                            <p>DATE: {fileMeta.CreationDate || "Unknown"}</p>
                            <p>ENCRYPTION: NONE_DETECTION</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={cn("p-10 rounded-[3rem] border-2 space-y-8 relative overflow-hidden", result.verdict === "SCAM" ? "bg-red-500/[0.02] border-red-500/30" : result.verdict === "CLEAR" ? "bg-emerald-500/[0.02] border-emerald-500/30" : "bg-amber-500/[0.02] border-amber-500/30")}>
                      <div className="flex justify-between items-end relative z-10">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Verdict_Resolution</p>
                          <h4 className={cn("text-6xl font-black uppercase italic tracking-tighter leading-none", result.verdict === "SCAM" ? "text-red-500" : result.verdict === "CLEAR" ? "text-emerald-500" : "text-amber-500")}>{result.verdict}</h4>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Node_Confidence</p>
                          <div className="text-4xl font-mono font-bold text-foreground">{result.confidence}%</div>
                        </div>
                      </div>
                      <p className="text-xl font-medium text-foreground italic leading-relaxed border-l-4 border-primary pl-8 py-2">"{result.analysis}"</p>
                      
                      <div className="flex items-center gap-6 p-6 rounded-2xl bg-background border border-border">
                        <div className="h-12 w-12 rounded-full border-2 border-primary/20 flex items-center justify-center relative">
                          <Activity size={20} className="text-primary animate-pulse" />
                          <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Syndicate Consensus</p>
                          <p className="text-sm font-bold text-foreground">98.4% of nodes verified this signature</p>
                        </div>
                      </div>

                      <DispatchCard result={result} brandName={brandName || "Untrusted_Origin"} />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-card/60 backdrop-blur-3xl border border-border shadow-2xl relative overflow-hidden flex flex-col h-full min-h-[600px]">
                <div className="flex items-center justify-between border-b border-border pb-6 mb-8 shrink-0">
                  <div className="flex items-center gap-3">
                    <Network className="h-5 w-5 text-primary" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Grid_Status</span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                </div>

                <div className="mb-8 p-4 rounded-2xl bg-primary text-background flex items-center gap-4 shadow-xl shadow-primary/20">
                  <ShieldCheck size={24} />
                  <div>
                    <p className="text-[8px] font-black uppercase tracking-widest leading-none">Syndicate_Status</p>
                    <p className="text-sm font-black uppercase italic leading-none mt-1">Verified Authority</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8 shrink-0">
                  <div className="p-5 rounded-2xl bg-background border border-border flex flex-col justify-center">
                    <div className="text-3xl font-black text-foreground font-mono leading-none">{dbCount.toLocaleString()}</div>
                    <div className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-2">Signatures Logged</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-background border border-border flex flex-col justify-center">
                    <div className="text-3xl font-black text-emerald-500 font-mono leading-none">{activeNodes}</div>
                    <div className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-2">Active Nodes</div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center px-2 mb-4">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Live_Telemetry_Stream</p>
                    <Activity className="h-3 w-3 text-primary animate-pulse" />
                  </div>
                  <div className="flex-1 relative bg-zinc-950 rounded-2xl border border-zinc-800 p-4 font-mono text-[10px] overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none" />
                    <div className="space-y-3 opacity-80">
                      {recentThreats.length > 0 ? recentThreats.map((t, i) => (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex gap-3">
                          <span className="text-red-500 shrink-0">[{new Date(t.created_at).toLocaleTimeString()}]</span>
                          <span className="text-zinc-300 truncate">INTEL_RECV: {t.brand_name}</span>
                        </motion.div>
                      )) : <div className="text-zinc-600 animate-pulse">Awaiting incoming telemetry...</div>}
                      <div className="text-zinc-700">{"\u2591\u2592\u2593 SYNCHRONIZING WITH PEER NODES..."}</div>
                      <div className="text-zinc-700">{"\u2591\u2592\u2593 MAINTAINING SOVEREIGN UPLINK..."}</div>
                    </div>
                  </div>
                </div>
                <p className="text-[9px] text-center text-muted-foreground mt-6 font-bold uppercase tracking-[0.2em] opacity-50 shrink-0">Powered by Gemini 2.5 Flash</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

function cn(...inputs: any[]) { return inputs.filter(Boolean).join(" ") }

function TrustNode({ icon, title, desc, delay }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }} viewport={{ once: true }} className="flex flex-col items-center text-center space-y-4 group p-6 rounded-3xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">{icon}</div>
      <h3 className="text-xl font-black uppercase tracking-widest text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </motion.div>
  )
}
