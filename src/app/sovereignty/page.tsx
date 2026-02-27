import { Cpu, Lock, Globe, ShieldCheck } from "lucide-react"

export default function Sovereignty() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32 space-y-16">
      <header className="space-y-4">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase text-emerald-500">Sovereign Standard.</h1>
        <p className="text-2xl text-muted-foreground italic">"Engineering privacy into the foundation of community defense."</p>
      </header>

      <section className="grid md:grid-cols-2 gap-12">
        <TechNode 
          icon={<Cpu className="text-emerald-500" />}
          title="Local-First Node"
          desc="Sensitive offer letters are parsed within your browser's RAM via WebAssembly. Your text never leaves your device until we remove personal data."
        />
        <TechNode 
          icon={<Lock className="text-primary" />}
          title="Zero-Knowledge API"
          desc="Our backend receives anonymous patterns, not names. We identify 'The Scam', not 'The Victim'."
        />
      </section>

      <div className="p-12 rounded-[3.5rem] bg-emerald-500/5 border border-emerald-500/20 font-mono text-[10px] text-emerald-500 space-y-4 shadow-2xl shadow-emerald-500/5">
        <p>{">"} INITIALIZING SECURITY_HANDSHAKE...</p>
        <p>{">"} ANONYMIZING_USER_PAYLOAD: COMPLETE.</p>
        <p>{">"} UPLINKING_THREAT_PATTERN: SUCCESS.</p>
        <p className="font-bold text-foreground text-xs">{">"} STATUS: SOVEREIGN INTEGRITY VERIFIED.</p>
      </div>
    </div>
  )
}

function TechNode({ icon, title, desc }: any) {
  return (
    <div className="space-y-6">
      <div className="h-14 w-14 rounded-2xl bg-card border border-border flex items-center justify-center shadow-lg">{icon}</div>
      <h3 className="text-2xl font-black text-foreground uppercase italic tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">{desc}</p>
    </div>
  )
}
