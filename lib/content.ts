import { faqs, projects, services, testimonials } from '@/data/content';
// Replace this adapter with a CMS query without changing page components.
export const contentRepository = {
  services:()=>services,
  service:(slug:string)=>services.find(s=>s.slug===slug),
  projects:()=>projects,
  project:(slug:string)=>projects.find(p=>p.slug===slug),
  faqs:()=>faqs,
  testimonials:()=>testimonials.filter(t=>t.approved),
};
