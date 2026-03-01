"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, ShieldCheck, Activity, Loader2, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import { getCommunityThreats } from "@/lib/actions"

export default function IntelligenceHub() {
  const [threats, setThreats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState("all")

  useEffect(() => { 
    refreshLedger();
    const interval = setInterval(refreshLedger, 30000); 
    return () => clearInterval(interval);
  }, [view])

  const refreshLedger = async () => {
    setIsLoading(true);
    const data = await getCommunityThreats(20);
    if (data) {
      // 🛡️ HARDENED FILTERING: Use case-insensitive check to ensure data manifests
      if (view === "scams") {
        setThreats(data.filter((t: any) => t.verdict?.toUpperCase() === "SCAM"));
      } else if (view === "clear") {
        setThreats(data.filter((t: any) => t.verdict?.toUpperCase() === "CLEAR" || t.verdict?.toUpperCase() === "SAFE"));
      } else {
        setThreats(data);
      }
    }
    setIsLoading(false);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-16 text-left">
      <header className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
            <Activity className="h-3 w-3 animate-ping" /> Synchronized Intelligence
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-foreground">
            Global <span className="text-primary">Ledger.</span>
          </h1>
          <p className="text-muted-foreground font-medium italic max-w-xl text-lg leading-relaxed">
            "Every signature in this manifest represents a collective victory for the student community."
          </p>
        </div>
        <button onClick={refreshLedger} className="h-14 w-14 rounded-2xl bg-card border border-border flex items-center justify-center hover:text-primary transition-all shadow-xl cursor-pointer">
          <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
        </button>
      </header>

      <div className="flex gap-4 p-1.5 rounded-2xl bg-card border border-border w-fit">
        <button onClick={() => setView("all")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${view === 'all' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>All_Signals</button>
        <button onClick={() => setView("scams")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${view === 'scams' ? 'bg-red-500 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>Threats</button>
        <button onClick={() => setView("clear")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${view === 'clear' ? 'bg-emerald-500 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>Cleared</button>
      </div>

      <div className="grid gap-4">
        {isLoading && threats.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-primary h-12 w-12" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground animate-pulse text-center">Establishing_Ledger_Sync...</p>
          </div>
        ) : threats.length > 0 ? threats.map((t, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={t.id} className="p-6 md:p-8 rounded-[2.5rem] bg-card/50 backdrop-blur-3xl border border-border flex flex-col md:flex-row items-center justify-between gap-8 group relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-all duration-500" />
            <div className="flex items-center gap-8 w-full text-left">
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border shadow-2xl ${t.verdict?.toUpperCase() === 'SCAM' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                {t.verdict?.toUpperCase() === 'SCAM' ? <AlertTriangle size={28} /> : <ShieldCheck size={28} />}
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-black uppercase italic text-foreground tracking-tight text-left">{t.brand_name}</h4>
                <p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-widest leading-none text-left">{t.domain} // {t.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-10 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-10">
              <div className="text-right">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-60 leading-none">Status</p>
                <p className={`text-xs font-bold mt-1 uppercase ${t.verdict?.toUpperCase() === 'SCAM' ? 'text-red-500' : 'text-emerald-500'}`}>{t.verdict === 'SCAM' ? 'NEUTRALIZED' : 'VERIFIED_CLEAR'}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-60 leading-none">Timestamp</p>
                <p className="text-xs font-mono font-bold text-foreground mt-1 leading-none">{new Date(t.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="py-48 text-center border-2 border-dashed border-border rounded-[3rem] opacity-20 italic font-black text-4xl uppercase tracking-tighter leading-none flex items-center justify-center">
            Ledger_Empty
          </div>
        )}
      </div>
    </div>
  )
}
