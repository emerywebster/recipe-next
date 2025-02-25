import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/login/', '/profile/'],
    },
    sitemap: 'https://recipe-app.example.com/sitemap.xml',
  };
}
