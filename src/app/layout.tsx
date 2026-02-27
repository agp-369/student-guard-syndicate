import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ShieldCheck, LayoutGrid, Activity, BookOpen, Globe } from "lucide-react";

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
        {/* TACTICAL HEADER */}
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
              <NavLink href="#" label="Pulse" icon={<Activity className="h-3 w-3" />} />
              <NavLink href="#" label="Threats" icon={<LayoutGrid className="h-3 w-3" />} />
              <NavLink href="#" label="Sovereignty" icon={<BookOpen className="h-3 w-3" />} />
            </nav>

            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Syndicate Live</span>
            </div>
          </div>
        </header>

        {children}

        {/* COMMUNITY FOOTER */}
        <footer className="py-20 border-t border-white/5 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="font-black text-lg uppercase italic text-white">StudentGuard Syndicate</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                The sovereign standard for community security. Engineered for the student population.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Protocols</h4>
              <ul className="text-xs text-zinc-500 space-y-2 font-bold uppercase tracking-widest">
                <li className="hover:text-primary transition-colors cursor-pointer">Forensic Scan</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Threat Feed</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Syndicate API</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Governance</h4>
              <ul className="text-xs text-zinc-500 space-y-2 font-bold uppercase tracking-widest">
                <li className="hover:text-primary transition-colors cursor-pointer">Sovereignty</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Privacy Node</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Manifesto</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Status</h4>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black">
                  <span className="text-zinc-500">SYSTEM</span>
                  <span className="text-emerald-500 uppercase">Nominal</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black">
                  <span className="text-zinc-500">ENCRYPTION</span>
                  <span className="text-primary uppercase">AES-256</span>
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
