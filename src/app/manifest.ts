import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Samyukta 2025 - India\'s Premier Student Innovation Summit',
    short_name: 'Samyukta 2025',
    description: 'Join 400+ innovators at India\'s biggest student-led tech summit. Hackathons, AI/ML workshops, cloud computing, and pitch competitions at ANITS Visakhapatnam.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0F0F23',
    theme_color: '#0F0F23',
    orientation: 'portrait-primary',
    categories: ['education', 'technology', 'events', 'business'],
    lang: 'en-IN',
    dir: 'ltr',
    prefer_related_applications: false,
    
    // Enhanced icons for better PWA support
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    
    // Screenshots for app store listings
    screenshots: [
      {
        src: '/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Samyukta 2025 Dashboard - Wide View'
      },
      {
        src: '/screenshot-narrow.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Samyukta 2025 Mobile View'
      }
    ],
    
    // Shortcuts for quick actions
    shortcuts: [
      {
        name: 'Register Now',
        short_name: 'Register',
        description: 'Register for Samyukta 2025',
        url: '/register',
        icons: [
          {
            src: '/icons/register-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'Access your dashboard',
        url: '/dashboard',
        icons: [
          {
            src: '/icons/dashboard-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Events',
        short_name: 'Events',
        description: 'View event schedule',
        url: '/events',
        icons: [
          {
            src: '/icons/events-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      },
      {
        name: 'Contact',
        short_name: 'Contact',
        description: 'Get help and support',
        url: '/contact',
        icons: [
          {
            src: '/icons/contact-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ],
    
    // Protocol handlers for deep linking
    protocol_handlers: [
      {
        protocol: 'web+samyukta',
        url: '/?action=%s'
      }
    ],
    
    // File handlers for sharing
    file_handlers: [
      {
        action: '/share',
        accept: {
          'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
          'text/plain': ['.txt'],
          'application/pdf': ['.pdf']
        }
      }
    ],
    
    // Share target for receiving shared content
    share_target: {
      action: '/share',
      method: 'POST',
      enctype: 'multipart/form-data',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
        files: [
          {
            name: 'files',
            accept: ['image/*', 'text/plain', 'application/pdf']
          }
        ]
      }
    },
    
    // Edge side panel support (custom property)
    // edge_side_panel: {
    //   preferred_width: 400
    // },
    
    // Launch handler (custom property)
    // launch_handler: {
    //   client_mode: ['navigate-existing', 'auto']
    // }
  };
}