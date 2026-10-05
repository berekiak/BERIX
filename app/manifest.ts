import type { MetadataRoute } from 'next';
export default function manifest():MetadataRoute.Manifest{return {name:'NEXORA DIGITAL',short_name:'Nexora',description:'Sites web, applications et solutions digitales sur mesure.',start_url:'/',display:'standalone',background_color:'#060a14',theme_color:'#060a14',lang:'fr',icons:[{src:'/icon.png',sizes:'128x128',type:'image/png',purpose:'any'}]};}
