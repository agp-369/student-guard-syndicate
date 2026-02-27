"use client"

import { Activity, ShieldCheck, Database, Award, Zap, Radio, Terminal, User as UserIcon } from "lucide-react"
import { motion } from "framer-motion"

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-12">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="h-40 w-40 rounded-[3rem] bg-accent border-2 border-border flex items-center justify-center relative group">
          <UserIcon size={64} className="text-primary opacity-50" />
          <div className="absolute inset-0 rounded-[3rem] border-2 border-primary/20 group-hover:scale-110 transition-transform animate-pulse" />
        </div>
        
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">
            <Radio className="h-3 w-3" /> Member Status: Active Node
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase text-foreground">Sovereign_Agent_Alpha.</h1>
          <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest opacity-60">ID: SG_NODE_{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <StatCard icon={<ShieldCheck className="text-emerald-500" />} label="Scans Performed" value="12" />
        <StatCard icon={<Zap className="text-primary" />} label="Threats Neutralized" value="3" />
        <StatCard icon={<Award className="text-amber-500" />} label="Community Rank" value="Elite" />
      </div>

      {/* Main Console */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 p-10 rounded-[3rem] bg-card border border-border shadow-2xl space-y-8">
          <div className="flex justify-between items-center border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <Terminal className="text-primary" />
              <h3 className="text-xl font-black uppercase italic tracking-widest">Personal Defense Record</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            <HistoryItem date="Feb 28" target="Amazon Fake HR" status="NEUTRALIZED" risk="HIGH" />
            <HistoryItem date="Feb 25" target="Acme Corp" status="VERIFIED_CLEAR" risk="LOW" />
            <HistoryItem date="Feb 22" target="WhatsApp Bot #4" status="NEUTRALIZED" risk="CRITICAL" />
          </div>
        </div>

        <div className="lg:col-span-4 p-8 rounded-[3rem] bg-primary/5 border-2 border-primary/20 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12">
            <Award size={200} />
          </div>
          <h3 className="text-xl font-black uppercase italic text-primary">Syndicate Level: 4</h3>
          <p className="text-sm text-muted-foreground font-medium italic">"You have protected 3 peers by sharing your scan signatures. Continue to defend the community to reach Level 5."</p>
          <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
            <div className="h-full bg-primary w-3/4" />
          </div>
          <p className="text-[10px] font-black uppercase text-primary tracking-widest">75% to next clearance</p>
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

function HistoryItem({ date, target, status, risk }: any) {
  return (
    <div className="flex justify-between items-center p-5 rounded-2xl bg-accent/30 border border-border hover:bg-accent/50 transition-all">
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-mono font-bold text-muted-foreground">{date}</span>
        <div>
          <p className="text-sm font-black uppercase italic text-foreground">{target}</p>
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1">Status: {status}</p>
        </div>
      </div>
      <span className={`text-[8px] font-black px-3 py-1 rounded-lg border ${risk === 'HIGH' || risk === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'} uppercase tracking-widest`}>
        {risk}_RISK
      </span>
    </div>
  )
}
