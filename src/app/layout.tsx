import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BaseLayout from "@/components/layout/BaseLayout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Samyukta 2025 - ANITS | India's Premier Innovation Summit",
  description: "Join 400+ innovators at India's biggest student-led tech summit. Learn from industry experts, compete for prizes, and be part of the future of technology.",
  keywords: ["Samyukta 2025", "ANITS", "tech summit", "innovation", "hackathon", "student event", "Visakhapatnam"],
  authors: [{ name: "ANITS Samyukta Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0F0F23',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <BaseLayout>
          {children}
        </BaseLayout>
      </body>
    </html>
  );
}
