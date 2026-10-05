import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
export function ButtonLink({href,children,variant='primary',className='',...props}:{href:string;children:ReactNode;variant?:'primary'|'secondary'|'text';className?:string}&Omit<AnchorHTMLAttributes<HTMLAnchorElement>,'href'>) {
  return <Link href={href} className={`button button-${variant} ${className}`} {...props}>{children}</Link>;
}
export function Button({children,variant='primary',className='',...props}:ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'secondary'|'text'}) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>;
}
export function Badge({children,className=''}:{children:ReactNode;className?:string}) {return <span className={`badge ${className}`}>{children}</span>;}
export function SectionHeading({eyebrow,title,description,children}:{eyebrow:string;title:ReactNode;description?:string;children?:ReactNode}) {
  return <div className="section-heading"><div><p className="eyebrow"><span aria-hidden="true"/> {eyebrow}</p><h2>{title}</h2>{description&&<p className="section-description">{description}</p>}</div>{children}</div>;
}
export function Breadcrumbs({items}:{items:{label:string;href?:string}[]}) {return <nav aria-label="Fil d’Ariane" className="breadcrumbs"><Link href="/">Accueil</Link>{items.map((item,i)=><span key={item.label}><span aria-hidden="true">/</span>{item.href?<Link href={item.href}>{item.label}</Link>:<span aria-current={i===items.length-1?'page':undefined}>{item.label}</span>}</span>)}</nav>;}
