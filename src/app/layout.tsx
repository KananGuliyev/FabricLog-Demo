import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

import {
  getSiteOrigin,
  isProductionDeployment,
  siteConfig,
} from "@/lib/constants/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteOrigin = getSiteOrigin();
const previewRobots = { index: false, follow: false } as const;

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: siteConfig.name,
    template: siteConfig.titleTemplate,
  },
  description:
    "A bilingual textile operations demo with mock auth, connected business workflows, and portfolio-safe demo data.",
  keywords: [
    "FabricLog",
    "portfolio dashboard",
    "Next.js full-stack demo",
    "textile business app",
    "bilingual SaaS demo",
  ],
  authors: [{ name: "Kanan Guliyev" }],
  creator: "Kanan Guliyev",
  publisher: siteConfig.name,
  alternates: {
    canonical: "/en",
    languages: {
      en: "/en",
      az: "/az",
    },
  },
  icons: {
    icon: "/brand/fabriclog-mark.svg",
    shortcut: "/brand/fabriclog-mark.svg",
    apple: "/brand/fabriclog-mark.svg",
  },
  openGraph: {
    type: "website",
    url: siteOrigin,
    title: siteConfig.name,
    description:
      "A polished public-safe textile operations demo covering customers, products, orders, invoices, payments, and reporting.",
    siteName: siteConfig.name,
    images: [
      {
        url: "/brand/fabriclog-mark.svg",
        alt: "FabricLog brand mark",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description:
      "Bilingual textile operations SaaS demo with mock auth and portfolio-safe sample data.",
    images: ["/brand/fabriclog-mark.svg"],
  },
  robots: isProductionDeployment()
    ? {
        index: true,
        follow: true,
      }
    : previewRobots,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
