import Image from 'next/image';
import Link from 'next/link';
import type { Service } from '@/types/content';
export function ServiceCard({service}:{service:Service}){return <Link href={`/services/${service.slug}`} className="service-card"><div className="service-image"><Image src={service.image} alt={service.imageAlt} fill sizes="(max-width: 639px) 92vw, (max-width: 1023px) 45vw, 30vw"/><span className="service-index">{service.number}</span><span className="service-open" aria-hidden="true">↗</span></div><div className="service-copy"><h3>{service.title}</h3><p>{service.short}</p></div></Link>;}
