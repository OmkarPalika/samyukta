import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://samyukta..vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/about',
    '/events',
    '/tickets',
    '/register',
    '/login',
    '/contact',
    '/faqs',
    '/speakers',
    '/sponsors',
    '/social',
    '/direct-join',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly' as const,
    priority: route === '' ? 1 : route === '/register' ? 0.9 : 0.8,
  }));
}