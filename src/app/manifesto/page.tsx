"use client"

import { motion } from "framer-motion"
import { ShieldAlert, Terminal, Zap, Globe, Lock, Cpu, Radio, Award } from "lucide-react"

export default function Manifesto() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-32 space-y-24">
      {/* HEADER */}
      <header className="space-y-8 text-center md:text-left">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
          <Radio className="h-3 w-3 animate-pulse" /> Protocol_01: The_Foundations
        </div>
        <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8] text-foreground">
          The <span className="text-primary">Manifesto.</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium italic leading-relaxed max-w-3xl">
          "Recruitment fraud is no longer a human crime. It is an automated industry. To fight back, we must become a collective intelligence node."
        </p>
      </header>

      {/* CORE PILLARS */}
      <div className="grid gap-12">
        <ManifestoSection 
          number="01" 
          title="Privacy Sovereignty" 
          content="We believe your career data is your DNA. The Syndicate mandates that all forensic parsing occur in browser RAM via WASM. No sensitive offer letters are ever stored on our servers. You remain sovereign."
          icon={<Lock className="text-emerald-500" />}
        />
        <ManifestoSection 
          number="02" 
          title="Collective Immunity" 
          content="Silence is the scammer's greatest weapon. Every scan run through a Syndicate node strengthens the global ledger. When one student detects a threat, thousands receive immunity instantly."
          icon={<Globe className="text-primary" />}
        />
        <ManifestoSection 
          number="03" 
          title="Forensic Authority" 
          content="We move beyond 'AI guessing.' We interrogation textual artifacts, metadata headers, and global RDAP registries. We provide cryptographic proof of truth in an age of automated malice."
          icon={<Cpu className="text-indigo-400" />}
        />
      </div>

      {/* CALL TO ACTION */}
      <section className="p-12 rounded-[3rem] bg-primary text-background relative overflow-hidden group shadow-2xl shadow-primary/20">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="relative z-10 space-y-8 text-center">
          <Award size={64} className="mx-auto animate-bounce" />
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white">Join the Protocol.</h2>
          <p className="text-lg font-bold opacity-90 italic max-w-2xl mx-auto text-white">
            "The Syndicate is not a tool. It is a promise. A promise that no student will ever have to face the silence of a scam alone again."
          </p>
          <div className="pt-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Node_Status: Awaiting_Signature</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function ManifestoSection({ number, title, content, icon }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border border-border flex flex-col md:flex-row gap-10 items-start hover:border-primary/30 transition-all group"
    >
      <div className="space-y-4 shrink-0">
        <p className="text-4xl font-black text-primary/20 italic group-hover:text-primary transition-colors duration-500">{number}</p>
        <div className="h-16 w-16 rounded-2xl bg-accent border border-border flex items-center justify-center shadow-xl">
          {icon}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-3xl font-black uppercase italic tracking-tight text-foreground">{title}</h3>
        <p className="text-lg text-muted-foreground font-medium italic leading-relaxed">{content}</p>
      </div>
    </motion.div>
  )
}
