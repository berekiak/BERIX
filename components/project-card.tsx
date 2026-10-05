import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types/content';
export function ProjectCard({project,featured=false}:{project:Project;featured?:boolean}){return <Link href={`/etudes-de-cas/${project.slug}`} className={`project-card ${featured?'project-featured':''}`}><div className="project-image"><Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 767px) 90vw, 46vw"/><span className="project-view" aria-hidden="true">↗</span><span className="project-category">{project.category} · {project.year}</span></div><div className="project-copy"><p className="project-status">{project.status}</p><h3>{project.name}</h3><p>{project.summary}</p><span className="project-case-link">Découvrir le projet</span></div></Link>;}
