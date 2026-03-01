import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/client-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StudentGuard Syndicate | Global Community Defense Node",
  description: "Weaponizing collective intelligence against recruitment fraud. Forensic DNA probing and sovereign PDF analysis for the next generation of careers.",
  openGraph: {
    title: "StudentGuard Syndicate | Global Community Defense Node",
    description: "Join the sovereign network fighting recruitment fraud with real-time forensics.",
    url: "https://student-guard-syndicate.vercel.app",
    siteName: "StudentGuard Syndicate",
    images: [
      {
        url: "https://student-guard-syndicate.vercel.app/file.svg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudentGuard Syndicate",
    description: "Real-time forensic defense against job scams.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_YnVpbGQtc3RhYmlsaXR5LWtleS0wMC5jbGVyay5hY2NvdW50cy5kZXYk";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ClientLayout clerkKey={clerkKey}>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
