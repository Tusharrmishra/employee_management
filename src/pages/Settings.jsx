import {useState} from 'react';import {useStore} from '../context/Store'
export default function Settings(){const {db,mutate}=useStore();const [s,setS]=useState(structuredClone(db.settings))
const set=(path,v)=>{const n=structuredClone(s);let o=n;const k=path.split('.');k.slice(0,-1).forEach(x=>o=o[x]);o[k.at(-1)]=v;setS(n)}
const F=({l,p,t='number'})=>{const v=p.split('.').reduce((o,x)=>o[x],s);return <label className="text-sm">{l}<input className="input mt-1" type={t} value={v} onChange={e=>set(p,t==='number'?+e.target.value:e.target.value)}/></label>}
return <div className="space-y-4"><h1 className="text-xl font-bold">Settings</h1>
<div className="card grid gap-3 md:grid-cols-3"><F l="Company name" p="company.name" t="text"/><F l="Company address" p="company.address" t="text"/><F l="Working days per month" p="workingDays"/></div>
<div className="card grid gap-3 md:grid-cols-3"><div className="font-semibold md:col-span-3">Statutory deductions (all values editable)</div>
<F l="PF rate (%)" p="rules.pf.rate"/><F l="PF wage ceiling (₹)" p="rules.pf.ceiling"/><div/><F l="ESI rate (%)" p="rules.esi.rate"/><F l="ESI wage ceiling (₹)" p="rules.esi.ceiling"/></div>
<div className="card"><div className="mb-2 font-semibold">Professional tax slabs</div>{s.rules.pt.slabs.map((sl,i)=><div key={i} className="mb-2 grid grid-cols-3 gap-2"><F l="From (₹)" p={`rules.pt.slabs.${i}.from`}/><F l="To (₹)" p={`rules.pt.slabs.${i}.to`}/><F l="Tax (₹)" p={`rules.pt.slabs.${i}.amount`}/></div>)}</div>
<button className="btn" onClick={()=>mutate((d,log)=>{log('update','settings','Company and payroll rules changed');d.settings=s})}>Save settings</button></div>}
