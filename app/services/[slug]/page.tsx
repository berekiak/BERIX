import { notFound } from 'next/navigation';
import { ServicePage } from '@/sections/pages';
import { services } from '@/data/content';
import { site } from '@/lib/config';
import { JsonLd, pageMetadata } from '@/lib/seo';
export const dynamicParams=false;
export function generateStaticParams(){return services.map(s=>({slug:s.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const s=services.find(s=>s.slug===slug);return s?pageMetadata(s.title+' à Kinshasa',s.seoDescription,'/services/'+s.slug):{title:'Service introuvable',robots:{index:false}};}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const s=services.find(s=>s.slug===slug);if(!s)notFound();return <><ServicePage service={s}/><JsonLd data={[{'@context':'https://schema.org','@type':'Service',name:s.title,description:s.description,serviceType:s.title,url:site.url+'/services/'+s.slug,provider:{'@id':site.url+'/#organization'},areaServed:{'@type':'Country',name:'République démocratique du Congo'}},{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Accueil',item:site.url},{'@type':'ListItem',position:2,name:'Services',item:site.url+'/services'},{'@type':'ListItem',position:3,name:s.title,item:site.url+'/services/'+s.slug}]}]}/></>;}
