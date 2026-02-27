import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ShieldCheck, LayoutGrid, Activity, BookOpen, Globe, Code, ShieldAlert } from "lucide-react";
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
      <body className={`${inter.className} bg-background text-foreground transition-colors duration-300 selection:bg-primary selection:text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <header className="fixed top-0 left-0 w-full z-[100] bg-background/60 backdrop-blur-3xl border-b border-border">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                  <ShieldAlert className="h-7 w-7" />
                </div>
                <div>
                  <span className="font-black text-2xl tracking-tighter uppercase italic block leading-none">
                    Student<span className="text-primary">Guard.</span>
                  </span>
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.4em]">Syndicate Node</span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center gap-10">
                <NavLink href="/" label="Console" icon={<Activity size={12} />} />
                <NavLink href="/threats" label="Threat_Feed" icon={<LayoutGrid size={12} />} />
                <NavLink href="/sovereignty" label="Protocols" icon={<BookOpen size={12} />} />
                <NavLink href="/api-docs" label="Uplink" icon={<Code size={12} />} />
              </nav>

              <div className="flex items-center gap-6">
                <ThemeToggle />
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Grid_Online</span>
                </div>
              </div>
            </div>
          </header>

          <ThreatTicker />

          <main className="min-h-screen pt-8">
            {children}
          </main>

          <footer className="py-24 border-t border-border bg-card relative z-10 overflow-hidden">
            {/* Design Accents */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10" />
            
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <span className="font-black text-xl uppercase italic">StudentGuard</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium italic opacity-70">
                  Engineering digital immunity for the next generation. Join the Syndicate to protect the community.
                </p>
              </div>
              
              <FooterSection title="Infrastucture">
                <li><Link href="/" className="hover:text-primary transition-colors">Forensic Console</Link></li>
                <li><Link href="/threats" className="hover:text-primary transition-colors">Global Threat Board</Link></li>
                <li><Link href="/api-docs" className="hover:text-primary transition-colors">API Dispatch</Link></li>
              </FooterSection>

              <FooterSection title="Governance">
                <li><Link href="/manifesto" className="hover:text-primary transition-colors">Syndicate Manifesto</Link></li>
                <li><Link href="/sovereignty" className="hover:text-primary transition-colors">Privacy Sovereignty</Link></li>
              </FooterSection>

              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase text-foreground tracking-[0.4em]">System Status</h4>
                <div className="p-6 rounded-[2rem] bg-accent/50 border border-border space-y-4">
                  <StatusRow label="Core" value="Nominal" color="text-emerald-500" />
                  <StatusRow label="Network" value="Encrypted" color="text-primary" />
                  <StatusRow label="Region" value="Global" color="text-foreground" />
                </div>
              </div>
            </div>
          </footer >
        </ThemeProvider>
      </body>
    </html>
  );
}

function NavLink({ href, label, icon }: { href: string, label: string, icon: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all group"
    >
      <span className="group-hover:text-primary transition-transform group-hover:scale-110">{icon}</span>
      {label}
    </Link>
  )
}

function FooterSection({ title, children }: any) {
  return (
    <div className="space-y-6">
      <h4 className="text-[10px] font-black uppercase text-foreground tracking-[0.4em]">{title}</h4>
      <ul className="text-xs text-muted-foreground space-y-3 font-bold uppercase tracking-widest italic">
        {children}
      </ul>
    </div>
  )
}

function StatusRow({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center text-[10px] font-black">
      <span className="text-muted-foreground uppercase tracking-widest opacity-60">{label}</span>
      <span className={`${color} italic uppercase`}>{value}</span>
    </div>
  )
}
