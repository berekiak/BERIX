import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Analytics } from '@/components/analytics';
import { JsonLd } from '@/lib/seo';
import { site } from '@/lib/config';
import '@/styles/globals.css';
const manrope=localFont({src:'../public/fonts/manrope.woff2',variable:'--font-manrope',weight:'200 800',display:'swap',preload:true});
const space=localFont({src:'../public/fonts/space-grotesk.woff2',variable:'--font-space',weight:'300 700',display:'swap',preload:true});
export const metadata:Metadata={metadataBase:new URL(site.url),title:{default:'Nexora Digital — Sites web et applications à Kinshasa',template:'%s | Nexora Digital'},description:'Sites web professionnels, applications et outils de gestion sur mesure à Kinshasa. Nexora Digital accompagne les entreprises et organisations en RDC.',applicationName:site.name,robots:{index:true,follow:true},manifest:'/manifest.webmanifest',verification:{google:process.env.GOOGLE_SITE_VERIFICATION||undefined},openGraph:{type:'website',siteName:site.name,locale:'fr_CD',images:['/opengraph-image']},twitter:{card:'summary_large_image'},icons:{icon:'/icon.png',apple:'/icon.png'}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:'#060a14'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr" className={`${manrope.variable} ${space.variable}`}><body><a className="skip-link" href="#main">Aller au contenu</a><Header/><main id="main">{children}</main><Footer/><Analytics enabled={Boolean(process.env.ANALYTICS_ENDPOINT)}/><JsonLd data={{'@context':'https://schema.org','@type':'Organization','@id':site.url+'/#organization',name:site.name,url:site.url,logo:site.url+'/images/logo-officiel.webp',email:site.email,telephone:site.phone,areaServed:{'@type':'Country',name:'République démocratique du Congo'},location:{'@type':'Place',address:{'@type':'PostalAddress',addressLocality:'Kinshasa',addressCountry:'CD'}},founder:{'@type':'Person',name:'Berekia Kalonji'}}}/></body></html>;}
