import Image from 'next/image';
import Link from 'next/link';
import type { MouseEventHandler } from 'react';
export function Brand({footer=false,onClick}:{footer?:boolean;onClick?:MouseEventHandler<HTMLAnchorElement>}) {return <Link href="/" onClick={onClick} className={`brand ${footer?'brand-footer':''}`} aria-label="NEXORA DIGITAL — Accueil"><span className="brand-mark" aria-hidden="true"><Image src="/images/logo-officiel.webp" alt="" width={144} height={144} sizes="144px" priority={!footer}/></span><span className="brand-name">NEXORA{' '}<span>DIGITAL</span></span></Link>;}
