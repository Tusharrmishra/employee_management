import {createContext,useContext,useState,useEffect} from 'react'
import {seed} from '../data/mock'
const C=createContext();export const useStore=()=>useContext(C)
export function StoreProvider({children}){
const [db,setDb]=useState(seed),[user,setUser]=useState(null),[dark,setDark]=useState(false)
useEffect(()=>{document.documentElement.classList.toggle('dark',dark)},[dark])
// mutate(fn): fn(draft, log) edits a clone; log(action, entity, detail) appends to the audit trail.
// Replace this with real API calls when the backend exists.
const mutate=fn=>setDb(d=>{const n=structuredClone(d)
const log=(action,entity,detail)=>n.audit.unshift({id:crypto.randomUUID(),at:new Date().toISOString(),actor:user?.name||'system',action,entity,detail})
fn(n,log);return n})
const login=(email,pw)=>{const u=db.users.find(x=>x.email===email);if(!u||pw!=='demo123')return false;setUser(u);return true}
return <C.Provider value={{db,mutate,user,login,logout:()=>setUser(null),dark,setDark}}>{children}</C.Provider>}
