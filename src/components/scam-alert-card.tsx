"use client"

import { useRef } from "react"
import { toPng } from "html-to-image"
import download from "downloadjs"
import { ShieldAlert, Share2, Globe, AlertTriangle } from "lucide-react"

export function ScamAlertCard({ result, brandName }: { result: any, brandName: string }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const downloadCard = async () => {
    if (cardRef.current === null) return
    
    const dataUrl = await toPng(cardRef.current, { cacheBust: true })
    download(dataUrl, `StudentGuard_Alert_${brandName.replace(/\s+/g, '_')}.png`)
  }

  return (
    <div className="space-y-6">
      {/* HIDDEN CARD FOR CAPTURE */}
      <div className="fixed left-[-9999px]">
        <div 
          ref={cardRef}
          className="w-[1200px] h-[630px] bg-[#09090b] flex flex-col p-20 relative overflow-hidden"
        >
          {/* Branding */}
          <div className="flex items-center gap-4 mb-12">
            <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <ShieldAlert size={40} />
            </div>
            <span className="text-4xl font-black uppercase italic tracking-tighter text-white">
              StudentGuard <span className="text-indigo-500">Syndicate.</span>
            </span>
          </div>

          {/* Alert Content */}
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-500/10 border-2 border-red-500/20 text-red-500 text-xl font-black uppercase tracking-widest">
              <AlertTriangle size={24} /> Verified Community Threat
            </div>
            
            <h1 className="text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
              SCAM DETECTED:<br />
              <span className="text-red-500">{brandName}</span>
            </h1>

            <p className="text-3xl text-zinc-400 font-medium italic max-w-4xl leading-relaxed">
              "{result.analysis}"
            </p>
          </div>

          {/* Footer Info */}
          <div className="mt-auto flex justify-between items-end">
            <div className="space-y-2">
              <p className="text-sm font-black uppercase tracking-[0.4em] text-zinc-600">Defense Signature</p>
              <p className="text-2xl font-mono text-zinc-500">SG_NODE_ALPHA_{Date.now().toString().slice(-6)}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-white uppercase italic">Protect your community.</p>
              <p className="text-indigo-500 font-bold">studentguard.pro</p>
            </div>
          </div>

          {/* Design Accents */}
          <div className="absolute top-0 right-0 p-20 opacity-5">
            <ShieldAlert size={400} />
          </div>
          <div className="absolute bottom-0 right-0 w-full h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]" />
        </div>
      </div>

      {/* VISUAL BUTTON */}
      <button 
        onClick={downloadCard}
        className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase italic text-xs tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
      >
        <Share2 className="h-4 w-4 text-indigo-500 group-hover:scale-110 transition-transform" /> 
        Generate Viral Alert Card
      </button>
    </div>
  )
}
