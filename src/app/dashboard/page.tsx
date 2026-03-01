"use client"

import { useState, useEffect } from "react"
import { Activity, ShieldCheck, Database, Award, Zap, Radio, Terminal, User as UserIcon, Loader2, QrCode, Fingerprint, ShieldAlert, Globe } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
  const [showPassport, setShowPassport] = useState(false)

  useEffect(() => {
    const supabase = getSupabase();
    if (isLoaded && user && supabase) {
      fetchUserHistory(supabase)
      
      const channel = supabase.channel(`user_threats_${user.id}`)
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'community_threats' }, 
          (payload) => {
            // Only update if the new threat belongs to this user
            if (payload.new.user_id === user.id) {
              setHistory(prev => [payload.new, ...prev])
            }
          }
        ).subscribe()
        
      return () => { supabase.removeChannel(channel) }
    } else if (isLoaded && !user) {
      setIsLoading(false)
    }
  }, [isLoaded, user])

  const fetchUserHistory = async (supabase: any) => {
    const { data, error } = await supabase
      .from('community_threats')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    
    if (error) console.error("History Fetch Error:", error.message)
    if (data) setHistory(data)
    setIsLoading(false)
  }

  if (!isLoaded) return <div className="py-48 text-center"><Loader2 className="animate-spin h-12 w-12 mx-auto text-primary" /></div>

  if (!user) return (
    <div className="max-w-7xl mx-auto px-6 py-48 text-center space-y-6">
      <ShieldAlert size={64} className="mx-auto text-primary opacity-20" />
      <h1 className="text-4xl font-black uppercase italic tracking-tighter">Authentication Required.</h1>
      <p className="text-muted-foreground italic">"Join the Syndicate to access your personal defense ledger and sovereign identity."</p>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-16 text-left">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="h-40 w-40 rounded-[3rem] bg-accent border-2 border-border flex items-center justify-center relative overflow-hidden group">
            {user?.imageUrl ? (
              <img src={user.imageUrl} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="Profile" />
            ) : (
              <UserIcon size={64} className="text-primary opacity-50" />
            )}
            <div className="absolute inset-0 rounded-[3rem] border-2 border-primary/20 animate-pulse" />
          </div>
          
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">
              <Radio className="h-3 w-3 animate-pulse" /> Node_Status: ACTIVE_AUTHORITY
            </div>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase text-foreground">
              {user?.firstName || 'Sovereign'}_{user?.lastName || 'Agent'}.
            </h1>
            <button 
              onClick={() => setShowPassport(true)}
              className="text-primary font-mono text-[10px] font-black uppercase tracking-[0.3em] hover:underline transition-all"
            >
              {"//"} ACCESS_SOVEREIGN_PASSPORT
            </button>
          </div>
        </div>

        <div className="hidden lg:block h-32 w-[1px] bg-border mx-8" />

        <div className="grid grid-cols-2 gap-8">
          <div className="text-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">Contribution</p>
            <p className="text-4xl font-black text-foreground font-mono">{history.length}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-2">Network_Rank</p>
            <p className="text-4xl font-black text-primary font-mono">#{400 - history.length}</p>
          </div>
        </div>
      </div>

      {/* Main Console */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 p-10 rounded-[3rem] bg-card/60 backdrop-blur-3xl border border-border shadow-2xl space-y-10 min-h-[500px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldCheck size={300} /></div>
          <div className="flex justify-between items-center border-b border-border pb-6 relative z-10">
            <div className="flex items-center gap-3">
              <Terminal className="text-primary h-5 w-5" />
              <h3 className="text-xl font-black uppercase italic tracking-widest">Personal Defense Ledger</h3>
            </div>
          </div>
          
          <div className="space-y-4 relative z-10">
            {isLoading ? (
              <div className="py-20 text-center font-mono uppercase text-xs animate-pulse">Decrypting_History_Stream...</div>
            ) : history.length > 0 ? history.map((item, idx) => (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, y: 0 }} key={idx} className="flex justify-between items-center p-6 rounded-2xl bg-accent/30 border border-border hover:bg-accent/50 transition-all group">
                <div className="flex items-center gap-8">
                  <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center group-hover:text-primary transition-colors italic font-black text-xs">{idx + 1}</div>
                  <div>
                    <p className="text-lg font-black uppercase italic text-foreground tracking-tight">{item.brand_name}</p>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] mt-1">{item.domain} // {new Date(item.created_at).toDateString()}</p>
                  </div>
                </div>
                <span className="text-[8px] font-black px-4 py-1.5 rounded-full border bg-red-500/5 text-red-500 border-red-500/20 uppercase tracking-[0.2em]">NEUTRALIZED</span>
              </motion.div>
            )) : (
              <div className="py-32 text-center space-y-6">
                <Database className="h-16 w-16 mx-auto text-zinc-800 animate-pulse" />
                <p className="text-sm text-muted-foreground italic font-medium max-w-xs mx-auto">"Your defensive history is clean. Log a threat from the console to build your Syndicate reputation."</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="p-10 rounded-[3rem] bg-primary text-background space-y-8 relative overflow-hidden group shadow-2xl shadow-primary/20">
            <div className="absolute -top-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700"><Award size={250} /></div>
            <h3 className="text-3xl font-black uppercase italic leading-none relative z-10 text-white">Syndicate<br />Authority.</h3>
            <div className="space-y-2 relative z-10 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Node Security Level</p>
              <p className="text-5xl font-black text-white font-mono">{Math.floor(history.length / 2) + 1}</p>
            </div>
            <div className="h-1 w-full bg-black/20 rounded-full overflow-hidden relative z-10">
              <div className="h-full bg-white" style={{ width: `${(history.length % 2) * 50 + 10}%` }} />
            </div>
            <p className="text-[10px] font-bold italic text-white/80 relative z-10 leading-relaxed">
              "Your signatures have protected an estimated {history.length * 42} peers. Elevate your status to unlock global dispatch rights."
            </p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-card border border-border space-y-6">
            <h4 className="text-[10px] font-black uppercase text-foreground tracking-[0.4em]">Active Protocols</h4>
            <div className="space-y-3">
              <ProtocolRow label="RDAP_PROBE" status="ACTIVE" color="text-emerald-500" />
              <ProtocolRow label="METADATA_ANALYSIS" status="ACTIVE" color="text-emerald-500" />
              <ProtocolRow label="GEMINI_UPLINK" status="ACTIVE" color="text-emerald-500" />
              <ProtocolRow label="GLOBAL_TICKER" status="ACTIVE" color="text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPassport && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-background/90 backdrop-blur-2xl"
            onClick={() => setShowPassport(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="w-[450px] aspect-[1.6/1] bg-zinc-950 rounded-[2.5rem] border-2 border-primary/30 p-10 relative overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.2)] text-white"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-emerald-500/10" />
              
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white"><ShieldAlert size={24} /></div>
                  <div className="leading-none text-left">
                    <p className="text-[10px] font-black uppercase italic">StudentGuard</p>
                    <p className="text-primary font-bold text-[7px] uppercase tracking-[0.4em]">SOVEREIGN_ID</p>
                  </div>
                </div>
                <QrCode size={40} className="text-zinc-700" />
              </div>

              <div className="mt-10 flex gap-8 items-end relative z-10">
                <div className="h-24 w-20 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center overflow-hidden grayscale">
                  {user?.imageUrl ? <img src={user.imageUrl} className="h-full w-full object-cover opacity-50" /> : <UserIcon className="text-zinc-800" />}
                </div>
                <div className="space-y-4 text-left">
                  <div className="space-y-1">
                    <p className="text-[7px] font-black uppercase text-zinc-500 tracking-[0.3em]">Identity_Manifest</p>
                    <h4 className="text-xl font-black uppercase italic tracking-tighter">{user?.fullName?.toUpperCase()}</h4>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[6px] font-black uppercase text-zinc-600 tracking-[0.2em]">Clearance</p>
                      <p className="text-xs font-mono font-bold text-emerald-500 uppercase">LVL_0{Math.floor(history.length / 2) + 1}</p>
                    </div>
                    <div>
                      <p className="text-[6px] font-black uppercase text-zinc-600 tracking-[0.2em]">Auth_Node</p>
                      <p className="text-xs font-mono font-bold text-primary uppercase">SG_ALPHA_{user?.id.substring(0, 4)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-between items-center border-t border-white/10 pt-6 relative z-10">
                <div className="flex items-center gap-2">
                  <Fingerprint size={12} className="text-primary" />
                  <p className="text-[6px] font-mono text-zinc-500 uppercase tracking-widest leading-none">Biometric_Verification_Locked</p>
                </div>
                <p className="text-[8px] font-black italic uppercase text-zinc-400">Protect the community.</p>
              </div>

              <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12"><Globe size={200} /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-xl space-y-4 hover:border-primary/30 transition-all group">
      <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-left">
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</p>
        <p className="text-4xl font-black text-foreground font-mono mt-1">{value}</p>
      </div>
    </div>
  )
}

function ProtocolRow({ label, status, color }: any) {
  return (
    <div className="flex justify-between items-center text-[9px] font-black">
      <span className="text-muted-foreground uppercase tracking-widest opacity-60 font-mono">[{label}]</span>
      <span className={`${color} italic uppercase`}>{status}</span>
    </div>
  )
}
