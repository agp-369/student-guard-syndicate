export default function Manifesto() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32 space-y-16">
      <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4 text-primary">The Manifesto.</h1>
      <section className="space-y-8 text-xl text-zinc-400 font-medium italic leading-relaxed">
        <p>
          "Recruitment fraud is not a technical glitch; it is a direct assault on the economic future of our community. While attackers use automation to scale their malice, we use the Syndicate to scale our defense."
        </p>
        <p>
          StudentGuard is built on the belief that **Silence is the Scam's best friend**. When one student is targeted, the pattern is usually repeated across thousands. Our mission is to break that pattern by providing a unified, anonymous uplink for sharing threat intelligence.
        </p>
      </section>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Principle title="Radical Transparency" desc="Every scam detection is a public data point. No secrets." />
        <Principle title="Community Immunity" desc="Your scan protects the next student. One node defends all." />
      </div>
    </div>
  )
}

function Principle({ title, desc }: any) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-4">
      <h3 className="text-xl font-black text-white uppercase italic">{title}</h3>
      <p className="text-sm text-zinc-500 font-medium leading-relaxed italic">{desc}</p>
    </div>
  )
}
