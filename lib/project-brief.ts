import { projectTypeLabels } from './project-labels.ts';
type Brief = {
  firstName:string; lastName:string; country:string; projectStage:string;
  existingUrl:string; objective:string; features:string; message:string;
  projectType?:string;
};

// The existing Nexora mail transport accepts a message of up to 5,000 characters.
// Include every field that transport does not expose as a separate property.
export function projectBrief(lead:Brief) {
  const rows = [
    ['Prénom',lead.firstName], ['Nom',lead.lastName], ['Pays',lead.country],
    ['Type de projet',projectTypeLabels[lead.projectType||'']||''],
    ['État du projet',lead.projectStage==='nouveau'?'Nouveau projet':lead.projectStage==='existant'?'Projet à moderniser':''],
    ['Lien du projet existant',lead.existingUrl], ['Objectif',lead.objective],
    ['Fonctionnalités principales',lead.features], ['Informations complémentaires',lead.message],
  ];
  return rows.filter(([,value])=>value).map(([label,value])=>`${label} : ${value}`).join('\n\n');
}
