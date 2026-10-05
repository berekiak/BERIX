'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
function send(event:string,path:string){const data=JSON.stringify({event,path});if(navigator.sendBeacon)navigator.sendBeacon('/api/events',new Blob([data],{type:'application/json'}));}
export function Analytics({enabled}:{enabled:boolean}){const path=usePathname();useEffect(()=>{if(!enabled)return;send('page_view',path);function click(e:MouseEvent){const el=(e.target as Element).closest?.('[data-track]');if(el)send(el.getAttribute('data-track')||'',path);}function conversion(e:Event){const kind=(e as CustomEvent<string>).detail;send(kind==='devis'?'quote_submitted':'contact_submitted',path);}document.addEventListener('click',click);window.addEventListener('nexora:conversion',conversion);return()=>{document.removeEventListener('click',click);window.removeEventListener('nexora:conversion',conversion);};},[enabled,path]);return null;}
