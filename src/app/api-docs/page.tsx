"use client"

import { Terminal, Code, Zap, ShieldCheck, Radio, Globe, Lock } from "lucide-react"
import { motion } from "framer-motion"

export default function ApiDocs() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-32 space-y-24 text-left">
      <header className="space-y-8">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
          <Radio className="h-3 w-3 animate-pulse" /> Uplink_Node: Protocol_Documentation
        </div>
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-foreground">
          Syndicate <span className="text-primary">Dispatch.</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium italic leading-relaxed max-w-3xl">
          "Programmatic access to global community intelligence. Build your own defense node using our forensic backbone."
        </p>
      </header>

      <div className="grid gap-16">
        {/* ENDPOINT 1 */}
        <section className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tight text-foreground border-l-4 border-primary pl-6">Endpoint: Sovereign_Scan</h2>
            <p className="text-muted-foreground font-medium italic pl-10">Deploy a forensic probe against a suspected job lead artifact.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 pl-10">
            <span className="px-4 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase border border-emerald-500/20">POST</span>
            <code className="text-sm font-mono text-foreground bg-accent p-3 rounded-xl border border-border w-full md:w-auto">/api/scan</code>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 pl-10">
            <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-border space-y-6 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Payload_Manifest</h4>
                <div className="h-2 w-2 rounded-full bg-blue-500" />
              </div>
              <pre className="text-[11px] font-mono text-blue-400 overflow-x-auto leading-relaxed">
{`{
  "content": "RAW_TEXT_ARTIFACT",
  "brandName": "TARGET_ENTITY",
  "fileMeta": {
    "Producer": "Forensic_ID",
    "Creator": "Source_Node"
  }
}`}
              </pre>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-zinc-950 border border-border space-y-6 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Response_Signal</h4>
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <pre className="text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
{`{
  "verdict": "CLEAR | SCAM",
  "trust_score": 98,
  "red_flags": [...],
  "analysis": "STRATEGIC_INTEL",
  "recommendation": "ACTION"
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* INTEGRITY INFO */}
        <section className="p-12 rounded-[3.5rem] bg-accent/20 border border-border relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="h-24 w-24 shrink-0 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl">
              <Lock size={40} />
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black text-foreground uppercase italic tracking-tight">Security Handshake</h3>
              <p className="text-muted-foreground font-medium italic leading-relaxed text-lg">
                "All API dispatches are encrypted via <strong>Clerk Sovereign Tokens</strong>. Community nodes are limited to 1,000 forensic probes per month to protect Gemini 2.5 Flash token capacity."
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
