import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ShieldCheck, LayoutGrid, Activity, BookOpen, Globe, Code } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StudentGuard Syndicate | Community Defense",
  description: "Protecting the student community from recruitment fraud using sovereign AI intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <header className="fixed top-0 left-0 w-full z-[100] bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="font-black text-xl tracking-tighter uppercase italic text-white">
                Student<span className="text-primary">Guard.</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <NavLink href="/" label="Pulse" icon={<Activity className="h-3 w-3" />} />
              <NavLink href="/threats" label="Threats" icon={<LayoutGrid className="h-3 w-3" />} />
              <NavLink href="/sovereignty" label="Sovereignty" icon={<BookOpen className="h-3 w-3" />} />
              <NavLink href="/api-docs" label="API" icon={<Code className="h-3 w-3" />} />
            </nav>

            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Syndicate Live</span>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="py-20 border-t border-white/5 bg-zinc-950 relative z-10">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="font-black text-lg uppercase italic text-white">StudentGuard</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium italic">
                The sovereign standard for community defense.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Infrastructure</h4>
              <ul className="text-xs text-zinc-500 space-y-2 font-bold uppercase tracking-widest">
                <li><Link href="/" className="hover:text-primary transition-colors">Forensic Scan</Link></li>
                <li><Link href="/threats" className="hover:text-primary transition-colors">Threat Board</Link></li>
                <li><Link href="/api-docs" className="hover:text-primary transition-colors">Syndicate API</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Governance</h4>
              <ul className="text-xs text-zinc-500 space-y-2 font-bold uppercase tracking-widest">
                <li><Link href="/manifesto" className="hover:text-primary transition-colors">Manifesto</Link></li>
                <li><Link href="/sovereignty" className="hover:text-primary transition-colors">Privacy Node</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Node Status</h4>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black">
                  <span className="text-zinc-500 uppercase tracking-widest">System</span>
                  <span className="text-emerald-500 italic">NOMINAL</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black">
                  <span className="text-zinc-500 uppercase tracking-widest">Region</span>
                  <span className="text-primary italic">GLOBAL</span>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

function NavLink({ href, label, icon }: { href: string, label: string, icon: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all group"
    >
      <span className="group-hover:text-primary transition-colors">{icon}</span>
      {label}
    </Link>
  )
}
