"use client"

import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import download from "downloadjs"
import { ShieldAlert, Share2, Globe, AlertTriangle, Scan, Fingerprint, Zap, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

export function ScamAlertCard({ result, brandName }: { result: any, brandName: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const downloadCard = async () => {
    if (cardRef.current === null) return
    setIsGenerating(true)
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        backgroundColor: "#09090b",
        width: 1200,
        height: 630
      })
      download(dataUrl, `SCAM_ALERT_${brandName.replace(/\s+/g, '_')}.png`)
    } catch (e) {
      console.error("Card Generation Error:", e)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* HIDDEN MASTER CARD FOR CAPTURE */}
      <div className="fixed left-[-9999px] top-0">
        <div 
          ref={cardRef}
          className="w-[1200px] h-[630px] bg-[#09090b] flex flex-col p-16 relative overflow-hidden text-white font-sans"
        >
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-primary/10" />

          <div className="flex justify-between items-start relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                <ShieldAlert size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">StudentGuard</h2>
                <p className="text-primary font-bold text-[8px] uppercase tracking-[0.4em]">Syndicate OS Node</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Digital Evidence Signature</p>
              <p className="text-xl font-mono text-zinc-300 font-bold">#{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
            </div>
          </div>

          <div className="mt-12 space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-500 text-sm font-black uppercase tracking-widest">
              <AlertTriangle size={16} /> Verified Security Threat
            </div>
            
            <h1 className="text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
              {brandName}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Neutralized.</span>
            </h1>

            <div className="flex gap-12 mt-8">
              <div className="flex-1 space-y-4">
                <p className="text-2xl text-zinc-400 font-medium italic leading-relaxed border-l-4 border-red-500 pl-6">
                  "{result.analysis}"
                </p>
              </div>
              <div className="w-64 space-y-4 shrink-0">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Node Confidence</p>
                  <p className="text-4xl font-black text-white font-mono">{result.confidence}%</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Category</p>
                  <p className="text-sm font-bold text-primary uppercase">{result.category || "Unknown Fraud"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto flex justify-between items-end relative z-10 border-t border-white/5 pt-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Fingerprint className="text-primary h-5 w-5" />
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Verified by Syndicate AI</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="text-emerald-500 h-5 w-5" />
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Protect your community</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-black uppercase italic text-white leading-none">Stay Sovereign.</p>
              <p className="text-primary font-bold text-xs tracking-widest">studentguard.pro</p>
            </div>
          </div>

          <div className="absolute top-1/2 right-[-100px] opacity-5 scale-150 rotate-12">
            <ShieldAlert size={500} />
          </div>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={downloadCard}
        disabled={isGenerating}
        className="w-full h-16 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 text-white font-black uppercase italic text-sm tracking-[0.2em] shadow-lg shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:shadow-primary/40 disabled:opacity-50"
      >
        {isGenerating ? <Loader2 className="animate-spin" /> : <><Share2 className="h-5 w-5" /> Generate Viral Dispatch Card</>}
      </motion.button>
    </div>
  )
}
