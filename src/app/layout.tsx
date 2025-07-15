import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutProvider from "@/components/layout/LayoutProvider";
import { GoogleAnalytics, HotjarTracking } from "@/components/shared/Analytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://samyukta.anits.edu.in';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Samyukta 2025 - India's Premier Student Innovation Summit | ANITS Visakhapatnam",
    template: "%s | Samyukta 2025 - ANITS"
  },
  description: "Join 400+ innovators at India's biggest student-led national tech summit. 4-day event featuring hackathons, AI/ML workshops, cloud computing, pitch competitions, and industry networking at ANITS Visakhapatnam, August 6-9, 2025.",
  keywords: [
    "Samyukta 2025", "ANITS", "tech summit", "innovation summit", "hackathon", "student event",
    "Visakhapatnam", "AI workshop", "ML workshop", "cloud computing", "AWS", "Google Cloud",
    "pitch competition", "startup event", "tech conference", "student innovation", "national summit",
    "technology event", "coding competition", "engineering summit", "tech fest", "innovation challenge"
  ],
  authors: [{ name: "ANITS Samyukta Team", url: "https://anits.edu.in" }],
  creator: "ANITS Samyukta Team",
  publisher: "Anil Neerukonda Institute of Technology and Sciences",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: baseUrl,
    siteName: "Samyukta 2025 - ANITS",
    title: "Samyukta 2025 - India's Premier Student Innovation Summit",
    description: "Join 400+ innovators at India's biggest student-led tech summit. 4-day event with hackathons, workshops, and competitions at ANITS Visakhapatnam.",
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512,
        alt: "Samyukta 2025 - India's Premier Student Innovation Summit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@samyukta_anits",
    creator: "@anits_official",
    title: "Samyukta 2025 - India's Premier Student Innovation Summit",
    description: "Join 400+ innovators at India's biggest student-led tech summit. Register now for August 6-9, 2025 at ANITS Visakhapatnam.",
    images: [`${baseUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-IN': baseUrl,
      'en': baseUrl,
    },
  },
  category: "Technology",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0F0F23' },
    { media: '(prefers-color-scheme: dark)', color: '#0F0F23' }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Samyukta 2025 - India's Premier Student Innovation Summit",
    "description": "Join 400+ innovators at India's biggest student-led national tech summit featuring hackathons, AI/ML workshops, cloud computing, and pitch competitions.",
    "startDate": "2025-08-06T09:00:00+05:30",
    "endDate": "2025-08-09T18:00:00+05:30",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "Anil Neerukonda Institute of Technology and Sciences",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Sangivalasa",
        "addressLocality": "Visakhapatnam",
        "addressRegion": "Andhra Pradesh",
        "postalCode": "531162",
        "addressCountry": "IN"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "ANITS Samyukta Team",
      "url": "https://anits.edu.in"
    },
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/register`,
      "price": "800",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-07-10T00:00:00+05:30"
    },
    "image": [`${baseUrl}/logo.png`],
    "url": baseUrl,
    "isAccessibleForFree": false,
    "maximumAttendeeCapacity": 400
  };

  return (
    <html lang="en-IN">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <LayoutProvider>
          {children}
        </LayoutProvider>
        {/* Analytics Components */}
        <GoogleAnalytics />
        <HotjarTracking />
      </body>
    </html>
  );
}
