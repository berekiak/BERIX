import 'server-only';
import type { Lead } from '@/lib/lead-schema';
import { notificationMessage } from '@/lib/email-message';
import { legacyPayload, legacyReceipt } from '@/lib/legacy-payload';
const legacyEndpoint='https://nexora-digital.kalonjiberekia.chatgpt.site/api/demandes';
const legacyOrigin='https://nexora-digital.kalonjiberekia.chatgpt.site';
async function forwardToNexoraService(lead:Lead){
  const response=await fetch(legacyEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Origin:legacyOrigin},body:JSON.stringify(legacyPayload(lead)),signal:AbortSignal.timeout(15000),cache:'no-store'});
  const body:unknown=await response.json().catch(()=>({}));
  if(!response.ok){console.error('Nexora email transport refused',{status:response.status,transport:'existing-service'});throw new Error('Nexora email service refused');}
  return legacyReceipt(body);
}
export async function deliver(lead:Lead,reference:string){
  const apiKey=process.env.RESEND_API_KEY;const from=process.env.NEXORA_EMAIL_FROM;const recipient=process.env.NEXORA_CONTACT_EMAIL||'nexoradigitalrdc@gmail.com';
  if(!apiKey||!from)return forwardToNexoraService(lead);
  const send=async(body:Record<string,unknown>,suffix:string)=>{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json','Idempotency-Key':`nexora-${lead.requestId}-${suffix}`},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});if(!r.ok)throw new EmailProviderError(r.status);};
  const message=notificationMessage(lead,reference);
  try{await send({from,to:[recipient],reply_to:lead.email,...message},'notification');}catch(error){
    // A timeout or 5xx can follow an accepted send. Retry the same provider with
    // the same idempotency key instead of creating a second notification elsewhere.
    if(error instanceof EmailProviderError&&[400,401,403,404,422].includes(error.status))return forwardToNexoraService(lead);
    throw error;
  }
  let confirmationSent=false;try{await send({from,to:[lead.email],reply_to:recipient,subject:`Votre demande Nexora Digital — ${reference}`,text:`Bonjour ${lead.firstName},\n\nVotre demande a été transmise à Nexora Digital. Nous allons étudier votre besoin et revenir vers vous.\n\nRéférence : ${reference}\n\nNexora Digital\nKinshasa, RDC\n${recipient}\n+243 858 181 330`},'confirmation');confirmationSent=true;}catch{/* The business notification is already delivered. */}
  return {reference,confirmationSent};
}
class EmailProviderError extends Error {constructor(public status:number){super('Email provider refused');}}
