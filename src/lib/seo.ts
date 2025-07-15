import { Metadata } from 'next';

import { EVENT_CONFIG, URL_CONFIG } from '@/lib/config';

const baseUrl = URL_CONFIG.base;

export const siteConfig = {
  name: EVENT_CONFIG.name,
  title: `${EVENT_CONFIG.name} - India's Premier Student Innovation Summit | ANITS`,
  description: `${EVENT_CONFIG.description} ${EVENT_CONFIG.dates.display}.`,
  url: baseUrl,
  ogImage: `${baseUrl}/og-image.jpg`,
  twitterImage: `${baseUrl}/twitter-image.jpg`,
  keywords: [
    "Samyukta 2025", "ANITS", "tech summit", "innovation summit", "hackathon", "student event",
    "Visakhapatnam", "AI workshop", "ML workshop", "cloud computing", "AWS", "Google Cloud",
    "pitch competition", "startup event", "tech conference", "student innovation", "national summit",
    "technology event", "coding competition", "engineering summit", "tech fest", "innovation challenge",
    "Andhra Pradesh", "India", "student tech event", "college fest", "technical symposium"
  ],
  authors: [{ name: "ANITS Samyukta Team", url: "https://anits.edu.in" }],
  creator: "ANITS Samyukta Team",
  publisher: "Anil Neerukonda Institute of Technology and Sciences",
  social: {
    twitter: '@samyukta2025',
    instagram: 'https://www.instagram.com/samyukta.2025/',
    linkedin: 'https://www.linkedin.com/groups/14723748/'
  }
};

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string[];
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

export function generateSEO({
  title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  url = siteConfig.url,
  keywords = [],
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags = []
}: SEOProps = {}): Metadata {
  const seoTitle = title
    ? `${title} | ${siteConfig.name}`
    : siteConfig.title;

  const allKeywords = [...siteConfig.keywords, ...keywords, ...tags];

  return {
    title: seoTitle,
    description,
    keywords: allKeywords,
    authors: authors ? authors.map(name => ({ name })) : siteConfig.authors,
    creator: siteConfig.creator,
    publisher: siteConfig.publisher,
    openGraph: {
      type,
      locale: 'en_IN',
      url,
      siteName: siteConfig.name,
      title: seoTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: authors,
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.social?.twitter || '',
      creator: siteConfig.social?.twitter || '',
      title: seoTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
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
  };
}

export function generateEventStructuredData(eventData: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    name: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
  };
  organizer: {
    name: string;
    url: string;
  };
  offers?: {
    price: string;
    priceCurrency: string;
    url: string;
  };
  image?: string[];
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    ...eventData,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "isAccessibleForFree": false,
    "maximumAttendeeCapacity": 400,
  };
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Anil Neerukonda Institute of Technology and Sciences",
    "alternateName": "ANITS",
    "url": "https://anits.edu.in",
    "logo": `${baseUrl}/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-891-2866700",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi", "te"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Sangivalasa",
      "addressLocality": "Visakhapatnam",
      "addressRegion": "Andhra Pradesh",
      "postalCode": "531162",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.facebook.com/anits.official",
      "https://twitter.com/anits_official",
      "https://www.linkedin.com/school/anits/",
      "https://www.instagram.com/anits_official/"
    ]
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}