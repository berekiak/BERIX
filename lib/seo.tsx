import type { Metadata } from 'next';
import { site } from '@/lib/config';
export function pageMetadata(title:string,description:string,path:string):Metadata {
  return {title,description,alternates:{canonical:path},openGraph:{title:title+' | Nexora Digital',description,url:site.url+path,locale:'fr_CD',siteName:site.name,type:'website',images:[{url:'/opengraph-image',width:1200,height:630,alt:'Nexora Digital — solutions digitales sur mesure à Kinshasa'}]},twitter:{card:'summary_large_image',title,description,images:['/opengraph-image']}};
}
export function JsonLd({data}:{data:Record<string,unknown>|Record<string,unknown>[]}) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(data).replace(/</g,'\\u003c')}}/>;
}
