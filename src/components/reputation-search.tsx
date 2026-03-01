"use client"

import { useState } from "react"
import { Search, ShieldCheck, ShieldAlert, Loader2, Globe, Radio } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { motion, AnimatePresence } from "framer-motion"

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export function ReputationSearch() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!query) return
    setIsSearching(true)
    setResult(null)
    
    const supabase = getSupabase()
    if (!supabase) return
    
    const { data } = await supabase
      .from('community_threats')
      .select('*')
      .ilike('brand_name', `%${query}%`)
      .limit(1)
    
    // Simulate deep network probe delay for UX "Realism"
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (data && data.length > 0) {
      setResult({ status: "THREAT", data: data[0] })
    } else {
      setResult({ status: "UNREPORTED" })
    }
    setIsSearching(false)
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/5 blur-3xl group-focus-within:bg-primary/10 transition-all rounded-[3rem]" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="SEARCH_SYNDICATE_REGISTRY (e.g. Acme Corp)..." 
          className="w-full h-20 bg-card border-2 border-border rounded-[2.5rem] pl-16 pr-8 font-mono text-xs font-bold text-foreground outline-none focus:border-primary/50 transition-all relative z-10 shadow-2xl uppercase tracking-widest"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
        <button 
          onClick={handleSearch}
          disabled={isSearching}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-12 px-6 rounded-2xl bg-foreground text-background dark:bg-white dark:text-black font-black uppercase text-[10px] tracking-widest z-10 hover:scale-105 transition-all disabled:opacity-50"
        >
          {isSearching ? <Loader2 className="animate-spin" /> : "PROBE_DB"}
        </button>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`p-8 rounded-[2.5rem] border-2 flex items-center justify-between gap-8 ${result.status === 'THREAT' ? 'bg-red-500/5 border-red-500/30' : 'bg-emerald-500/5 border-emerald-500/30'}`}
          >
            <div className="flex items-center gap-6">
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border ${result.status === 'THREAT' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                {result.status === 'THREAT' ? <ShieldAlert size={32} /> : <ShieldCheck size={32} />}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60 italic">Syndicate_Resolution</p>
                <h4 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
                  {result.status === 'THREAT' ? `Threat_Detected: ${result.data.brand_name}` : "Entity_Not_Flagged"}
                </h4>
                <p className="text-xs font-medium text-muted-foreground italic">
                  {result.status === 'THREAT' ? `This entity has been neutralized by the community. Avoid all contact.` : "No active threats found for this entity in the global registry."}
                </p>
              </div>
            </div>
            {result.status === 'THREAT' && (
              <div className="text-right">
                <p className="text-[8px] font-black text-red-500 uppercase tracking-[0.3em]">Signature_ID</p>
                <p className="text-sm font-mono font-bold text-foreground">SG_{result.data.id.substring(0,6).toUpperCase()}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
