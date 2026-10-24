import {useState} from 'react';import {useStore} from '../context/Store'
export default function Audit(){const {db}=useStore();const [q,setQ]=useState('')
const rows=db.audit.filter(a=>(a.entity+a.action+a.actor+a.detail).toLowerCase().includes(q.toLowerCase()))
return <div className="space-y-3"><div className="flex items-center gap-2"><h1 className="mr-auto text-xl font-bold">Audit log</h1><input className="input !w-56" placeholder="Filter by entity, actor, action" value={q} onChange={e=>setQ(e.target.value)}/></div>
<div className="card overflow-x-auto !p-0"><table className="w-full"><thead><tr>{['When','Who','Action','Entity','Details'].map(h=><th key={h} className="th">{h}</th>)}</tr></thead><tbody>
{rows.map(a=><tr key={a.id}><td className="td whitespace-nowrap">{new Date(a.at).toLocaleString('en-IN')}</td><td className="td">{a.actor}</td><td className="td">{a.action}</td><td className="td">{a.entity}</td><td className="td">{a.detail}</td></tr>)}
{!rows.length&&<tr><td className="td" colSpan={5}>No changes recorded yet. Edits to employees, attendance, leave and payroll will appear here.</td></tr>}</tbody></table></div></div>}
