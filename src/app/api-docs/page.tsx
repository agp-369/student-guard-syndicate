import { Terminal, Code, Zap, ShieldCheck } from "lucide-react"

export default function ApiDocs() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32 space-y-16">
      <header className="space-y-4">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase text-primary">Syndicate Protocol.</h1>
        <p className="text-2xl text-zinc-400 italic">"Programmatic access to the community threat board."</p>
      </header>

      <section className="space-y-8">
        <h2 className="text-2xl font-black uppercase italic tracking-tight border-b border-white/5 pb-4">Endpoint: Lead Scan</h2>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase border border-emerald-500/20">POST</span>
          <code className="text-sm font-mono text-zinc-300">/api/scan</code>
        </div>
        
        <div className="p-8 rounded-[3rem] bg-zinc-950 border-2 border-white/5 space-y-6">
          <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Example Request</h4>
          <pre className="text-xs font-mono text-blue-400 overflow-x-auto leading-relaxed">
{`{
  "content": "Hi, I have a job offer for you...",
  "brandName": "Amazon Careers"
}`}
          </pre>
        </div>

        <div className="p-8 rounded-[3rem] bg-zinc-950 border-2 border-white/5 space-y-6">
          <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Example Response</h4>
          <pre className="text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
{`{
  "verdict": "SCAM",
  "confidence": 98,
  "red_flags": ["Unprofessional Domain", "Urgency"],
  "analysis": "This offer exhibits classic phishing markers..."
}`}
          </pre>
        </div>
      </section>

      <div className="p-10 rounded-[3rem] bg-primary/5 border border-primary/20 flex items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <Zap className="text-primary h-8 w-8" />
          <div>
            <h3 className="text-xl font-black text-white uppercase italic">Rate Limiting</h3>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">1,000 calls / month for community nodes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
