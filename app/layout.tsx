import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "LUXE FURNITURE - Premium Pre-owned Designer Furniture",
  description: "Discover exceptional designer furniture from model houses and exhibitions at exclusive prices. Curated collection of A-grade luxury furniture.",
  keywords: "luxury furniture, designer furniture, pre-owned furniture, model house furniture, exhibition furniture",
  authors: [{ name: "LUXE FURNITURE" }],
  openGraph: {
    title: "LUXE FURNITURE - Premium Pre-owned Designer Furniture",
    description: "Discover exceptional designer furniture from model houses and exhibitions at exclusive prices.",
    type: "website",
    locale: "ko_KR",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "LUXE FURNITURE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="font-sans antialiased">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
