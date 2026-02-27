"use client"

import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import download from "downloadjs"
import { ShieldAlert, Share2, Globe, AlertTriangle, Fingerprint, ShieldCheck, Award, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export function DispatchCard({ result, brandName }: { result: any, brandName: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const isScam = result.verdict === "SCAM"
  const isClear = result.verdict === "CLEAR" || result.verdict === "SAFE"

  const themeColor = isScam ? "text-red-500" : isClear ? "text-emerald-500" : "text-amber-500"
  const bgGradient = isScam ? "from-red-500/10 via-transparent to-red-900/20" : isClear ? "from-emerald-500/10 via-transparent to-emerald-900/20" : "from-amber-500/10 via-transparent to-amber-900/20"
  const Icon = isScam ? ShieldAlert : isClear ? ShieldCheck : AlertTriangle
  const title = isScam ? "THREAT NEUTRALIZED" : isClear ? "OPPORTUNITY VERIFIED" : "CAUTION ADVISED"

  const downloadCard = async () => {
    if (cardRef.current === null) return
    setIsGenerating(true)
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, backgroundColor: "#09090b", width: 1200, height: 630 })
      const prefix = isScam ? "SCAM_ALERT" : isClear ? "VERIFIED_CLEAR" : "CAUTION"
      download(dataUrl, `${prefix}_${brandName.replace(/\s+/g, '_')}.png`)
    } catch (e) {
      console.error("Card Generation Error:", e)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 mt-6">
      {/* HIDDEN MASTER CARD FOR CAPTURE */}
      <div className="fixed left-[-9999px] top-0">
        <div ref={cardRef} className="w-[1200px] h-[630px] bg-[#09090b] flex flex-col p-16 relative overflow-hidden text-white font-sans border-8 border-[#18181b]">
          
          {/* Cyber Grid Background */}
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`} />

          {/* Header Branding */}
          <div className="flex justify-between items-start relative z-10 border-b border-white/10 pb-8">
            <div className="flex items-center gap-4">
              <div className={`h-16 w-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center ${themeColor} shadow-2xl`}>
                <Icon size={36} />
              </div>
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">StudentGuard</h2>
                <p className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-1">Syndicate OS / Forensics Node</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-1">Cryptographic Hash</p>
              <p className="text-xl font-mono text-zinc-400 font-bold bg-zinc-900 px-4 py-1 rounded-lg border border-white/5">0x{Math.random().toString(16).substring(2, 10).toUpperCase()}</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center relative z-10 space-y-6">
            <div className="space-y-2">
              <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-zinc-900 border border-white/10 ${themeColor} text-xs font-black uppercase tracking-[0.2em]`}>
                {isScam ? <AlertTriangle size={14} /> : <Award size={14} />} 
                {isScam ? "Verified Syndicate Threat" : "Cryptographically Cleared Opportunity"}
              </div>
              <h1 className="text-8xl font-black tracking-tighter uppercase leading-[0.9] mt-4">
                {brandName.substring(0, 20) || "UNKNOWN ENTITY"}<br />
                <span className={themeColor}>{title}.</span>
              </h1>
            </div>

            <p className="text-3xl text-zinc-300 font-medium leading-relaxed max-w-4xl border-l-4 border-white/20 pl-8 opacity-90">
              "{result.analysis}"
            </p>
          </div>

          {/* Footer Metrics */}
          <div className="flex justify-between items-end relative z-10 pt-8 border-t border-white/10">
            <div className="flex gap-12">
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-1">AI Confidence</p>
                <p className="text-4xl font-black font-mono">{result.confidence}%</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-1">Primary Category</p>
                <p className={`text-xl font-bold uppercase ${themeColor}`}>{result.category || "General Inquiry"}</p>
              </div>
            </div>
            <div className="text-right flex items-center gap-4">
              <Globe className="text-zinc-600 h-8 w-8" />
              <div>
                <p className="text-xl font-black uppercase text-white leading-none tracking-tight">studentguard.pro</p>
                <p className="text-zinc-500 font-bold text-[10px] tracking-[0.2em] uppercase mt-1">Join the Syndicate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Button */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={downloadCard}
        disabled={isGenerating}
        className={`w-full h-16 rounded-2xl bg-zinc-950 border border-zinc-800 ${themeColor} font-black uppercase text-sm tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 transition-all hover:bg-zinc-900 disabled:opacity-50`}
      >
        {isGenerating ? <Loader2 className="animate-spin" /> : <><Share2 className="h-5 w-5" /> Generate Social Dispatch Card</>}
      </motion.button>
      <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest">
        {isScam ? "Warn your network on LinkedIn/X." : "Share your verified success with your network."}
      </p>
    </div>
  )
}
