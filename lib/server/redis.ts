import 'server-only';
import { createHmac, randomBytes } from 'node:crypto';
export class ServiceUnavailable extends Error{}
const memory=new Map<string,{value:string;expires:number}>();
const processSalt=randomBytes(32).toString('hex');
const configured=()=>Boolean(process.env.UPSTASH_REDIS_REST_URL&&process.env.UPSTASH_REDIS_REST_TOKEN);
export function networkKey(ip:string){return createHmac('sha256',process.env.RATE_LIMIT_SALT||processSalt).update(ip).digest('hex');}
export async function redis(command:(string|number)[]):Promise<unknown>{
  if(!configured()){
    if(memory.size>5000){for(const [key,item] of memory){if(item.expires<Date.now())memory.delete(key);}if(memory.size>5000)memory.delete(memory.keys().next().value as string);}
    const [cmd,key,value,...rest]=command;const k=String(key);const old=memory.get(k);if(old&&old.expires<Date.now())memory.delete(k);
    if(cmd==='GET')return memory.get(k)?.value||null;
    if(cmd==='DEL'){memory.delete(k);return 1;}
    if(cmd==='SET'){if(rest.includes('NX')&&memory.has(k))return null;const expireIndex=rest.indexOf('EX');memory.set(k,{value:String(value),expires:Date.now()+(expireIndex>=0?Number(rest[expireIndex+1]):86400)*1000});return 'OK';}
    if(cmd==='EVAL'){const mapKey=String(command[3]);const previous=memory.get(mapKey);const current=previous&&previous.expires>Date.now()?Number(previous.value):0;memory.set(mapKey,{value:String(current+1),expires:previous&&previous.expires>Date.now()?previous.expires:Date.now()+Number(command[4])*1000});return current+1;}
    throw new Error('Unsupported local Redis operation');
  }
  const response=await fetch(process.env.UPSTASH_REDIS_REST_URL!,{method:'POST',headers:{Authorization:`Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(command),signal:AbortSignal.timeout(5000),cache:'no-store'});
  if(!response.ok)throw new ServiceUnavailable('Rate limiter unavailable');const data=await response.json();if(data.error)throw new ServiceUnavailable('Rate limiter failed');return data.result;
}
export async function rateLimit(ip:string,limit=5,windowSeconds=600){const key=`nexora:rate:${networkKey(ip)}:${Math.floor(Date.now()/(windowSeconds*1000))}`;const count=Number(await redis(['EVAL',"local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end; return n;",1,key,windowSeconds]));return count<=limit;}
