"use client"

import { useState, useEffect } from "react"
import { ShieldCheck, Zap, Activity, Users, AlertTriangle, FileSearch, Loader2, Share2, Globe, Terminal } from "lucide-react"
import { motion } from "framer-motion"
import { ScamAlertCard } from "@/components/scam-alert-card"
import { createClient } from "@supabase/supabase-js"

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default function Home() {
  const [content, setContent] = useState("")
  const [brandName, setBrandName] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [recentThreats, setRecentThreats] = useState<any[]>([])
  const [totalStopped, setTotalStopped] = useState(1248)
  const [activeProtocol, setActiveProtocol] = useState("Offer")

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    fetchCommunityData(supabase)
    const channel = supabase.channel('threats').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_threats' }, () => { fetchCommunityData(supabase) }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchCommunityData = async (supabase: any) => {
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
      
      if (!res.ok) {
        const errorDetail = await res.text();
        throw new Error(errorDetail || `HTTP ${res.status}`);
      }
      
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      console.error("Scan Node Failure:", e);
      alert(`Node sync failure: ${e.message}`);
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center z-10 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Zap className="h-3 w-3 fill-primary" /> Community Defense Node v1.2
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 text-foreground leading-[0.85] uppercase italic">
              United against<br />Recruitment Fraud.
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto italic">
              "Turning individual victims into a collective defense shield."
            </p>
          </motion.div>
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        </div>
      </section>

      <section className="py-20 bg-accent/30 border-y border-border relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div className="p-10 rounded-[3rem] bg-card border border-border space-y-10 shadow-xl relative overflow-hidden group">
                <div className="flex justify-between items-center relative z-10">
                  <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tight">Lead Forensic Probe</h3>
                  <div className="flex items-center gap-2 text-emerald-500">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Node Active</span>
                  </div>
                </div>

                <div className="flex gap-2 p-1 rounded-2xl bg-accent border border-border w-fit relative z-10">
                  <button onClick={() => setActiveProtocol("Offer")} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeProtocol === "Offer" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}>Full Offer</button>
                  <button onClick={() => setActiveProtocol("Domain")} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeProtocol === "Domain" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}>Domain</button>
                  <button onClick={() => setActiveProtocol("Email")} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeProtocol === "Email" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground")}>Email</button>
                </div>

                <div className="space-y-4 relative z-10">
                  <input className="w-full h-14 bg-accent/50 border-2 border-border rounded-xl px-6 text-sm font-bold focus:border-primary outline-none text-foreground" placeholder={activeProtocol === "Offer" ? "Company Name..." : activeProtocol === "Domain" ? "Website URL..." : "Recruiter Email..."} value={brandName} onChange={e => setBrandName(e.target.value)} />
                  <textarea className="w-full h-48 bg-accent/50 border-2 border-border rounded-[2rem] p-6 text-sm font-medium focus:border-primary outline-none text-foreground" placeholder="Paste job text or mysterious content here..." value={content} onChange={e => setContent(e.target.value)} />
                </div>

                <button onClick={runScan} disabled={isScanning || !content} className="w-full h-16 text-xl font-black rounded-3xl bg-primary text-primary-foreground hover:scale-[1.02] transition-all uppercase italic tracking-tighter flex items-center justify-center gap-3">
                  {isScanning ? <Loader2 className="animate-spin h-6 w-6" /> : <><FileSearch className="h-6 w-6" /> Run Community Scan</>}
                </button>

                {result && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("p-8 rounded-[2rem] border-2 space-y-6", result.verdict === "SCAM" ? "bg-red-500/10 border-red-500/20" : "bg-emerald-500/10 border-emerald-500/20")}>
                    <h4 className="text-xl font-black uppercase italic tracking-widest">Verdict: {result.verdict}</h4>
                    <p className="text-sm font-medium text-foreground italic leading-relaxed">"{result.analysis}"</p>
                    {result.verdict === "SCAM" && <ScamAlertCard result={result} brandName={brandName || "Unknown Node"} />}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-[2.5rem] bg-card border-2 border-border space-y-8 shadow-xl">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                  <div className="flex items-center gap-3 text-primary"><Activity className="h-4 w-4" /><span className="text-xs font-black uppercase text-foreground">Community Pulse</span></div>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1"><div className="text-3xl font-black text-foreground">{totalStopped}</div><div className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">Threats Stopped</div></div>
                  <div className="space-y-1"><div className="text-3xl font-black text-emerald-500">99.8%</div><div className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">Defense Rating</div></div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Live Neutralizations</h4>
                  <div className="space-y-2">
                    {recentThreats.map((t, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-accent border border-border">
                        <span className="text-[10px] font-bold text-foreground font-mono truncate max-w-[150px]">{t.brand_name}</span>
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
