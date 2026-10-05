import type { FAQ } from '@/types/content';
import { Plus } from 'lucide-react';
export function FAQList({items}:{items:FAQ[]}){return <div className="faq-list">{items.map((f,i)=><details key={f.question} className="faq-item"><summary><span className="faq-number">0{i+1}</span><span>{f.question}</span><Plus size={20} aria-hidden="true"/></summary><p>{f.answer}</p></details>)}</div>;}
