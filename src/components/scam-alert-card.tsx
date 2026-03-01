"use client"

import { useRef, useState } from "react"
import { toPng } from "html-to-image"
import download from "downloadjs"
import { ShieldAlert, Share2, ShieldCheck, Loader2, QrCode, Fingerprint } from "lucide-react"
import { motion } from "framer-motion"

export function DispatchCard({ result, brandName }: { result: any, brandName: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const isScam = result.verdict === "SCAM"
  const isClear = result.verdict === "CLEAR" || result.verdict === "SAFE"

  const themeColor = isScam ? "#ef4444" : isClear ? "#10b981" : "#f59e0b"
  const bgColor = isScam ? "#3f0f0f" : isClear ? "#064e3b" : "#78350f"
  const title = isScam ? "THREAT DOSSIER" : isClear ? "CLEARANCE CERTIFICATE" : "CAUTION ADVISORY"

  const downloadCard = async () => {
    if (cardRef.current === null) return
    setIsGenerating(true)
    try {
      // Temporarily ensure the element is ready for capture
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        width: 1200, 
        height: 630,
        pixelRatio: 2,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      })
      const prefix = isScam ? "THREAT_DOSSIER" : isClear ? "CLEARANCE_CERT" : "CAUTION_NOTICE"
      download(dataUrl, `${prefix}_${brandName.replace(/\s+/g, '_')}.png`)
    } catch (e) {
      console.error("Card Generation Error:", e)
      alert("Failed to generate the card. Please ensure your browser supports canvas extraction.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 mt-8 w-full">
      {/* 
        THE STANDARD TEMPLATE 
        This is rendered off-screen specifically for image generation.
        It uses a completely distinct "Certificate/Dossier" layout so it doesn't look like a website screenshot.
      */}
      <div className="fixed left-[9999px] top-0 pointer-events-none">
        <div 
          ref={cardRef} 
          className="w-[1200px] h-[630px] flex bg-[#09090b] text-white font-sans overflow-hidden"
          style={{ backgroundImage: `radial-gradient(circle at right, ${bgColor}, #09090b 70%)` }}
        >
          {/* Left Security Strip */}
          <div className="w-32 h-full flex flex-col items-center justify-between py-12 border-r border-white/10 bg-black/50">
            <Fingerprint size={48} style={{ color: themeColor }} opacity={0.8} />
            <div className="rotate-180" style={{ writingMode: 'vertical-rl' }}>
              <span className="text-2xl font-black uppercase tracking-[0.5em] text-zinc-500">StudentGuard</span>
            </div>
            <QrCode size={48} className="text-zinc-600" />
          </div>

          {/* Main Body */}
          <div className="flex-1 flex flex-col p-16 justify-between relative">
            {/* Background Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              {isScam ? <ShieldAlert size={600} /> : <ShieldCheck size={600} />}
            </div>

            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/20 pb-8 relative z-10">
              <div>
                <p className="text-xl font-bold uppercase tracking-[0.4em] mb-2 text-zinc-400">Official Syndicate Record</p>
                <h1 className="text-6xl font-black uppercase tracking-tighter" style={{ color: themeColor }}>
                  {title}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-lg font-mono text-zinc-500 mb-1">DATE: {new Date().toISOString().split('T')[0]}</p>
                <p className="text-lg font-mono text-zinc-500">ID: SG-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
              </div>
            </div>

            {/* Entity Data */}
            <div className="space-y-6 relative z-10 mt-8">
              <div>
                <p className="text-2xl font-bold uppercase tracking-widest text-zinc-500 mb-2">Subject Entity</p>
                <h2 className="text-7xl font-black uppercase leading-none truncate">{brandName || "UNKNOWN"}</h2>
              </div>

              {/* Dynamic Data Blocks */}
              <div className="grid grid-cols-3 gap-8 mt-8">
                <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
                  <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">Primary Classification</p>
                  <p className="text-2xl font-black uppercase" style={{ color: themeColor }}>{result.category || "General"}</p>
                </div>
                <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
                  <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">Forensic Confidence</p>
                  <p className="text-4xl font-mono font-black">{result.confidence || result.trust_score}%</p>
                </div>
                <div className="bg-black/40 p-6 rounded-2xl border border-white/10">
                  <p className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">Verification Node</p>
                  <p className="text-2xl font-mono font-black text-white">Sentinel-1</p>
                </div>
              </div>
            </div>

            {/* Verdict Explanation */}
            <div className="mt-12 bg-black/60 p-8 rounded-3xl border-l-8 relative z-10" style={{ borderColor: themeColor }}>
              <p className="text-3xl font-medium leading-relaxed italic text-zinc-200">
                "{result.analysis}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* UI BUTTON TO TRIGGER DOWNLOAD */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={downloadCard}
        disabled={isGenerating}
        className="w-full h-16 md:h-20 rounded-2xl bg-zinc-950 border-2 font-black uppercase text-xs md:text-sm tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 transition-all hover:bg-zinc-900 disabled:opacity-50"
        style={{ borderColor: themeColor, color: themeColor }}
      >
        {isGenerating ? <Loader2 className="animate-spin h-6 w-6" /> : (
          <>
            <Share2 className="h-5 w-5 md:h-6 md:w-6" /> 
            Generate {isScam ? "Threat Dossier" : "Clearance Certificate"} Card
          </>
        )}
      </motion.button>
    </div>
  )
}
