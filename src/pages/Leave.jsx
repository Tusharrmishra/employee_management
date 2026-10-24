import {useState} from 'react';import {useStore} from '../context/Store';import {MONTH} from '../data/mock'
export default function Leave(){const {db,mutate,user}=useStore();const emp=db.employees.find(e=>e.id===user.empId),approver=['admin','hr','manager'].includes(user.role)
const [f,setF]=useState({typeId:'l1',from:'',to:'',reason:''})
const typeName=id=>db.leaveTypes.find(t=>t.id===id)?.name,empName=id=>db.employees.find(e=>e.id===id)?.name
const days=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5)+1
const apply=e=>{e.preventDefault();mutate((d,log)=>{d.leaves.push({id:'r'+Date.now(),empId:emp.id,...f,days:days(f.from,f.to),status:'pending'});log('apply','leave',`${emp.empId} ${f.from}→${f.to}`)});setF({...f,from:'',to:'',reason:''})}
const decide=(l,status)=>mutate((d,log)=>{const r=d.leaves.find(x=>x.id===l.id);r.status=status;log(status,'leave',`${empName(r.empId)} ${r.from}→${r.to}`)
if(status==='approved')for(let t=new Date(r.from);t<=new Date(r.to);t.setDate(t.getDate()+1)){const ds=t.toISOString().slice(0,10),x=d.attendance.find(a=>a.empId===r.empId&&a.date===ds)
if(x){x.status='leave';x.flags=[]}else d.attendance.push({id:`${r.empId}-${ds}`,empId:r.empId,date:ds,status:'leave',flags:[],checkIn:null,checkOut:null,workedMinutes:0})}})
const bal=t=>t.quota-db.leaves.filter(l=>l.empId===emp?.id&&l.typeId===t.id&&l.status==='approved').reduce((s,l)=>s+l.days,0)
const pending=db.leaves.filter(l=>l.status==='pending'&&(user.role!=='manager'||db.employees.find(e=>e.id===l.empId)?.managerId===user.empId))
return <div className="space-y-4"><h1 className="text-xl font-bold">Leave</h1>
{emp&&<div className="grid gap-4 md:grid-cols-2"><form onSubmit={apply} className="card space-y-2"><div className="font-semibold">Apply for leave</div>
<select className="input" value={f.typeId} onChange={e=>setF({...f,typeId:e.target.value})}>{db.leaveTypes.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
<div className="flex gap-2"><input required type="date" className="input" value={f.from} onChange={e=>setF({...f,from:e.target.value,to:f.to||e.target.value})}/><input required type="date" className="input" min={f.from} value={f.to} onChange={e=>setF({...f,to:e.target.value})}/></div>
<input required className="input" placeholder="Reason" value={f.reason} onChange={e=>setF({...f,reason:e.target.value})}/><button className="btn">Submit request</button></form>
<div className="card"><div className="mb-2 font-semibold">My balances</div>{db.leaveTypes.filter(t=>t.quota).map(t=><div key={t.id} className="flex justify-between py-1 text-sm"><span>{typeName(t.id)}</span><span>{bal(t)} of {t.quota} days left</span></div>)}</div></div>}
{approver&&<div className="card"><div className="mb-2 font-semibold">Pending approvals</div>{pending.map(l=><div key={l.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 py-2 text-sm dark:border-slate-700">
<span>{empName(l.empId)} · {typeName(l.typeId)} · {l.from} to {l.to} ({l.days} d) — {l.reason}</span><span className="flex gap-2"><button className="btn !py-1" onClick={()=>decide(l,'approved')}>Approve</button><button className="btn-ghost !py-1" onClick={()=>decide(l,'rejected')}>Reject</button></span></div>)}
{!pending.length&&<p className="text-sm text-slate-500">Nothing is waiting for your approval.</p>}</div>}
<div className="card"><div className="mb-2 font-semibold">{approver?'All requests':'My requests'}</div>{db.leaves.filter(l=>approver||l.empId===emp?.id).map(l=><div key={l.id} className="flex justify-between border-t border-slate-100 py-2 text-sm dark:border-slate-700"><span>{approver&&empName(l.empId)+' · '}{typeName(l.typeId)} · {l.from} to {l.to}</span><span className="badge bg-slate-100 dark:bg-slate-700">{l.status}</span></div>)}</div></div>}
