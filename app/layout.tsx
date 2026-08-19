import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";
import { HydrationGate } from "@/components/layout/HydrationGate";
import { SITE_URL, GESMINE_ORG } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Poker Helper Calculator — Equity, Pot Odds & Bankroll Tools",
    template: "%s | Poker Helper Calculator",
  },
  description:
    "Free standalone poker equity calculator, implied odds calculator, and bankroll sizing tool. Manual card entry, no live-table connection — study your spots before or after you play.",
  manifest: "/manifest.json",
  applicationName: "Poker Helper Calculator",
  verification: {
    google: "PpR9SYzfHQotY1S4R_y4nXTe2h8MR8zpavZcEJTS8-A",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16a34a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const orgSchema = {
    "@context": "https://schema.org",
    ...GESMINE_ORG,
    url: SITE_URL,
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <ServiceWorkerRegister />
        <HydrationGate>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </HydrationGate>
      </body>
    </html>
  );
}
