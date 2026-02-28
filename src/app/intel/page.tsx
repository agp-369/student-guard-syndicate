"use client"

import { ShieldAlert, BookOpen, AlertTriangle, Fingerprint, Eye, Zap } from "lucide-react"
import { motion } from "framer-motion"

const REAL_SCAMS = [
  {
    title: "The 'MacBook' Equipment Scam",
    category: "Payment Fraud",
    desc: "Recruiters send a fake check for 'training equipment' and ask you to send back the 'overage' via Bitcoin or Zelle.",
    redFlags: ["Immediate hire", "Zelle payment", "Gmail recruiter"]
  },
  {
    title: "The 'Telegram' Interview",
    category: "Phishing",
    desc: "Legitimate companies DO NOT conduct entire hiring processes via Telegram or WhatsApp messaging.",
    redFlags: ["No video call", "Chat-only interview", "Anonymous HR"]
  },
  {
    title: "Domain Lookalike Attacks",
    category: "Forgery",
    desc: "Scammers buy domains like 'accenture-hr.net' to impersonate 'accenture.com'.",
    redFlags: ["-hr in domain", ".net instead of .com", "New domain age"]
  }
]

export default function IntelligenceVault() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32 space-y-16">
      <header className="space-y-6">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
          <BookOpen className="h-3 w-3" /> Syndicate_Knowledge_Base
        </div>
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
          The <span className="text-primary">Intelligence</span><br />Vault.
        </h1>
        <p className="text-muted-foreground font-medium italic max-w-xl text-lg">
          "Understanding the DNA of modern fraud. Education is our first line of collective defense."
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {REAL_SCAMS.map((scam, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="p-8 rounded-[2.5rem] bg-card border border-border space-y-6 hover:border-primary/30 transition-all group"
          >
            <div className="h-14 w-14 rounded-2xl bg-accent flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-xl">
              <ShieldAlert size={28} />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-primary tracking-widest">{scam.category}</span>
              <h3 className="text-2xl font-black uppercase italic leading-tight text-foreground">{scam.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">{scam.desc}</p>
            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Forensic Red Flags</p>
              <div className="flex flex-wrap gap-2">
                {scam.redFlags.map((f, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-red-500/5 text-red-500 text-[9px] font-bold border border-red-500/10">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Origin Story Section (Community Vibe) */}
      <section className="mt-32 p-12 md:p-20 rounded-[4rem] bg-primary text-background relative overflow-hidden group shadow-2xl shadow-primary/20">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Zap size={400} />
        </div>
        <div className="relative z-10 max-w-3xl space-y-8">
          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none text-white">Our Origin.</h2>
          <p className="text-xl md:text-2xl font-bold italic leading-relaxed opacity-90 text-white">
            "I watched a friend lose $800 to a fake MacBook scam. For a college student, that isn't just money—it's rent, it's food, it's hope. I built the Syndicate to ensure that no student ever has to feel that silence again."
          </p>
          <div className="flex items-center gap-4">
            <div className="h-1 w-20 bg-background/30 rounded-full" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Protect your peers. Weaponize Intelligence.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
