import type { MetadataRoute } from 'next';
import { site } from '@/lib/config';
import { services, projects } from '@/data/content';
export default function sitemap():MetadataRoute.Sitemap{const pages=['','/services','/solutions','/realisations','/etudes-de-cas','/a-propos','/processus','/contact','/devis','/faq','/mentions-legales','/confidentialite',...services.map(s=>'/services/'+s.slug),...projects.map(p=>'/etudes-de-cas/'+p.slug)];return pages.map(path=>({url:site.url+path,changeFrequency:path.includes('legales')||path.includes('confidentialite')?'yearly':'monthly',priority:path===''?1:path.includes('/services/')?.8:.7}));}
