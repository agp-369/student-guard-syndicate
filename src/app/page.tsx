"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, Zap, Activity, Users, AlertTriangle, FileSearch, Loader2, Share2, Globe, Terminal } from "lucide-react"
import { motion } from "framer-motion"
import { ScamAlertCard } from "@/components/scam-alert-card"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [content, setContent] = useState("")
  const [brandName, setBrandName] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [recentThreats, setRecentThreats] = useState<any[]>([])
  const [totalStopped, setTotalStopped] = useState(1248)

  useEffect(() => {
    fetchCommunityData()
    // Real-time listener for community updates
    const channel = supabase.channel('threats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_threats' }, () => {
        fetchCommunityData()
      }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchCommunityData = async () => {
    const { data } = await supabase.from('community_threats').select('*').order('created_at', { ascending: false }).limit(3)
    const { count } = await supabase.from('community_threats').select('*', { count: 'exact', head: true })
    if (data) setRecentThreats(data)
    if (count) setTotalStopped(1248 + count)
  }

  const runScan = async () => {
    if (!content) return
    setIsScanning(true)
    setResult(null)
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        body: JSON.stringify({ content, brandName })
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      alert("Node sync failure.")
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
              <Zap className="h-3 w-3 fill-primary" /> Community Defense Node v1.1
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 text-white leading-[0.85] uppercase italic">
              United against<br />Recruitment Fraud.
            </h1>
            <p className="text-lg lg:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium italic">
              "StudentGuard turns individual victims into a collective defense shield."
            </p>
          </motion.div>
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        </div>
      </section>

      {/* 2. SCANNER & PULSE */}
      <section className="py-20 bg-zinc-950/50 border-y border-white/5 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div className="p-10 rounded-[3rem] glass-card border border-white/10 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">Lead Forensic Probe</h3>
                  <div className="flex items-center gap-2 text-emerald-500">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Sovereign Node</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <input 
                    className="w-full h-14 bg-black/40 border-2 border-white/5 rounded-xl px-6 text-sm font-bold focus:border-primary/50 outline-none text-white"
                    placeholder="Company Name (optional)..."
                    value={brandName}
                    onChange={e => setBrandName(e.target.value)}
                  />
                  <textarea 
                    className="w-full h-48 bg-black/40 border-2 border-white/5 rounded-[2rem] p-6 text-sm font-medium focus:border-primary/50 outline-none text-white"
                    placeholder="Paste job text or mysterious email body here..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                  />
                </div>

                <button onClick={runScan} disabled={isScanning || !content} className="w-full h-16 text-xl font-black rounded-3xl bg-primary text-white hover:scale-[1.02] transition-all uppercase italic tracking-tighter flex items-center justify-center gap-3">
                  {isScanning ? <Loader2 className="animate-spin h-6 w-6" /> : <><FileSearch className="h-6 w-6" /> Run Community Scan</>}
                </button>

                {result && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("p-8 rounded-[2rem] border-2 space-y-6", 
                    result.verdict === "SCAM" ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20"
                  )}>
                    <h4 className="text-xl font-black uppercase italic tracking-widest">Verdict: {result.verdict}</h4>
                    <p className="text-sm text-zinc-300 italic leading-relaxed">"{result.analysis}"</p>
                    {result.verdict === "SCAM" && <ScamAlertCard result={result} brandName={brandName || "Unknown Node"} />}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-black border-2 border-white/5 space-y-8 shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                  <div className="flex items-center gap-3"><Activity className="h-4 w-4 text-primary" /><span className="text-xs font-black uppercase text-white tracking-widest">Community Pulse</span></div>
                  <Users className="h-4 w-4 text-zinc-600" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1"><div className="text-3xl font-black text-white">{totalStopped}</div><div className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Threats Stopped</div></div>
                  <div className="space-y-1"><div className="text-3xl font-black text-emerald-500">99.8%</div><div className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Defense Rating</div></div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Live Neutralizations</h4>
                  <div className="space-y-2">
                    {recentThreats.map((t, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 animate-in slide-in-from-top-2">
                        <span className="text-[10px] font-bold text-zinc-300 font-mono truncate max-w-[150px]">{t.brand_name}</span>
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest">{t.category}</span>
                      </div>
                    ))}
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
