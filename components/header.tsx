'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Brand } from './brand';
import { ButtonLink } from './ui';
import { fr } from '@/data/locales/fr';
import { site } from '@/lib/config';
export function Header() {
  const pathname=usePathname();const dialog=useRef<HTMLDialogElement>(null);const trigger=useRef<HTMLButtonElement>(null);const [open,setOpen]=useState(false);
  function close(){dialog.current?.close();}
  function openMenu(){dialog.current?.showModal();setOpen(true);document.body.style.overflow='hidden';}
  function onClose(){setOpen(false);document.body.style.overflow='';trigger.current?.focus();}
  return <header className="site-header"><div className="container header-inner"><Brand/><nav className="desktop-nav" aria-label="Navigation principale">{fr.nav.map(n=><Link key={n.href} href={n.href} className={pathname===n.href?'nav-active':''} aria-current={pathname===n.href?'page':undefined}>{n.label}</Link>)}</nav><ButtonLink href="/devis" className="header-cta" data-track="cta_header">Parlons de votre projet</ButtonLink><button ref={trigger} type="button" className="menu-toggle" onClick={openMenu} aria-expanded={open} aria-controls="mobile-navigation" aria-label="Ouvrir le menu"><Menu size={24}/></button></div><dialog ref={dialog} id="mobile-navigation" className="mobile-menu" onClose={onClose} aria-label="Navigation principale mobile"><div className="mobile-menu-top"><Brand/><button type="button" className="icon-button" onClick={close} aria-label="Fermer le menu"><X size={24}/></button></div><nav aria-label="Pages du site">{fr.nav.map((n,i)=><Link key={n.href} href={n.href} onClick={close} aria-current={pathname===n.href?'page':undefined}><span className="menu-number">0{i+1}</span>{n.label}</Link>)}</nav><ButtonLink href="/devis" onClick={close}>Démarrer un projet</ButtonLink><a href={`mailto:${site.email}`} className="mobile-menu-email">{site.email}</a><p className="mobile-menu-location">Kinshasa, RDC · Des solutions sans frontières.</p></dialog></header>;
}
