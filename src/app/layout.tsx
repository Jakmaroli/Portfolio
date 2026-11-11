import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LenisProvider from "@/components/LenisProvider";
import { PlainModeProvider } from "@/lib/plain-mode";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jak — git log --life",
  description:
    "2nd-year CSE at NIE. I ship backend systems, agents and IoT, mostly at hackathons.",
  // TODO(jak): add OG image showing the commit graph for share cards
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground">
        <LenisProvider>
          <PlainModeProvider>{children}</PlainModeProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
