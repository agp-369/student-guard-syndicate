"use client"

import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import download from "downloadjs"
import { ShieldAlert, Share2, Globe, AlertTriangle, Fingerprint, ShieldCheck, Award, Loader2, Zap, Scan, Hexagon } from "lucide-react"
import { motion } from "framer-motion"

export function DispatchCard({ result, brandName }: { result: any, brandName: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const isScam = result.verdict === "SCAM"
  const isClear = result.verdict === "CLEAR" || result.verdict === "SAFE"

  const themeColor = isScam ? "#ef4444" : isClear ? "#10b981" : "#f59e0b"
  const glowColor = isScam ? "rgba(239, 68, 68, 0.2)" : isClear ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)"

  const downloadCard = async () => {
    if (cardRef.current === null) return
    setIsGenerating(true)
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        backgroundColor: "#09090b", 
        width: 1200, 
        height: 630,
        pixelRatio: 2
      })
      const prefix = isScam ? "THREAT_SEAL" : isClear ? "CLEARANCE_SEAL" : "CAUTION_SEAL"
      download(dataUrl, `${prefix}_${brandName.replace(/\s+/g, '_')}.png`)
    } catch (e) {
      console.error("Card Generation Error:", e)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 mt-8">
      {/* HIDDEN MASTER CARD: THE JAPANESE CYBER-SEAL */}
      <div className="fixed left-[-9999px] top-0">
        <div 
          ref={cardRef} 
          className="w-[1200px] h-[630px] bg-[#09090b] flex p-0 relative overflow-hidden text-white font-sans border-[12px] border-[#18181b]"
        >
          {/* Aesthetic Layer: Traditional Textures */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
          <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px]" />
          
          {/* LEFT COLUMN: Vertical Telemetry */}
          <div className="w-24 h-full border-r border-white/10 flex flex-col items-center py-12 gap-8 bg-black/40 backdrop-blur-md relative z-10">
            <div className="flex flex-col gap-1 items-center">
              {[..."SYNDICATE"].map((char, i) => (
                <span key={i} className="text-[10px] font-black text-zinc-600 leading-none">{char}</span>
              ))}
            </div>
            <div className="h-20 w-[1px] bg-white/10" />
            <div className="flex flex-col gap-1 items-center">
              {[..."FORENSICS"].map((char, i) => (
                <span key={i} className="text-[10px] font-black text-zinc-600 leading-none">{char}</span>
              ))}
            </div>
            <div className="mt-auto pb-4">
              <Fingerprint size={24} className="text-zinc-700" />
            </div>
          </div>

          {/* MAIN SECTION */}
          <div className="flex-1 flex flex-col p-20 relative z-10">
            {/* The "Hanko" Imperial Stamp */}
            <div 
              style={{ borderColor: themeColor, color: themeColor, boxShadow: `0 0 30px ${glowColor}` }}
              className="absolute top-16 right-16 w-32 h-32 border-4 flex flex-col items-center justify-center rotate-12 opacity-90"
            >
              <div className="text-4xl font-black leading-none mb-1 uppercase tracking-tighter">
                {isScam ? "偽物" : "真正"} 
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] border-t pt-1" style={{ borderColor: themeColor }}>
                {isScam ? "VERDICT: SCAM" : "VERDICT: CLEAR"}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 text-zinc-500">
                <div className="h-[1px] w-12 bg-zinc-800" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em]">Authenticity_Manifest</span>
              </div>
              <h1 className="text-8xl font-black tracking-tighter uppercase italic leading-[0.85] py-4">
                {brandName.substring(0, 18).toUpperCase() || "UNKNOWN_NODE"}<br />
                <span style={{ color: themeColor }} className="drop-shadow-2xl">
                  {isScam ? "NEUTRALIZED." : "CONFIRMED."}
                </span>
              </h1>
            </div>

            <div className="mt-12 max-w-2xl relative">
              <p className="text-3xl text-zinc-400 font-medium leading-relaxed italic border-l-4 border-white/10 pl-10">
                "{result.analysis}"
              </p>
              <div className="absolute -left-2 top-0 h-full w-1 rounded-full" style={{ backgroundColor: themeColor }} />
            </div>

            <div className="mt-auto flex items-end justify-between">
              <div className="flex gap-16">
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-2">Node_Confidence</p>
                  <p className="text-5xl font-black font-mono tracking-tighter italic">{result.confidence}%</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-2">Security_Protocol</p>
                  <p className="text-xl font-bold uppercase tracking-widest text-zinc-300">SG_ALPHA_v4.5</p>
                </div>
              </div>
              
              <div className="text-right space-y-2">
                <div className="flex items-center justify-end gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Join the collective</span>
                  <Globe size={20} className="text-zinc-700" />
                </div>
                <p className="text-2xl font-black uppercase italic text-white tracking-tighter">studentguard.pro</p>
              </div>
            </div>
          </div>

          {/* Design Accents: Giant Background Mark */}
          <div className="absolute top-1/2 right-[-50px] -translate-y-1/2 opacity-[0.02] scale-[2] pointer-events-none">
            <ShieldAlert size={500} />
          </div>
        </div>
      </div>

      {/* VISUAL INTERFACE BUTTON */}
      <div className="space-y-4">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={downloadCard}
          disabled={isGenerating}
          style={{ borderColor: themeColor, color: themeColor }}
          className="w-full h-20 rounded-2xl bg-zinc-950 border-2 font-black uppercase text-sm tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 transition-all hover:bg-white/5 disabled:opacity-50 group"
        >
          {isGenerating ? <Loader2 className="animate-spin" /> : (
            <>
              <Award className="h-6 w-6 group-hover:rotate-12 transition-transform" /> 
              Generate Imperial {isScam ? "Threat" : "Clearance"} Seal
            </>
          )}
        </motion.button>
        <div className="flex items-center justify-center gap-4 text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em]">
          <div className="h-[1px] w-8 bg-border" />
          Optimized for Social Node Dispatch
          <div className="h-[1px] w-8 bg-border" />
        </div>
      </div>
    </div>
  )
}
