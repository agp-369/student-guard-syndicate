"use client"

import { Inter } from "next/font/google";
import Link from "next/link";
import { useState } from "react";
import { ShieldCheck, LayoutGrid, Activity, BookOpen, Code, ShieldAlert, Database, Menu, X, Globe } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThreatTicker } from "@/components/threat-ticker";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

export default function ClientLayout({
  children,
  clerkKey
}: {
  children: React.ReactNode;
  clerkKey: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <ClerkProvider publishableKey={clerkKey}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <header className="fixed top-0 left-0 w-full z-[100] bg-background/60 backdrop-blur-3xl border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 md:gap-4 group shrink-0">
              <div className="h-9 w-9 md:h-12 md:w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg">
                <ShieldAlert className="h-5 w-5 md:h-7 md:w-7" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg md:text-2xl tracking-tighter uppercase italic block leading-none text-foreground">
                  Student<span className="text-primary">Guard.</span>
                </span>
                <span className="text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-0.5">Syndicate Node</span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
              <NavLink href="/" label="Console" icon={<Activity size={12} />} />
              <NavLink href="/intel" label="Intel_Vault" icon={<BookOpen size={12} />} />
              <NavLink href="/threats" label="Threat_Feed" icon={<LayoutGrid size={12} />} />
              <SignedIn>
                <NavLink href="/dashboard" label="Dashboard" icon={<Database size={12} />} />
              </SignedIn>
              <NavLink href="/api-docs" label="Uplink" icon={<Code size={12} />} />
            </nav>

            <div className="flex items-center gap-3 md:gap-6">
              <div className="hidden sm:block"><ThemeToggle /></div>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 md:px-6 py-2 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg cursor-pointer">
                    Join
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton appearance={{ elements: { userButtonAvatarBox: "h-9 w-9 md:h-10 md:w-10 rounded-xl" } }} />
              </SignedIn>
              <div className="hidden md:flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Grid_Online</span>
              </div>
              <button onClick={() => setIsMenuOpen(true)} className="lg:hidden h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-background/80 backdrop-blur-md z-[110] lg:hidden" />
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-[280px] bg-card border-l border-border z-[120] p-8 lg:hidden shadow-2xl">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="text-primary h-5 w-5" />
                    <span className="font-black text-sm uppercase italic">Syndicate Menu</span>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent text-muted-foreground cursor-pointer"><X size={20} /></button>
                </div>
                <nav className="flex flex-col gap-6">
                  <MobileNavLink href="/" label="Console" icon={<Activity size={16} />} onClick={() => setIsMenuOpen(false)} />
                  <MobileNavLink href="/intel" label="Intel_Vault" icon={<BookOpen size={16} />} onClick={() => setIsMenuOpen(false)} />
                  <MobileNavLink href="/threats" label="Threat_Feed" icon={<LayoutGrid size={16} />} onClick={() => setIsMenuOpen(false)} />
                  <SignedIn>
                    <MobileNavLink href="/dashboard" label="Dashboard" icon={<Database size={16} />} onClick={() => setIsMenuOpen(false)} />
                  </SignedIn>
                  <MobileNavLink href="/api-docs" label="Uplink" icon={<Code size={16} />} onClick={() => setIsMenuOpen(false)} />
                </nav>
                <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Theme</span>
                  <ThemeToggle />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <ThreatTicker />
        <main className="min-h-screen pt-20 md:pt-28">{children}</main>

        <footer className="py-16 md:py-24 border-t border-border bg-card relative z-10 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span className="font-black text-xl uppercase italic">StudentGuard</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium italic opacity-70 max-w-xs">
                Engineering digital immunity for the next generation. Join the Syndicate to protect the community.
              </p>
            </div>
            <FooterSection title="Infrastucture">
              <li><Link href="/" className="hover:text-primary transition-colors cursor-pointer">Forensic Console</Link></li>
              <li><Link href="/threats" className="hover:text-primary transition-colors cursor-pointer">Global Threat Board</Link></li>
              <li><Link href="/api-docs" className="hover:text-primary transition-colors cursor-pointer">API Dispatch</Link></li>
            </FooterSection>
            <FooterSection title="Governance">
              <li><Link href="/manifesto" className="hover:text-primary transition-colors cursor-pointer">Syndicate Manifesto</Link></li>
              <li><Link href="/sovereignty" className="hover:text-primary transition-colors cursor-pointer">Privacy Sovereignty</Link></li>
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
        </footer>
      </ThemeProvider>
    </ClerkProvider>
  );
}

function NavLink({ href, label, icon }: { href: string, label: string, icon: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all group shrink-0 cursor-pointer">
      <span className="group-hover:text-primary transition-transform group-hover:scale-110">{icon}</span>
      {label}
    </Link>
  )
}

function MobileNavLink({ href, label, icon, onClick }: { href: string, label: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all cursor-pointer">
      <span className="text-primary/50">{icon}</span>
      {label}
    </Link>
  )
}

function FooterSection({ title, children }: any) {
  return (
    <div className="space-y-6 text-left">
      <h4 className="text-[10px] font-black uppercase text-foreground tracking-[0.4em]">{title}</h4>
      <ul className="text-[10px] text-muted-foreground space-y-3 font-bold uppercase tracking-widest italic">{children}</ul>
    </div>
  )
}

function StatusRow({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center text-[9px] font-black">
      <span className="text-muted-foreground uppercase tracking-widest opacity-60">{label}</span>
      <span className={`${color} italic uppercase`}>{value}</span>
    </div>
  )
}
