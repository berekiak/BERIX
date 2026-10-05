import 'server-only';
import type { Lead } from '@/lib/lead-schema';
import { notificationMessage } from '@/lib/email-message';
const legacyEndpoint='https://nexora-digital.kalonjiberekia.chatgpt.site/api/demandes';
const legacyOrigin='https://nexora-digital.kalonjiberekia.chatgpt.site';
async function forwardToNexoraService(lead:Lead,reference:string){
  const message=[lead.objective,lead.features,lead.message].filter(Boolean).join('\n\n');
  const response=await fetch(legacyEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Origin:legacyOrigin},body:JSON.stringify({key:lead.requestId,kind:lead.kind,name:`${lead.firstName} ${lead.lastName}`.trim(),email:lead.email,company:lead.company,phone:lead.phone,subject:lead.subject||'Demande de projet',message,service:lead.projectType,budget:lead.budget,deadline:lead.deadline,website:'',consent:lead.consent}),signal:AbortSignal.timeout(15000),cache:'no-store'});
  const body=await response.json().catch(()=>({})) as {reference?:string;confirmationSent?:boolean;error?:string};
  if(!response.ok)throw new Error('Nexora email service refused');
  return {reference:body.reference||reference,confirmationSent:Boolean(body.confirmationSent)};
}
export async function deliver(lead:Lead,reference:string){
  const apiKey=process.env.RESEND_API_KEY;const from=process.env.NEXORA_EMAIL_FROM;const recipient=process.env.NEXORA_CONTACT_EMAIL||'nexoradigitalrdc@gmail.com';
  if(!apiKey||!from)return forwardToNexoraService(lead,reference);
  const send=async(body:Record<string,unknown>,suffix:string)=>{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json','Idempotency-Key':`nexora-${lead.requestId}-${suffix}`},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error('Email provider refused');};
  const message=notificationMessage(lead,reference);
  try{await send({from,to:[recipient],reply_to:lead.email,...message},'notification');}catch{return forwardToNexoraService(lead,reference);}
  let confirmationSent=false;try{await send({from,to:[lead.email],reply_to:recipient,subject:`Votre demande Nexora Digital — ${reference}`,text:`Bonjour ${lead.firstName},\n\nVotre demande a été transmise à Nexora Digital. Nous allons étudier votre besoin et revenir vers vous.\n\nRéférence : ${reference}\n\nNexora Digital\nKinshasa, RDC\n${recipient}\n+243 858 181 330`},'confirmation');confirmationSent=true;}catch{/* The business notification is already delivered. */}
  return {reference,confirmationSent};
}
