"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, ShieldCheck, Search, Globe, Activity, Loader2, ShieldAlert, Radio, Map, BarChart3, Users, RefreshCw } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { motion } from "framer-motion"

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default function IntelligenceHub() {
  const [threats, setThreats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState("all") // "scams" | "clear" | "all"

  useEffect(() => { 
    const supabase = getSupabase();
    if (supabase) fetchThreats(supabase);
  }, [view])

  const fetchThreats = async (supabase: any) => {
    setIsLoading(true)
    let query = supabase.from('community_threats').select('*').order('created_at', { ascending: false });
    
    if (view === "scams") query = query.eq('verdict', 'SCAM');
    if (view === "clear") query = query.eq('verdict', 'CLEAR');

    const { data, error } = await query.limit(20)
    
    if (error) console.error("Fetch Error:", error.message);
    if (data) setThreats(data)
    setIsLoading(false)
  }

  const manualRefresh = () => {
    const supabase = getSupabase();
    if (supabase) fetchThreats(supabase);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-16">
      <header className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
            <Radio className="h-3 w-3 animate-ping" /> Synchronized Intelligence
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
            Global <span className="text-primary">Ledger.</span>
          </h1>
        </div>
        <button onClick={manualRefresh} className="h-14 w-14 rounded-2xl bg-accent border border-border flex items-center justify-center hover:text-primary transition-all shadow-xl">
          <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
        </button>
      </header>

      <div className="flex gap-4 p-1.5 rounded-2xl bg-card border border-border w-fit">
        <button onClick={() => setView("all")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'all' ? 'bg-primary text-white' : 'text-muted-foreground'}`}>All_Signals</button>
        <button onClick={() => setView("scams")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'scams' ? 'bg-red-500 text-white' : 'text-muted-foreground'}`}>Threats</button>
        <button onClick={() => setView("clear")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'clear' ? 'bg-emerald-500 text-white' : 'text-muted-foreground'}`}>Cleared</button>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="py-32 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
        ) : threats.length > 0 ? threats.map((t, i) => (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={t.id} className="p-6 rounded-[2rem] bg-card border border-border flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="flex items-center gap-6 w-full">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${t.verdict === 'SCAM' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                {t.verdict === 'SCAM' ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
              </div>
              <div>
                <h4 className="text-xl font-black uppercase italic text-foreground">{t.brand_name}</h4>
                <p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-widest">{t.domain} // {t.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-8 shrink-0">
              <span className={`px-4 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest ${t.verdict === 'SCAM' ? 'bg-red-500/5 text-red-500 border-red-500/20' : 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20'}`}>
                {t.verdict}
              </span>
              <p className="text-[9px] font-mono text-muted-foreground">{new Date(t.created_at).toLocaleDateString()}</p>
            </div>
          </motion.div>
        )) : <div className="py-32 text-center opacity-20 italic">"No data matching these parameters found in the Syndicate Ledger."</div>}
      </div>
    </div>
  )
}
