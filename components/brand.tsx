import Image from 'next/image';
import Link from 'next/link';
export function Brand({footer=false}:{footer?:boolean}) {return <Link href="/" className={`brand ${footer?'brand-footer':''}`} aria-label="NEXORA DIGITAL — Accueil"><span className="brand-mark" aria-hidden="true"><Image src="/images/logo-officiel.webp" alt="" width={144} height={144} sizes="144px" priority={!footer}/></span><span className="brand-name">NEXORA<span>DIGITAL</span></span></Link>;}
