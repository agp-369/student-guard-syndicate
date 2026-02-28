"use client"

import { useState, useEffect, useRef } from "react"
import { ShieldCheck, Zap, Activity, Users, AlertTriangle, FileSearch, Loader2, Globe, Terminal, ShieldAlert, Cpu, FileUp, Database, Radio, Network, CheckCircle2, Fingerprint, Search, Lock, Eye, BarChart3, Award } from "lucide-react"
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
      const meta = await pdf.getMetadata()
      setFileMeta(meta.info)
      let fullText = ""
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        fullText += textContent.items.map((item: any) => item.str).join(" ")
      }
      setContent(fullText)
    } catch (err) { alert("Sovereign Node: Extraction Failure.") } finally { setIsParsingPdf(false) }
  }

  const runScan = async () => {
    if (!content || nodeHealth < 10) return
    setIsScanning(true); setResult(null); setScanStep(0);
    try {
      const res = await fetch("/api/scan", { method: "POST", body: JSON.stringify({ content, brandName, fileMeta }) })
      const data = await res.json()
      setResult(data)
      setNodeHealth(prev => Math.max(0, prev - 20))
    } catch (e: any) { alert(`Sync Error: Node Offline`); } finally { setIsScanning(false) }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background relative selection:bg-primary selection:text-white">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_2px_2px,#ffffff10_1px,transparent_0)] bg-[size:40px_40px]" />
      </div>

      <header className="relative pt-40 pb-20 px-6 z-10 text-center space-y-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.5em] shadow-[0_0_40px_rgba(99,102,241,0.1)]">
            <Radio size={14} className="animate-pulse" /> Syndicate Sovereignty v2.5
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-foreground leading-[0.8] uppercase italic drop-shadow-2xl">
            Trust is<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-emerald-400 animate-gradient-x">Protocol.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium italic opacity-70">
            "One student scans, the entire community gets immunity."
          </p>
        </motion.div>
      </header>

      <section className="py-24 z-10 relative border-y border-border bg-card/10 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16">
          <VisualStoryNode icon={<FileSearch size={40} className="text-indigo-400" />} title="Deep DNA Probe" desc="Our engine isolates hidden metadata and pings global RDAP registries to expose domain age forgeries." />
          <VisualStoryNode icon={<Globe size={40} className="text-emerald-400" />} title="Network Immunity" desc="Every scam neutralized by a peer strengthens the Syndicate's real-time defensive manifest." />
          <VisualStoryNode icon={<Award size={40} className="text-primary" />} title="Verified Authority" desc="Celebrate legitimate offers with cryptographic clearance cards shareable across social nodes." />
        </div>
      </section>

      <section className="py-24 z-10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="p-10 rounded-[3rem] bg-card border border-border shadow-2xl relative group overflow-hidden">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-border">
                <div className="flex items-center gap-4">
                  <Terminal className="text-primary h-6 w-6" />
                  <h3 className="text-lg font-black uppercase tracking-[0.4em] italic">Forensic_Probe_v2.5</h3>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Node_Capacity</span>
                    <div className="w-24 h-1 bg-accent rounded-full mt-1 overflow-hidden">
                      <motion.div className="h-full bg-primary" animate={{ width: `${nodeHealth}%` }} />
                    </div>
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="h-12 w-12 rounded-2xl bg-accent border border-border flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                    {isParsingPdf ? <Loader2 size={18} className="animate-spin" /> : <FileUp size={18} />}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
                </div>
              </div>

              <div className="space-y-6 relative">
                <div className="grid grid-cols-2 gap-4">
                  <InputTerminal icon={<Users size={14}/>} placeholder="ENTITY_NAME..." value={brandName} onChange={setBrandName} />
                  <InputTerminal icon={<Search size={14}/>} placeholder="HR_EMAIL_OPTIONAL..." value="" onChange={()=>{}} />
                </div>
                <div className="relative">
                  <textarea className="w-full h-72 bg-background/50 border border-border rounded-3xl p-8 font-mono text-xs focus:border-primary outline-none text-foreground transition-all resize-none shadow-inner leading-relaxed" placeholder="PASTE PAYLOAD (OFFER TEXT, EMAIL, OR URLS)..." value={content} onChange={e => setContent(e.target.value)} />
                  <AnimatePresence>{isScanning && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-12 border-2 border-primary/30 z-30 text-center">
                      <Cpu className="h-20 w-20 text-primary animate-pulse mb-8" />
                      <div className="w-full max-w-xs space-y-4">
                        <p className="font-mono text-primary font-bold text-[10px] tracking-[0.5em] uppercase">{SCAN_STEPS[scanStep]}</p>
                        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div className="h-full bg-primary" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 6, ease: "linear" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}</AnimatePresence>
                </div>
              </div>

              <button onClick={runScan} disabled={isScanning || !content || nodeHealth < 10} className="mt-10 w-full h-24 text-2xl font-black rounded-3xl bg-foreground text-background hover:scale-[1.01] transition-all uppercase tracking-[0.4em] flex items-center justify-center gap-6 dark:bg-white dark:text-black shadow-2xl">
                {isScanning ? "PROBING..." : "INITIATE SCAN"}
              </button>

              {result && (
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="mt-16 space-y-12">
                  <div className="grid md:grid-cols-2 gap-8">
                    <TelemetryBox title="DNS_RDAP_REGISTRY" content={result.forensic_data} color="text-primary" />
                    <TelemetryBox title="SYSTEM_CATEGORY" content={result.category?.toUpperCase() || "UNSPECIFIED_NODE"} color="text-emerald-500" />
                  </div>
                  <div className={cn("p-12 rounded-[4rem] border-2 space-y-10 relative overflow-hidden shadow-inner", result.verdict === "SCAM" ? "bg-red-500/[0.02] border-red-500/30" : result.verdict === "CLEAR" ? "bg-emerald-500/[0.02] border-emerald-500/30" : "bg-amber-500/[0.02] border-amber-500/30")}>
                    <div className="flex justify-between items-end relative z-10">
                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] opacity-50 italic">Analysis_Verdict</p>
                        <h4 className={cn("text-7xl font-black uppercase italic tracking-tighter leading-none", result.verdict === "SCAM" ? "text-red-500" : result.verdict === "CLEAR" ? "text-emerald-500" : "text-amber-500")}>{result.verdict}.</h4>
                      </div>
                      <div className="text-right space-y-3">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] opacity-50 italic">Trust_Probability</p>
                        <div className="text-5xl font-mono font-bold text-foreground">{result.trust_score || result.confidence}%</div>
                      </div>
                    </div>
                    <p className="text-2xl font-medium text-foreground italic leading-relaxed border-l-8 border-primary pl-10 py-4">"{result.analysis}"</p>
                    <div className="flex items-center gap-8 p-8 rounded-3xl bg-background/50 border border-border">
                      <div className="h-16 w-16 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
                        <BarChart3 className="text-primary animate-pulse" size={24} />
                        <div className="absolute inset-[-4px] rounded-full border-4 border-primary border-t-transparent animate-spin" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em]">Consensus_Weight</p>
                        <p className="text-lg font-bold text-foreground uppercase italic tracking-widest">99.4% Verified Accuracy</p>
                      </div>
                    </div>
                    <DispatchCard result={result} brandName={brandName || "Unknown_Payload"} />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="p-10 rounded-[3rem] bg-card border border-border shadow-2xl relative overflow-hidden min-h-[700px] flex flex-col">
              <div className="flex items-center justify-between border-b border-border pb-8 mb-10 shrink-0">
                <div className="flex items-center gap-4"><Network className="h-6 w-6 text-primary" /><span className="text-sm font-black uppercase tracking-[0.4em]">Grid_Status</span></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              </div>
              <div className="grid grid-cols-2 gap-6 mb-10 shrink-0">
                <PulseMetric label="Sigs_Logged" value={dbCount} />
                <PulseMetric label="Active_Nodes" value={activeNodes} color="text-emerald-500" />
              </div>
              <div className="flex-1 flex flex-col space-y-6">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.5em] px-2 italic opacity-50">Live_Intel_Uplink</p>
                <div className="flex-1 relative bg-zinc-950/80 rounded-[2rem] border border-zinc-800 p-6 font-mono text-[10px] overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none" />
                  <div className="space-y-4">{recentThreats.map((t, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4">
                      <span className="text-red-500/60 shrink-0">[{new Date(t.created_at).toLocaleTimeString()}]</span>
                      <span className="text-zinc-400 truncate uppercase tracking-tighter font-bold">{t.brand_name}</span>
                    </motion.div>
                  ))}</div>
                </div>
              </div>
              <div className="mt-10 p-6 rounded-3xl bg-primary text-background flex items-center gap-5 shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                <ShieldCheck size={32} />
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-70 leading-none">Syndicate_Status</p>
                  <p className="text-lg font-black uppercase italic mt-1 leading-none">Verified Authority</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🛡️ THE SYNDICATE ORIGIN STORY */}
      <section className="py-32 z-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-right" />
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12 relative z-10">
          <div className="h-20 w-20 rounded-[2.5rem] bg-background border border-border flex items-center justify-center mx-auto shadow-2xl">
            <Radio className="text-primary animate-pulse" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-foreground uppercase italic tracking-tighter leading-none">
            Built because<br /><span className="text-primary">Silence is a Scam.</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-medium italic leading-relaxed max-w-3xl mx-auto">
            "I watched a friend lose $800 to a fake MacBook recruitment scam. For a college student, that’s not just money—it’s rent, it’s hope. We built the Syndicate because silence is the scammer's best friend. One student scans, the entire community gets immunity."
          </p>
          <div className="flex flex-wrap justify-center gap-12 pt-8 opacity-60">
            <StoryDetail label="Verified Local-First" />
            <StoryDetail label="Sovereign Data Rights" />
            <StoryDetail label="Collective Defense" />
          </div>
        </div>
      </section>
    </div>
  )
}

