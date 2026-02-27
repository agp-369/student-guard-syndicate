export default function Manifesto() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-32 space-y-16">
      <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-4 text-primary">The Manifesto.</h1>
      <section className="space-y-8 text-xl text-muted-foreground font-medium italic leading-relaxed">
        <p>
          "Recruitment fraud is not a technical glitch; it is a direct assault on the economic future of our community."
        </p>
        <p>
          StudentGuard is built on the belief that **Silence is the Scam's best friend**. Our mission is to break that pattern.
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
    <div className="p-8 rounded-[2.5rem] bg-accent/50 border border-border space-y-4">
      <h3 className="text-xl font-black text-foreground uppercase italic">{title}</h3>
      <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">{desc}</p>
    </div>
  )
}
