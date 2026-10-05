import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { leadSchema } from '@/lib/lead-schema';
import { deliver } from '@/lib/server/email';
import { rateLimit, redis, ServiceUnavailable } from '@/lib/server/redis';
import { site } from '@/lib/config';
export const runtime='nodejs';export const maxDuration=45;
const json=(data:Record<string,unknown>,status=200,headers?:Record<string,string>)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store',...headers}});
export async function POST(request:NextRequest){
  const origin=request.headers.get('origin');if(!origin||![new URL(site.url).origin,request.nextUrl.origin].includes(origin))return json({error:'Cette demande ne provient pas du site.'},403);
  if(!request.headers.get('content-type')?.includes('application/json'))return json({error:'Format de demande non pris en charge.'},415);
  let key='';let locked=false;
  try{
    const reader=request.body?.getReader();if(!reader)return json({error:'Votre demande est vide.'},400);let bytes=0;const chunks:Uint8Array[]=[];while(true){const {value,done}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>20000){await reader.cancel();return json({error:'Votre demande est trop volumineuse.'},413);}chunks.push(value);}const raw=JSON.parse(Buffer.concat(chunks).toString('utf8'));const parsed=leadSchema.safeParse(raw);if(!parsed.success){const fields:Record<string,string>={};for(const issue of parsed.error.issues)fields[String(issue.path[0])]=issue.message;return json({error:'Vérifiez les informations de votre demande.',fields},400);}const lead=parsed.data;
    if(lead.website||Date.now()-lead.startedAt<800||lead.startedAt>Date.now())return json({error:'La demande n’a pas pu être validée. Vérifiez les champs et réessayez.'},400);
    key='nexora:receipt:'+createHash('sha256').update(lead.requestId+lead.email.toLowerCase()).digest('hex');const receipt=await redis(['GET',key]);if(typeof receipt==='string'&&receipt!=='pending')return json(JSON.parse(receipt),201);
    const ip=request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim()||request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'local';if(!await rateLimit(ip))return json({error:'Plusieurs demandes ont été envoyées récemment. Réessayez dans quelques minutes.'},429,{'Retry-After':'600'});
    locked=Boolean(await redis(['SET',key,'pending','EX',90,'NX']));if(!locked)return json({error:'Votre demande est en cours de traitement. Réessayez dans un instant.'},409,{'Retry-After':'5'});
    const reference='NX-'+lead.requestId.replaceAll('-','').slice(0,10).toUpperCase();const result=await deliver(lead,reference);await redis(['SET',key,JSON.stringify(result),'EX',86400]);return json(result,201);
  }catch(error){if(locked&&key)await redis(['DEL',key]).catch(()=>{});if(error instanceof SyntaxError)return json({error:'Le format de la demande est invalide.'},400);if(error instanceof ServiceUnavailable)return json({error:'Le formulaire est momentanément indisponible. Contactez-nous par e-mail ou WhatsApp.'},503);return json({error:'Votre demande n’a pas pu être transmise. Réessayez dans quelques instants.'},502);}
}
