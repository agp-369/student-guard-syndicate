"use client"

import { useState, useEffect } from "react"
import { Activity, ShieldCheck, Database, Award, Zap, Radio, Terminal, User as UserIcon, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { createClient } from "@supabase/supabase-js"

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserHistory()
    }
  }, [isLoaded, user])

  const fetchUserHistory = async () => {
    const supabase = getSupabase()
    if (!supabase || !user) return
    
    const { data } = await supabase
      .from('community_threats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (data) setHistory(data)
    setIsLoading(false)
  }

  if (!isLoaded) return <div className="py-48 text-center"><Loader2 className="animate-spin h-12 w-12 mx-auto text-primary" /></div>

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="h-40 w-40 rounded-[3rem] bg-accent border-2 border-border flex items-center justify-center relative overflow-hidden">
          {user?.imageUrl ? (
            <img src={user.imageUrl} className="h-full w-full object-cover" alt="Profile" />
          ) : (
            <UserIcon size={64} className="text-primary opacity-50" />
          )}
          <div className="absolute inset-0 rounded-[3rem] border-2 border-primary/20 animate-pulse" />
        </div>
        
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">
            <Radio className="h-3 w-3" /> Syndicate Member: Verified Node
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-foreground">
            {user?.firstName || 'Sovereign'}_{user?.lastName || 'Agent'}.
          </h1>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest opacity-60">Node_ID: {user?.id.substring(0, 12).toUpperCase()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <StatCard icon={<ShieldCheck className="text-emerald-500" />} label="Scans Attributed" value={history.length + 12} />
        <StatCard icon={<Zap className="text-primary" />} label="Threats Neutralized" value={history.length} />
        <StatCard icon={<Award className="text-amber-500" />} label="Community Rank" value={history.length > 5 ? "Elite" : "Agent"} />
      </div>

      {/* Main Console */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 p-10 rounded-[3rem] bg-card border border-border shadow-2xl space-y-8 min-h-[400px]">
          <div className="flex justify-between items-center border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <Terminal className="text-primary h-5 w-5" />
              <h3 className="text-xl font-black uppercase italic tracking-widest">Personal Defense Ledger</h3>
            </div>
          </div>
          
          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground animate-pulse font-mono uppercase text-xs tracking-widest">Accessing_Encrypted_History...</div>
          ) : history.length > 0 ? (
            <div className="space-y-4">
              {history.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-5 rounded-2xl bg-accent/30 border border-border hover:bg-accent/50 transition-all">
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span>
                    <div>
                      <p className="text-sm font-black uppercase italic text-foreground">{item.brand_name}</p>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Status: NEUTRALIZED</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-black px-3 py-1 rounded-lg border bg-red-500/10 text-red-500 border-red-500/20 uppercase tracking-widest">
                    SCAM_DETECTED
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <Database className="h-12 w-12 mx-auto text-zinc-800" />
              <p className="text-sm text-muted-foreground italic font-medium">"No personal signatures logged yet. Your neutralized threats will appear here."</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 p-8 rounded-[3rem] bg-primary/5 border-2 border-primary/20 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12">
            <Award size={200} />
          </div>
          <h3 className="text-xl font-black uppercase italic text-primary">Syndicate Level: {Math.floor(history.length / 2) + 1}</h3>
          <p className="text-sm text-muted-foreground font-medium italic">"Every signature you log protects thousands of your peers. Continue to defend the community."</p>
          <div className="h-2 w-full bg-accent rounded-full overflow-hidden mt-4">
            <div className="h-full bg-primary" style={{ width: `${(history.length % 2) * 50 + 10}%` }} />
          </div>
          <p className="text-[10px] font-black uppercase text-primary tracking-widest">Level Progress</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-xl space-y-4 hover:border-primary/30 transition-all group">
      <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</p>
        <p className="text-4xl font-black text-foreground font-mono mt-1">{value}</p>
      </div>
    </div>
  )
}
