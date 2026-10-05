import { z } from 'zod';
import { projectBrief } from './project-brief.ts';
z.config({jitless:true});
export const projectTypes=['sites-web','applications-web','applications-mobiles','solutions-gestion','automatisation','e-commerce','design-ui-ux','sur-mesure','autre'] as const;
const optionalText=(max:number)=>z.string().trim().max(max,'Ce texte est trop long.').default('');
export const leadSchema=z.object({
  kind:z.enum(['contact','devis']),
  firstName:z.string().trim().min(2,'Indiquez votre prénom.').max(80),
  lastName:z.string().trim().min(2,'Indiquez votre nom.').max(100),
  company:optionalText(160),
  email:z.email('Indiquez une adresse e-mail valide.').trim().max(254),
  phone:optionalText(40).refine(v=>!v||/^[+\d\s().-]{6,40}$/.test(v),'Vérifiez votre numéro de téléphone.'),
  country:optionalText(100),
  projectType:z.enum([...projectTypes,'']).default(''),
  objective:z.string().trim().min(20,'Décrivez votre besoin en au moins 20 caractères.').max(4000,'Votre message est trop long.'),
  features:optionalText(4000),
  budget:z.enum(['','a-definir','moins-1000','1000-3000','3000-10000','plus-10000']).default(''),
  deadline:z.enum(['','a-definir','1-mois','1-3-mois','3-plus']).default(''),
  projectStage:z.enum(['','nouveau','existant']).default(''),
  existingUrl:optionalText(500).refine(v=>{if(!v)return true;try{const u=new URL(v);return ['http:','https:'].includes(u.protocol);}catch{return false;}},'Indiquez un lien http:// ou https:// valide.'),
  subject:optionalText(160),
  message:optionalText(3000),
  consent:z.literal(true,{error:'Votre accord est nécessaire pour traiter cette demande.'}),
  website:optionalText(200),
  requestId:z.uuid(),
  startedAt:z.number().finite(),
}).strict().superRefine((v,ctx)=>{
  if(v.kind==='devis'&&!v.projectType)ctx.addIssue({code:'custom',path:['projectType'],message:'Choisissez votre type de projet.'});
  if(v.kind==='contact'&&v.subject.length<3)ctx.addIssue({code:'custom',path:['subject'],message:'Indiquez l’objet de votre message.'});
  if(projectBrief(v).length>5000)ctx.addIssue({code:'custom',path:[v.features?'features':'objective'],message:'Votre description complète est trop longue. Raccourcissez l’objectif, les fonctionnalités ou le complément pour pouvoir envoyer votre demande.'});
});
export type Lead=z.infer<typeof leadSchema>;
export function escapeHtml(value:string){return value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));}
