"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Activity, ShieldAlert } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function ThreatTicker() {
  const [threats, setThreats] = useState<any[]>([])

  useEffect(() => {
    fetchLatest()
    const channel = supabase.channel('ticker')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_threats' }, () => {
        fetchLatest()
      }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const fetchLatest = async () => {
    const { data } = await supabase.from('community_threats').select('brand_name, category').order('created_at', { ascending: false }).limit(10)
    if (data) setThreats(data)
  }

  if (threats.length === 0) return null

  return (
    <div className="fixed top-20 left-0 w-full bg-primary/10 border-b border-primary/20 backdrop-blur-md z-[90] h-8 flex items-center overflow-hidden">
      <div className="flex items-center gap-2 px-4 bg-primary text-background h-full shrink-0 relative z-10 shadow-[5px_0_10px_rgba(0,0,0,0.3)]">
        <Activity className="h-3 w-3 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest">Live_Dispatch</span>
      </div>
      
      <div className="flex whitespace-nowrap animate-marquee">
        {[...threats, ...threats].map((t, i) => (
          <div key={i} className="flex items-center gap-4 px-8 border-r border-white/10 group">
            <ShieldAlert className="h-3 w-3 text-red-500 group-hover:scale-125 transition-transform" />
            <span className="text-[10px] font-mono font-bold text-foreground">
              NEUTRALIZED: <span className="text-primary">{t.brand_name?.toUpperCase()}</span> [{t.category}]
            </span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
