import { StaticPage, metadataFor } from '@/app/static-page';
export const metadata=metadataFor('devis');
export default async function Page({searchParams}:{searchParams:Promise<{service?:string}>}){return <StaticPage slug="devis" initialService={(await searchParams).service||''}/>;}
