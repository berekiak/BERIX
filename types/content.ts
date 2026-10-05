export type Service = {
  slug: string; title: string; short: string; subtitle: string; description: string;
  problem: string; benefits: string[]; features: string[]; technologies: string[];
  image: string; imageAlt: string; number: string;
};
export type Project = {
  slug: string; name: string; category: string; sector: string; year: string;
  status: string; summary: string; client: string; image: string; imageAlt: string;
  liveUrl?: string; problem: string; objectives: string[]; approach: string;
  research: string; design: string; solution: string; features: string[];
  technologies: string[]; results: string; conclusion: string; gallery?: string[];
};
export type Testimonial = { name: string; role: string; quote: string; approved: boolean };
export type FAQ = { question: string; answer: string };
