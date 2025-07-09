import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Samyukta 2025 - India\'s Premier Student Innovation Summit',
    short_name: 'Samyukta 2025',
    description: 'Join 400+ innovators at India\'s biggest student-led tech summit. Hackathons, AI/ML workshops, cloud computing, and pitch competitions at ANITS Visakhapatnam.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F23',
    theme_color: '#0F0F23',
    orientation: 'portrait-primary',
    categories: ['education', 'technology', 'events'],
    lang: 'en-IN',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    screenshots: [
      {
        src: '/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide'
      },
      {
        src: '/screenshot-narrow.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow'
      }
    ]
  };
}