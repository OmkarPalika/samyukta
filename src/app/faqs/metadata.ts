import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: "FAQs - Samyukta 2025 Tech Summit | Common Questions Answered",
  description: "Find answers to frequently asked questions about Samyukta 2025. Registration, events, accommodation, travel, prizes, and more. Get all the information you need for India's premier student tech summit.",
  keywords: [
    "samyukta faqs", "tech summit questions", "registration help", "event information", 
    "ANITS tech fest", "student summit help", "hackathon questions", "workshop details"
  ],
  url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://samyukta..vercel.app'}/faqs`
});