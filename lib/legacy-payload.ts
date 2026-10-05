import type { Lead } from './lead-schema.ts';
import { projectBrief } from './project-brief.ts';
import { budgetLabels, deadlineLabels } from './project-labels.ts';

// Verified against the published transport's schema (Sites version 6).
// Its six categories differ from the new site's nine project choices.
const serviceCategories:Record<Lead['projectType'],string>={
  '':'','sites-web':'Sites web','applications-web':'Applications',
  'applications-mobiles':'Applications','solutions-gestion':'Outils de gestion',
  automatisation:'Transformation numérique','e-commerce':'Solutions sur mesure',
  'design-ui-ux':'UI/UX Design','sur-mesure':'Solutions sur mesure',
  autre:'Solutions sur mesure',
};
export function legacyPayload(lead:Lead){
  const fullName=`${lead.firstName} ${lead.lastName}`.trim();
  // The transport's name limit is 120 characters. The full first and last
  // names remain in the project brief when the display name needs shortening.
  const name=fullName.length<=120?fullName:`${Array.from(lead.firstName)[0]}. ${lead.lastName}`;
  return {
    key:lead.requestId,kind:lead.kind,name,email:lead.email,
    company:lead.company,phone:lead.phone,subject:lead.subject||'Demande de projet',
    message:projectBrief(lead),service:serviceCategories[lead.projectType],
    budget:budgetLabels[lead.budget]||'',deadline:deadlineLabels[lead.deadline]||'',
    website:'',consent:lead.consent,
  };
}
export function legacyReceipt(body:unknown){
  if(!body||typeof body!=='object')throw new Error('Invalid Nexora mail receipt');
  const receipt=body as Record<string,unknown>;
  if(receipt.emailSent!==true||typeof receipt.reference!=='string'||!receipt.reference.trim())throw new Error('Invalid Nexora mail receipt');
  return {reference:receipt.reference.trim(),confirmationSent:receipt.confirmationSent===true};
}
