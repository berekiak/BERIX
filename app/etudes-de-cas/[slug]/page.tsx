import { notFound } from 'next/navigation';
import { CaseStudyPage } from '@/sections/pages';
import { projects } from '@/data/content';
import { site } from '@/lib/config';
import { JsonLd, pageMetadata } from '@/lib/seo';
export function generateStaticParams(){return projects.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=projects.find(p=>p.slug===slug);return p?pageMetadata('Étude de cas : '+p.name,p.summary,'/etudes-de-cas/'+p.slug):{title:'Projet introuvable',robots:{index:false}};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=projects.find(p=>p.slug===slug);if(!p)notFound();return <><CaseStudyPage project={p}/><JsonLd data={{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Accueil',item:site.url},{'@type':'ListItem',position:2,name:'Études de cas',item:site.url+'/etudes-de-cas'},{'@type':'ListItem',position:3,name:p.name,item:site.url+'/etudes-de-cas/'+p.slug}]}}/></>;}
