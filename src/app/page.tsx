"use client"

import { useState } from "react"
import { ShieldCheck, Zap, Activity, Users, AlertTriangle, ArrowRight, FileSearch, Globe, Share2, Terminal, Loader2, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"
import { ScamAlertCard } from "@/components/scam-alert-card"

export default function Home() {
  const [content, setContent] = useState("")
  const [brandName, setBrandName] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [threatsStopped, setThreats] = useState(1248)

  const runScan = async () => {
    if (!content) return
    setIsScanning(true)
    setResult(null)
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        body: JSON.stringify({ content })
      })
      const data = await res.json()
      setResult(data)
      if (data.verdict === "SCAM") setThreats(p => p + 1)
    } catch (e) {
      alert("Analysis failure.")
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center z-10 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-2xl">
              <Zap className="h-3 w-3 fill-primary" /> Community Defense Node v1.0
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 text-white leading-[0.85] uppercase italic">
              United against<br />Recruitment Fraud.
            </h1>
            <p className="text-lg lg:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium italic">
              "Your career start shouldn't be a security risk. StudentGuard turns individual victims into a collective defense shield."
            </p>
          </motion.div>
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute inset-0 opacity-[0.02] bg-[size:40px_40px] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)]" />
        </div>
      </section>

      {/* 2. CORE UTILITY */}
      <section className="py-20 bg-zinc-950/50 border-y border-white/5 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="p-10 rounded-[3rem] glass-card border border-white/10 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Lead Forensic Probe</h3>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Sovereign Mode</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <input 
                    className="w-full h-14 bg-black/40 border-2 border-white/5 rounded-xl px-6 text-sm font-bold focus:border-primary/50 transition-all placeholder:text-zinc-600 outline-none text-white"
                    placeholder="Company Name (for report card)..."
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                  />
                  <textarea 
                    className="w-full h-48 bg-black/40 border-2 border-white/5 rounded-[2rem] p-6 text-sm font-medium focus:border-primary/50 transition-all placeholder:text-zinc-600 outline-none text-white"
                    placeholder="Paste the job offer text, email body, or mysterious link here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <button 
                  onClick={runScan}
                  disabled={isScanning || !content}
                  className="w-full h-16 text-xl font-black rounded-3xl bg-primary text-white hover:scale-[1.02] transition-all uppercase italic tracking-tighter shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isScanning ? <Loader2 className="animate-spin h-6 w-6" /> : <><FileSearch className="h-6 w-6" /> Run Community Scan</>}
                </button>

                {result && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={cn("p-8 rounded-[2rem] border-2 space-y-8", 
                    result.verdict === "SCAM" ? "bg-red-500/10 border-red-500/20" : 
                    result.verdict === "CAUTION" ? "bg-amber-500/10 border-amber-500/20" : 
                    "bg-emerald-500/10 border-emerald-500/20"
                  )}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {result.verdict === "SCAM" ? <AlertTriangle className="text-red-500" /> : <ShieldCheck className="text-emerald-500" />}
                        <span className="font-black uppercase italic tracking-widest text-lg">Verdict: {result.verdict}</span>
                      </div>
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Confidence: {result.confidence}%</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-300 italic leading-relaxed">"{result.analysis}"</p>
                    
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">Red Flags Detected</h4>
                      <ul className="space-y-2">
                        {result.red_flags.map((flag: string, i: number) => (
                          <li key={i} className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-red-500" /> {flag}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {result.verdict === "SCAM" && (
                      <ScamAlertCard result={result} brandName={brandName || "Unknown Company"} />
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-black border-2 border-white/5 space-y-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-xs font-black uppercase text-white tracking-widest">Community Pulse</span>
                  </div>
                  <Users className="h-4 w-4 text-zinc-600" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-3xl font-black text-white tabular-nums">{threatsStopped}</div>
                    <div className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Threats Stopped</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-black text-emerald-500 tabular-nums">99.8%</div>
                    <div className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Defense Accuracy</div>
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

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