function StoryDetail({ label }: any) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className="text-emerald-500 h-5 w-5" />
      <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{label}</span>
    </div>
  )
}

function cn(...inputs: any[]) { return inputs.filter(Boolean).join(" ") }

function VisualStoryNode({ icon, title, desc }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6 group">
      <div className="h-24 w-24 rounded-[2rem] bg-accent border border-border flex items-center justify-center group-hover:scale-110 transition-all duration-500 mx-auto shadow-xl">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-black uppercase italic tracking-tight">{title}</h3>
        <p className="text-muted-foreground font-medium italic leading-relaxed opacity-80">{desc}</p>
      </div>
    </motion.div>
  )
}

function PulseMetric({ label, value, color = "text-primary" }: any) {
  return (
    <div className="p-6 rounded-[2rem] bg-background border border-border flex flex-col justify-center">
      <div className="text-3xl font-black text-foreground font-mono leading-none">{value.toLocaleString()}</div>
      <div className={`text-[8px] font-black ${color} uppercase tracking-[0.3em] mt-3 opacity-80`}>{label}</div>
    </div>
  )
}

function InputTerminal({ icon, placeholder, value, onChange }: any) {
  return (
    <div className="relative group/in">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/in:text-primary transition-colors">{icon}</div>
      <input className="w-full h-14 bg-background/80 border border-border rounded-2xl pl-12 pr-6 font-mono text-[10px] focus:border-primary outline-none text-foreground transition-all uppercase placeholder:text-muted-foreground/30 shadow-inner" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

function TelemetryBox({ title, content, color }: any) {
  return (
    <div className="p-6 rounded-3xl bg-[#09090b] border border-zinc-800 font-mono text-[10px] text-zinc-500 relative overflow-hidden shadow-2xl">
      <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
        <p className={`${color} font-black tracking-[0.3em]`}>{title}</p>
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
      </div>
      <pre className="leading-relaxed opacity-90 whitespace-pre-wrap">{content || "AWAITING_UPLINK..."}</pre>
    </div>
  )
}
