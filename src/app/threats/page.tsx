"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, ShieldCheck, Search, Filter, Globe, Activity, Loader2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

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
    if (!supabase) {
      setIsLoading(false);
      return;
    }
    const { data } = await supabase.from('community_threats').select('*').order('created_at', { ascending: false })
    if (data) setThreats(data)
    setIsLoading(false)
  }

  const filteredThreats = threats.filter(t => 
    t.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.domain?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest">
            <Activity className="h-3 w-3 animate-pulse" /> Live Community Ledger
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white">
            Threat <span className="text-red-500">Board.</span>
          </h1>
          <p className="text-zinc-400 font-medium italic max-w-xl">
            Direct telemetry from the Syndicate. Every signature represents a neutralized fraud attempt.
          </p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Search by brand or domain..."
            className="w-full h-14 bg-zinc-900 border border-white/5 rounded-2xl pl-12 pr-6 text-sm font-bold text-white outline-none focus:border-primary/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="py-32 flex justify-center"><Loader2 className="h-12 w-12 animate-spin text-zinc-800" /></div>
        ) : filteredThreats.length > 0 ? filteredThreats.map((threat) => (
          <div key={threat.id} className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-red-500/30 transition-all flex flex-col md:flex-row items-center justify-between gap-6 group">
            <div className="flex items-center gap-6 w-full">
              <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="text-lg font-black text-white uppercase italic truncate">{threat.brand_name}</h3>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase text-zinc-500 tracking-widest">
                  <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> {threat.domain}</span>
                  <span className="text-zinc-700">•</span>
                  <span className="text-red-500/70">{threat.category}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8 shrink-0">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Neutralized</p>
                <p className="text-xs font-bold text-white">{new Date(threat.created_at).toLocaleDateString()}</p>
              </div>
              <div className="h-10 w-1 rounded-full bg-red-500/20" />
              <div className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-black uppercase text-red-500 tracking-widest">
                SCAM_CONFIRMED
              </div>
            </div>
          </div>
        )) : (
          <div className="py-32 text-center opacity-20 italic">No threats found matching your search.</div>
        )}
      </div>
    </div>
  )
}
