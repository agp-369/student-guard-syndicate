"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, ShieldCheck, Search, Globe, Activity, Loader2, ShieldAlert, Radio, Map, BarChart3, Users } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { motion } from "framer-motion"
import Link from "next/link"

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default function IntelligenceHub() {
  const [threats, setThreats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState("scams") // "scams" | "verified"

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    fetchThreats(supabase)
    
    const channel = supabase.channel('threats_hub')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_threats' }, () => {
        fetchThreats(supabase)
      }).subscribe()
      
    return () => { supabase.removeChannel(channel) }
  }, [view]) // Re-fetch when view changes

  const fetchThreats = async (supabase: any) => {
    setIsLoading(true)
    // In our simplified logic, SCAMs go to community_threats.
    // If we wanted to show "verified" ones, we'd need another table or a flag.
    // For now, we show all neutralized scams in the manifest.
    const { data } = await supabase
      .from('community_threats')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setThreats(data)
    setIsLoading(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-16">
      {/* 1. TOP STATS & MAP VISUAL */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border border-border relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#6366f10a,transparent_70%)]" />
          <div className="relative z-10 space-y-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                  <Map className="h-3 w-3" /> Global_Surveillance_Node
                </div>
                <h2 className="text-4xl font-black italic tracking-tighter uppercase text-foreground">Syndicate <span className="text-primary">Intelligence.</span></h2>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Active Monitors</p>
                <div className="text-2xl font-mono font-bold text-foreground">14,209</div>
              </div>
            </div>
            
            <div className="h-64 w-full bg-zinc-950/50 rounded-3xl border border-white/5 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cyber-glow.png')]" />
              <Activity className="h-32 w-32 text-primary opacity-5 animate-pulse" />
              <div className="absolute top-1/4 left-1/3 h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <div className="absolute bottom-1/3 right-1/4 h-2 w-2 rounded-full bg-red-500 animate-ping delay-700" />
              <div className="absolute top-1/2 right-1/2 h-2 w-2 rounded-full bg-emerald-500 animate-ping delay-300" />
              <p className="font-mono text-[10px] text-zinc-600 uppercase tracking-[0.5em] animate-pulse">Monitoring Global Career Traffic...</p>
            </div>
          </div>
        </div>

        <div className="p-10 rounded-[3rem] bg-primary text-background space-y-10 shadow-2xl shadow-primary/20 flex flex-col justify-between">
          <ShieldAlert size={48} className="animate-bounce" />
          <div className="space-y-4">
            <h3 className="text-3xl font-black uppercase italic leading-none text-white">Protect The Immune System.</h3>
            <p className="text-sm font-bold opacity-80 italic text-white">"Every signature you share acts as a collective antibody, neutralizing fraud before it reaches your peers."</p>
          </div>
          <Link href="/manifesto" className="w-full h-14 bg-background text-foreground rounded-2xl flex items-center justify-center font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
            Join the protocol
          </Link>
        </div>
      </div>

      {/* 2. REGISTRY FILTER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex gap-4 p-1.5 rounded-2xl bg-card border border-border w-fit shadow-inner">
          <button onClick={() => setView("scams")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'scams' ? 'bg-red-500 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>
            Threat_Manifest
          </button>
          <button onClick={() => setView("verified")} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'verified' ? 'bg-emerald-500 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>
            Verified_Registry
          </button>
        </div>
        <div className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] flex items-center gap-2">
          <Users className="h-3 w-3" /> Consensus Weight: <span className="text-primary">99.2%</span>
        </div>
      </div>

      {/* 3. THE DATA FEED */}
      <div className="grid gap-4">
        {isLoading ? (
          <div className="py-32 flex justify-center items-center gap-4 text-muted-foreground font-mono uppercase text-xs animate-pulse">
            <Loader2 className="animate-spin" /> Uplinking to Syndicate Database...
          </div>
        ) : view === "scams" && threats.length > 0 ? threats.map((t, i) => (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={t.id} className="p-6 rounded-[2rem] bg-card border border-border hover:border-primary/30 transition-all flex flex-col md:flex-row items-center justify-between gap-8 group">
            <div className="flex items-center gap-6 w-full">
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center border bg-red-500/5 text-red-500 border-red-500/20">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h4 className="text-xl font-black uppercase italic text-foreground">{t.brand_name}</h4>
                <p className="text-[10px] font-mono text-muted-foreground mt-1 uppercase tracking-widest">{t.domain} // {t.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-12 w-full md:w-auto border-t md:border-t-0 border-border pt-6 md:pt-0">
              <div className="text-right">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none">Syndicate Trust</p>
                <div className="text-xl font-black text-foreground font-mono mt-1">0.0%</div>
              </div>
              <div className="h-10 w-[1px] bg-border hidden md:block" />
              <span className="px-6 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[8px] font-black uppercase tracking-widest text-red-500">Neutralized</span>
            </div>
          </motion.div>
        )) : view === "verified" ? (
          <div className="py-32 text-center text-muted-foreground italic border-2 border-dashed border-border rounded-[3rem]">
            "Registry expansion in progress. Global corporate verification nodes coming soon."
          </div>
        ) : (
          <div className="py-32 text-center text-muted-foreground italic">"Syndicate registry currently empty. Run a scan to populate the manifest."</div>
        )}
      </div>
    </div>
  )
}
