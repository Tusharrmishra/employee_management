import {useState} from 'react';import {useStore} from '../context/Store'
const blank={name:'',email:'',phone:'',designation:'',deptId:'d1',siteId:'s1',gross:30000}
export default function Employees(){const {db,mutate,user}=useStore();const [q,setQ]=useState(''),[dept,setDept]=useState(''),[page,setPage]=useState(0),[form,setForm]=useState(null)
const canEdit=['admin','hr'].includes(user.role),me=user.empId
let list=db.employees.filter(e=>(user.role!=='manager'||e.managerId===me)&&(!dept||e.deptId===dept)&&(e.name+e.empId+e.email).toLowerCase().includes(q.toLowerCase()))
const per=8,pages=Math.max(1,Math.ceil(list.length/per)),rows=list.slice(page*per,page*per+per)
const dn=id=>db.departments.find(d=>d.id===id)?.name,sn=id=>db.sites.find(s=>s.id===id)?.name
const save=e=>{e.preventDefault();mutate((d,log)=>{const id=`e${d.employees.length+1}`,empId=`EMP-${String(d.employees.length+1).padStart(4,'0')}`
d.employees.push({id,empId,name:form.name,email:form.email,phone:form.phone,designation:form.designation,deptId:form.deptId,siteId:form.siteId,managerId:null,joining:new Date().toISOString().slice(0,10),status:'active',bank:{},salary:{type:'monthly',gross:+form.gross,allowances:0,deductions:0,otRate:0}})
log('create','employee',`${empId} ${form.name}`)});setForm(null)}
const toggle=e=>mutate((d,log)=>{const x=d.employees.find(y=>y.id===e.id);x.status=x.status==='active'?'inactive':'active';log('status','employee',`${x.empId} → ${x.status}`)})
const exportCsv=()=>{const h=['EmpID','Name','Email','Department','Site','Status'],r=list.map(e=>[e.empId,e.name,e.email,dn(e.deptId),sn(e.siteId),e.status])
const b=new Blob([[h,...r].map(x=>x.join(',')).join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='employees.csv';a.click()}
return <div className="space-y-3"><div className="flex flex-wrap items-center gap-2"><h1 className="mr-auto text-xl font-bold">Employees</h1>
<input className="input !w-48" placeholder="Search name, ID, email" value={q} onChange={e=>{setQ(e.target.value);setPage(0)}}/>
<select className="input !w-40" value={dept} onChange={e=>{setDept(e.target.value);setPage(0)}}><option value="">All departments</option>{db.departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select>
<button className="btn-ghost" onClick={exportCsv}>Export CSV</button>{canEdit&&<button className="btn" onClick={()=>setForm(blank)}>Add employee</button>}</div>
{form&&<form onSubmit={save} className="card grid gap-2 md:grid-cols-4">{['name','email','phone','designation'].map(k=><input key={k} required className="input" placeholder={k} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>)}
<select className="input" value={form.deptId} onChange={e=>setForm({...form,deptId:e.target.value})}>{db.departments.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select>
<select className="input" value={form.siteId} onChange={e=>setForm({...form,siteId:e.target.value})}>{db.sites.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
<input className="input" type="number" value={form.gross} onChange={e=>setForm({...form,gross:e.target.value})}/><div className="flex gap-2"><button className="btn">Save employee</button><button type="button" className="btn-ghost" onClick={()=>setForm(null)}>Cancel</button></div></form>}
<div className="card overflow-x-auto !p-0"><table className="w-full"><thead><tr>{['ID','Name','Department','Site','Gross (₹)','Status',''].map(h=><th key={h} className="th">{h}</th>)}</tr></thead>
<tbody>{rows.map(e=><tr key={e.id}><td className="td">{e.empId}</td><td className="td">{e.name}<div className="text-xs text-slate-500">{e.designation}</div></td><td className="td">{dn(e.deptId)}</td><td className="td">{sn(e.siteId)}</td>
<td className="td">{canEdit?e.salary.gross.toLocaleString('en-IN'):'—'}</td><td className="td"><span className={`badge ${e.status==='active'?'bg-green-100 text-green-800':'bg-slate-200 text-slate-600'}`}>{e.status}</span></td>
<td className="td">{canEdit&&<button className="btn-ghost !py-1" onClick={()=>toggle(e)}>{e.status==='active'?'Deactivate':'Activate'}</button>}</td></tr>)}
{!rows.length&&<tr><td className="td" colSpan={7}>No employees match these filters.</td></tr>}</tbody></table></div>
<div className="flex items-center justify-end gap-2 text-sm"><button className="btn-ghost" disabled={!page} onClick={()=>setPage(page-1)}>Previous</button>Page {page+1} of {pages}<button className="btn-ghost" disabled={page+1>=pages} onClick={()=>setPage(page+1)}>Next</button></div></div>}
