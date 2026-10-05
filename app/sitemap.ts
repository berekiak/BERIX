import type { MetadataRoute } from 'next';
import { site } from '@/lib/config';
import { services, projects, contentLastModified } from '@/data/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '', '/services', '/solutions', '/realisations', '/etudes-de-cas',
    '/a-propos', '/processus', '/contact', '/devis', '/faq',
    '/mentions-legales', '/confidentialite',
    ...services.map(service => '/services/' + service.slug),
    ...projects.map(project => '/etudes-de-cas/' + project.slug),
  ];

  return pages.map(path => ({
    url: site.url + path,
    lastModified: contentLastModified,
    changeFrequency: path.includes('legales') || path.includes('confidentialite') ? 'yearly' : 'monthly',
    priority: path === '' ? 1 : path.includes('/services/') ? 0.8 : 0.7,
  }));
}
