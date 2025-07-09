import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: "Events & Schedule - Samyukta 2025 Tech Summit",
  description: "Explore the complete 4-day schedule of Samyukta 2025. Hackathons, AI/ML workshops, cloud computing sessions, pitch competitions, and networking events at ANITS Visakhapatnam, August 6-9, 2025.",
  keywords: [
    "samyukta events", "tech summit schedule", "hackathon timeline", "AI workshop", "ML workshop", 
    "cloud computing", "pitch competition", "tech conference agenda", "ANITS events", "student tech events"
  ],
  url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://samyukta.anits.edu.in'}/events`
});
