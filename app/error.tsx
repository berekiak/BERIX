'use client';
import { Button } from '@/components/ui';
export default function ErrorPage({reset}:{reset:()=>void}){return <section className="not-found"><div className="container"><h1>Une interruption momentanée.</h1><p>Cette page n’a pas pu se charger. Vous pouvez réessayer dans un instant.</p><Button onClick={reset}>Réessayer</Button></div></section>;}
