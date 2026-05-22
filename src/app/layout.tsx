import type { Metadata } from "next";
import { VeloraProvider } from "@/context/VeloraContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velora | Global Social Chemistry & Connection Platform",
  description: "Experience a futuristic, premium global social platform built around humor alignment, lifestyle ambition, and authentic cross-cultural chemistry for Gen Z creators, founders, and travelers.",
  keywords: ["Velora", "Social chemistry", "Dating platform", "Cross-cultural matches", "AI Wingman", "Standup mode", "Aura Reels", "Gen Z startup"],
  authors: [{ name: "Velora Team" }],
  viewport: "width=device-width, initial-scale=1.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-warm-black text-stone-200 antialiased font-sans">
        <VeloraProvider>
          {children}
        </VeloraProvider>
      </body>
    </html>
  );
}
