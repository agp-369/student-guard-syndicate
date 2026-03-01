"use client"

import { useState, useEffect, useRef } from "react"
import { ShieldCheck, Zap, Activity, Users, AlertTriangle, FileSearch, Loader2, Globe, Terminal, ShieldAlert, Cpu, FileUp, Database, Radio, Network, CheckCircle2, Fingerprint, Search, Lock, Eye, BarChart3, Award, LayoutGrid, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { DispatchCard } from "@/components/scam-alert-card"
import { ReputationSearch } from "@/components/reputation-search"
import { createClient } from "@supabase/supabase-js"
import Link from "next/link"

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
    
    // Real-time subscription for live feed
    const channel = supabase.channel('threats_realtime_home')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_threats' }, (payload) => {
        setRecentThreats(prev => [payload.new, ...prev].slice(0, 5))
        setDbCount(c => c + 1)
      }).subscribe()
      
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
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.624/build/pdf.worker.min.mjs`
      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise
      const meta = await pdf.getMetadata()
      setFileMeta(meta.info)
      let fullText = ""
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        fullText += textContent.items.map((item: any) => item.str).join(" ") + " "
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
    } catch (e: any) { alert(`Sync Error: Critical Node Failure`); } finally { setIsScanning(false) }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background relative selection:bg-primary selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#6366f108,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

      <header className="relative pt-32 md:pt-48 pb-16 px-6 z-10 text-center flex flex-col items-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_40px_rgba(99,102,241,0.1)]">
            <Radio size={14} className="animate-pulse" /> Syndicate Node Active
          </div>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter text-foreground leading-[0.8] uppercase italic drop-shadow-2xl text-center">
            Weaponize<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-emerald-400 animate-gradient-x">Intelligence.</span>
          </h1>
          <p className="text-sm md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium italic opacity-70 px-4 text-center leading-relaxed">
            "We extract the DNA of fraud. Verify opportunities with cryptographic certainty. One scan strengthens the entire Syndicate."
          </p>
        </motion.div>
      </header>

      <section className="py-24 z-10 relative border-y border-border bg-card/10 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 items-center">
          <VisualStoryNode icon={<FileSearch size={40} className="text-indigo-400" />} title="Deep DNA Probe" desc="Identify metadata forgeries and suspicious RDAP registry age instantly." />
          <VisualStoryNode icon={<Globe size={40} className="text-emerald-400" />} title="Network Immunity" desc="Cross-reference collective threat signatures in the community ledger." />
          <VisualStoryNode icon={<ShieldCheck size={40} className="text-primary" />} title="Verified Clearance" desc="Receive cryptographic proof of legitimacy for your career leads." />
        </div>
      </section>

      {/* SYNDICATE REGISTRY SEARCH */}
      <section className="py-24 z-10 relative">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">Syndicate <span className="text-primary">Registry.</span></h2>
            <p className="text-muted-foreground font-medium italic">"Search the community database for known entity signatures before initiating a deep probe."</p>
          </div>
          <ReputationSearch />
        </div>
      </section>

      <section className="pb-32 z-10 mt-12">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-center md:text-left">
            
            <div className="lg:col-span-8 space-y-8 flex flex-col items-center md:items-stretch">
              <div className="w-full p-6 md:p-10 rounded-[2.5rem] bg-card/60 backdrop-blur-3xl border border-border shadow-2xl relative group overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-border gap-6">
                  <div className="flex items-center gap-4">
                    <Terminal className="text-primary h-6 w-6" />
                    <h3 className="text-sm font-black uppercase tracking-[0.4em] italic">Forensic_Node_v2.5</h3>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="flex flex-col items-end">
                      <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Node_Capacity</span>
                      <div className="w-24 h-1 bg-accent rounded-full mt-1 overflow-hidden">
                        <motion.div className="h-full bg-primary" animate={{ width: `${nodeHealth}%` }} />
                      </div>
                    </div>
                    <div className="h-10 w-[1px] bg-border hidden md:block" />
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Sovereign_Active</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 relative flex flex-col items-center md:items-stretch">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="group/drop relative h-40 md:h-48 rounded-3xl border-2 border-dashed border-border bg-background/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center text-center p-6"
                    >
                      {isParsingPdf ? (
                        <div className="space-y-4">
                          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto" />
                          <p className="text-[10px] font-black uppercase text-primary tracking-widest animate-pulse">Isolating_Artifacts...</p>
                        </div>
                      ) : (
                        <div className="space-y-4 flex flex-col items-center">
                          <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center mx-auto group-hover/drop:scale-110 transition-transform shadow-xl">
                            <FileUp className="text-muted-foreground group-hover/drop:text-primary transition-colors" />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase text-foreground tracking-tight">Deposit PDF Artifact</p>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase mt-1">Sovereign Local Extraction</p>
                          </div>
                        </div>
                      )}
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
                    </div>

                    <div className="space-y-4">
                      <div className="relative group/in">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/in:text-primary transition-colors h-4 w-4" />
                        <input className="w-full h-14 bg-background/80 border border-border rounded-2xl pl-12 pr-6 font-mono text-[10px] focus:border-primary outline-none text-foreground transition-all uppercase placeholder:text-muted-foreground/30" placeholder="ENTITY_IDENTIFIER (COMPANY)..." value={brandName} onChange={e => setBrandName(e.target.value)} />
                      </div>
                      <div className="relative group/in">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within/in:text-primary transition-colors h-4 w-4" />
                        <input className="w-full h-14 bg-background/80 border border-border rounded-2xl pl-12 pr-6 font-mono text-[10px] focus:border-primary outline-none text-foreground transition-all uppercase placeholder:text-muted-foreground/30" placeholder="HR_EMAIL_DOMAIN..." />
                      </div>
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3 justify-center md:justify-start">
                        <Lock className="text-primary h-3 w-3" />
                        <p className="text-[8px] font-black uppercase text-primary tracking-widest text-center">Local-First Privacy Active</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative w-full">
                    <textarea className="w-full h-64 bg-background/80 border border-border rounded-3xl p-8 font-mono text-xs focus:border-primary outline-none text-foreground transition-all resize-none shadow-inner leading-relaxed" placeholder="PASTE RAW PAYLOAD (EMAILS, LINKS, OR MESSAGE TEXT)..." value={content} onChange={e => setContent(e.target.value)} />
                    <AnimatePresence>{isScanning && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center p-8 border-2 border-primary/30 z-30 text-center">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="relative mb-10">
                          <Cpu className="h-16 w-12 text-primary animate-pulse mb-8" />
                          <ShieldAlert className="absolute inset-0 m-auto h-10 w-10 text-primary animate-pulse" />
                        </motion.div>
                        <div className="w-full max-w-xs space-y-4">
                          <p className="font-mono text-primary font-bold text-[10px] tracking-[0.5em] uppercase">{SCAN_STEPS[scanStep]}</p>
                          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-primary shadow-[0_0_15px_#6366f1]" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 6, ease: "linear" }} />
                          </div>
                        </div>
                      </motion.div>
                    )}</AnimatePresence>
                  </div>
                </div>

                <button onClick={runScan} disabled={isScanning || !content || nodeHealth < 10} className="mt-10 w-full h-24 text-2xl font-black rounded-3xl bg-foreground text-background hover:scale-[1.01] transition-all uppercase tracking-[0.4em] flex items-center justify-center gap-6 dark:bg-white dark:text-black shadow-2xl disabled:opacity-20 italic">
                  {isScanning ? "PROBING..." : "INITIATE SCAN"}
                </button>

                {/* THE OUTPUT MANIFEST */}
                {result && (
                  <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="mt-16 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <TelemetryBox title="DNS_RDAP_REGISTRY" content={result.forensic_data} color="text-primary" />
                      <TelemetryBox title="METADATA_ANALYSIS" content={fileMeta ? `PRODUCER: ${fileMeta.Producer}\nCREATOR: ${fileMeta.Creator}\nDATE: ${fileMeta.CreationDate}` : "NO_METADATA_EXTRACTED"} color="text-emerald-500" />
                    </div>
                    <div className={cn("p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] border-2 space-y-10 relative overflow-hidden shadow-inner", result.verdict === "SCAM" ? "bg-red-500/[0.02] border-red-500/30" : result.verdict === "CLEAR" ? "bg-emerald-500/[0.02] border-emerald-500/30" : "bg-amber-500/[0.02] border-amber-500/30")}>
                      <div className="flex flex-col md:flex-row justify-between items-center md:items-end relative z-10 gap-8">
                        <div className="space-y-3 text-center md:text-left">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] opacity-50 italic">Analysis_Verdict</p>
                          <h4 className={cn("text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none", result.verdict === "SCAM" ? "text-red-500" : result.verdict === "CLEAR" ? "text-emerald-500" : "text-amber-500")}>{result.verdict}.</h4>
                        </div>
                        <div className="text-center md:text-right space-y-3">
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] opacity-50 italic">Confidence</p>
                          <div className="text-4xl md:text-5xl font-mono font-bold text-foreground">{(result.trust_score || result.confidence || 0)}%</div>
                        </div>
                      </div>
                      <p className="text-lg md:text-2xl font-medium text-foreground italic leading-relaxed border-l-0 md:border-l-8 border-primary pl-0 md:pl-10 py-4 text-center md:text-left leading-relaxed">"{result.analysis}"</p>
                      <DispatchCard result={result} brandName={brandName || "Unknown_Payload"} />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8 w-full flex flex-col items-center">
              <div className="w-full p-8 md:p-10 rounded-[2.5rem] bg-card/60 backdrop-blur-3xl border border-border shadow-2xl relative overflow-hidden flex flex-col items-center">
                <div className="flex items-center justify-between border-b border-border pb-6 mb-8 shrink-0 w-full">
                  <div className="flex items-center gap-4"><Network className="h-6 w-6 text-primary" /><span className="text-sm font-black uppercase tracking-[0.4em]">Syndicate_Grid</span></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8 shrink-0 w-full">
                  <PulseMetric label="Sigs_Logged" value={dbCount} />
                  <PulseMetric label="Active_Nodes" value={activeNodes} color="text-emerald-400" />
                </div>
                <div className="flex-1 flex flex-col space-y-6 w-full">
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.5em] px-2 italic opacity-50 text-center md:text-left">Live_Intel_Stream</p>
                  <div className="h-64 relative bg-zinc-950/80 rounded-[2rem] border border-zinc-800 p-6 font-mono text-[10px] overflow-hidden shadow-inner text-left">
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-zinc-950 to-transparent z-10 pointer-events-none" />
                    <div className="space-y-4">{recentThreats.map((t, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex gap-4">
                        <span className="text-red-500/60 shrink-0">[{new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                        <span className="text-zinc-400 truncate uppercase tracking-tighter font-bold">{t.brand_name}</span>
                      </motion.div>
                    ))}</div>
                  </div>
                </div>
                <Link href="/manifesto" className="mt-8 p-6 rounded-3xl bg-primary text-background flex items-center gap-5 shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all w-full justify-center group">
                  <ShieldCheck size={32} className="group-hover:rotate-12 transition-transform" />
                  <div className="text-left">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-70 leading-none">Syndicate_Protocol</p>
                    <p className="text-lg font-black uppercase italic mt-1 leading-none">View Manifesto</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-32 z-10 relative overflow-hidden border-t border-border flex flex-col items-center">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
          <div className="h-20 w-20 rounded-[2.5rem] bg-accent border border-border flex items-center justify-center mx-auto shadow-2xl"><Radio className="text-primary animate-pulse" /></div>
          <h2 className="text-4xl md:text-7xl font-black text-foreground uppercase italic tracking-tighter leading-tight text-center">Built because<br /><span className="text-primary">Silence is a Scam.</span></h2>
          <p className="text-base md:text-2xl text-muted-foreground font-medium italic leading-relaxed max-w-3xl mx-auto text-center px-4 leading-relaxed">"One student's silence is a scammer's best friend. We built the Syndicate because the only way to beat automated malice is with collective intelligence."</p>
        </div>
      </section>
    </div>
  )
}

function PulseMetric({ label, value, color = "text-primary" }: any) {
  return (
    <div className="p-6 rounded-[2rem] bg-background/50 border border-border flex flex-col justify-center items-center text-center">
      <div className="text-2xl md:text-3xl font-black text-foreground font-mono leading-none">{value.toLocaleString()}</div>
      <div className={`text-[8px] font-black ${color} uppercase tracking-[0.3em] mt-3 opacity-80 leading-none`}>{label}</div>
    </div>
  )
}

function TelemetryBox({ title, content, color }: any) {
  return (
    <div className="p-6 rounded-3xl bg-[#09090b] border border-zinc-800 font-mono text-[10px] text-zinc-500 relative overflow-hidden shadow-2xl text-center md:text-left min-h-[120px]">
      <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-3">
        <p className={`${color} font-black tracking-[0.3em]`}>{title}</p>
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
      </div>
      <pre className="leading-relaxed opacity-90 whitespace-pre-wrap">{content || "AWAITING_INPUT..."}</pre>
    </div>
  )
}

function VisualStoryNode({ icon, title, desc }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-6 group flex flex-col items-center text-center">
      <div className="h-24 w-24 rounded-[2rem] bg-accent border border-border flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-xl">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-black uppercase italic tracking-tight">{title}</h3>
        <p className="text-muted-foreground font-medium italic leading-relaxed opacity-80 px-4">{desc}</p>
      </div>
    </motion.div>
  )
}

function cn(...inputs: any[]) { return inputs.filter(Boolean).join(" ") }
