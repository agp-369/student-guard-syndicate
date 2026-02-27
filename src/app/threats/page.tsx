"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, ShieldCheck, Search, Filter, Globe, Activity, Loader2, Database, ShieldAlert, Radio } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { motion } from "framer-motion"

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default function ThreatFeed() {
  const [threats, setThreats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchThreats()
  }, [])

  const fetchThreats = async () => {
    const supabase = getSupabase();
    if (!supabase) { setIsLoading(false); return; }
    const { data } = await supabase.from('community_threats').select('*').order('created_at', { ascending: false })
    if (data) setThreats(data)
    setIsLoading(false)
  }

  const filteredThreats = threats.filter(t => 
    t.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-12 bg-background text-foreground">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            <Radio className="h-3 w-3 animate-ping" /> Synchronized Defense Feed
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
            Global <span className="text-red-500">Threat</span><br />Manifest.
          </h1>
          <p className="text-muted-foreground font-medium italic max-w-xl text-lg leading-relaxed">
            "Direct telemetry from the Syndicate. Every signature represents a neutralized fraud attempt shared by your peers."
          </p>
        </div>

        <div className="relative w-full md:w-[400px] group">
          <div className="absolute inset-0 bg-primary/5 blur-xl group-focus-within:bg-primary/10 transition-all rounded-3xl" />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
          <input 
            type="text"
            placeholder="FILTER BY BRAND OR DOMAIN..."
            className="w-full h-16 bg-card border-2 border-border rounded-2xl pl-14 pr-8 text-xs font-mono font-bold text-foreground outline-none focus:border-primary/50 transition-all relative z-10 shadow-2xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* The Intelligence Grid */}
      <div className="grid gap-6">
        {isLoading ? (
          <div className="py-48 flex flex-col items-center justify-center space-y-6 text-muted-foreground animate-pulse font-mono">
            <Loader2 className="h-16 w-16 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em]">Establishing_Uplink...</p>
          </div>
        ) : filteredThreats.length > 0 ? filteredThreats.map((threat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            key={threat.id} 
            className="p-8 rounded-[2.5rem] bg-card/50 backdrop-blur-3xl border border-border hover:border-red-500/30 transition-all flex flex-col md:flex-row items-center justify-between gap-10 group relative overflow-hidden"
          >
            <div className="absolute left-0 top-0 w-1 h-full bg-red-500/20 group-hover:bg-red-500 transition-all duration-500" />
            
            <div className="flex items-center gap-8 w-full">
              <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 group-hover:scale-110 transition-transform shadow-2xl">
                <ShieldAlert className="h-8 w-8" />
              </div>
              <div className="space-y-2 min-w-0 flex-1">
                <h3 className="text-2xl font-black text-foreground uppercase italic truncate tracking-tight">{threat.brand_name}</h3>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  <span className="flex items-center gap-2 px-3 py-1 rounded-lg bg-accent border border-border"><Globe className="h-3 w-3 text-primary" /> {threat.domain}</span>
                  <span className="px-3 py-1 rounded-lg bg-red-500/5 border border-red-500/10 text-red-500">{threat.category}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-10 shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-10">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold text-foreground">NEUTRALIZED</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-60">Timestamp</p>
                <p className="text-xs font-mono font-bold text-foreground mt-1">{new Date(threat.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="py-48 text-center opacity-20 italic font-black text-4xl uppercase tracking-tighter">
            No_Threats_Detected_In_Grid
          </div>
        )}
      </div>
    </div>
  )
}
