'use client';
import { LazyMotion, domAnimation, m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
export function Artwork({children,className=''}:{children:ReactNode;className?:string}){const reduced=useReducedMotion();return <LazyMotion features={domAnimation}><m.div className={className} initial={false} whileHover={reduced?undefined:{y:-5}} transition={{duration:.35,ease:[.22,1,.36,1]}}>{children}</m.div></LazyMotion>;}
