import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ShieldCheck, LayoutGrid, Activity, BookOpen, Globe, Code } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreatTicker } from "@/components/threat-ticker";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <header className="fixed top-0 left-0 w-full z-[100] bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <span className="font-black text-xl tracking-tighter uppercase italic">
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
                <ThemeToggle />
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Syndicate Live</span>
              </div>
            </div>
          </header>

          <ThreatTicker />

          <main className="min-h-screen pt-8">
            {children}
          </main>

          <footer className="py-20 border-t border-border bg-card relative z-10">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="font-black text-lg uppercase italic">StudentGuard</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium italic">
                  The sovereign standard for community defense.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Infrastructure</h4>
                <ul className="text-xs text-muted-foreground space-y-2 font-bold uppercase tracking-widest">
                  <li><Link href="/" className="hover:text-primary transition-colors">Forensic Scan</Link></li>
                  <li><Link href="/threats" className="hover:text-primary transition-colors">Threat Board</Link></li>
                  <li><Link href="/api-docs" className="hover:text-primary transition-colors">Syndicate API</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Governance</h4>
                <ul className="text-xs text-muted-foreground space-y-2 font-bold uppercase tracking-widest">
                  <li><Link href="/manifesto" className="hover:text-primary transition-colors">Manifesto</Link></li>
                  <li><Link href="/sovereignty" className="hover:text-primary transition-colors">Privacy Node</Link></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Node Status</h4>
                <div className="p-4 rounded-2xl bg-accent/50 border border-border space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black">
                    <span className="text-muted-foreground uppercase tracking-widest">System</span>
                    <span className="text-emerald-500 italic uppercase">Nominal</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black">
                    <span className="text-muted-foreground uppercase tracking-widest">Region</span>
                    <span className="text-primary italic uppercase">Global</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

function NavLink({ href, label, icon }: { href: string, label: string, icon: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all group"
    >
      <span className="group-hover:text-primary transition-colors">{icon}</span>
      {label}
    </Link>
  )
}
