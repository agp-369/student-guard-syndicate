"use client"

import { Cpu, Lock, Globe, ShieldCheck, Radio, EyeOff, ServerOff, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default function Sovereignty() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-32 space-y-24 text-left">
      <header className="space-y-8">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em]">
          <Radio className="h-3 w-3 animate-pulse" /> Protocol_02: Privacy_Sovereignty
        </div>
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-foreground">
          Sovereign <span className="text-emerald-500">Node.</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium italic leading-relaxed max-w-3xl">
          "Your career data is your DNA. The Syndicate mandates that forensic probes must be local-first and zero-knowledge."
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-12">
        <SovereignPillar 
          icon={<Cpu className="text-emerald-500" />}
          title="Browser-RAM WASM Node"
          desc="Unlike traditional cloud scanners, we utilize pdfjs-dist compiled to WebAssembly. This allows the parsing of sensitive offer letters to happen entirely inside your browser's RAM. No PDF file is ever uploaded to our servers."
        />
        <SovereignPillar 
          icon={<ServerOff className="text-primary" />}
          title="Payload Anonymization"
          desc="Our Gemini 2.5 Flash backend receives only textual artifacts stripped of PII (Personally Identifiable Information). We identify the scam pattern, not the victim's identity."
        />
        <SovereignPillar 
          icon={<Lock className="text-indigo-400" />}
          title="Sovereign Identity"
          desc="Through our Clerk integration, your identity is cryptographically hashed. Your contributions to the global ledger are anonymous by default, ensuring your career journey remains private."
        />
        <SovereignPillar 
          icon={<EyeOff className="text-amber-500" />}
          title="No Permanent Storage"
          desc="The Syndicate does not maintain a database of offer letters. We only log forensic signatures (Brand Name, Domain, Verdict) to protect the community immune system."
        />
      </section>

      <div className="p-12 rounded-[3.5rem] bg-emerald-500/5 border border-emerald-500/20 font-mono text-[10px] text-emerald-500 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10"><Zap size={100} /></div>
        <div className="space-y-2 relative z-10">
          <p className="opacity-50"># EXECUTING_SOVEREIGN_HANDSHAKE...</p>
          <p>{">"} INITIALIZING LOCAL_WASM_NODE: SUCCESS.</p>
          <p>{">"} ISOLATING_SENSITIVE_PII: COMPLETE.</p>
          <p>{">"} DISPATCHING_FORENSIC_SIGNATURE: ENCRYPTED.</p>
          <p className="font-bold text-foreground text-xs mt-4">{">"} STATUS: SOVEREIGN INTEGRITY VERIFIED.</p>
        </div>
      </div>
    </div>
  )
}

function SovereignPillar({ icon, title, desc }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-10 rounded-[3rem] bg-card/40 backdrop-blur-3xl border border-border space-y-6 hover:border-emerald-500/30 transition-all group"
    >
      <div className="h-16 w-16 rounded-2xl bg-accent border border-border flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tight">{title}</h3>
      <p className="text-base text-muted-foreground font-medium leading-relaxed italic">{desc}</p>
    </motion.div>
  )
}
