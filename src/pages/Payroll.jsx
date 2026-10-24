import {useState} from 'react';import {useStore} from '../context/Store';import {MONTH} from '../data/mock';import {calcPayroll} from '../lib/payroll'
const inr=n=>'₹'+n.toLocaleString('en-IN',{minimumFractionDigits:2})
export default function Payroll(){const {db,mutate,user}=useStore();const manage=['admin','hr'].includes(user.role),[month,setMonth]=useState(MONTH),[slip,setSlip]=useState(null)
const runs=db.runs.filter(r=>manage||r.status!=='draft'),run=db.runs.find(r=>r.month===month)
const generate=()=>mutate((d,log)=>{const{workingDays,rules}=d.settings;const items=d.employees.filter(e=>e.status==='active').map(e=>{
const att=d.attendance.filter(a=>a.empId===e.id&&a.date.startsWith(month)),absent=att.filter(a=>a.status==='absent').length+att.filter(a=>a.status==='half_day').length*0.5
const unpaid=d.leaves.filter(l=>l.empId===e.id&&l.status==='approved'&&l.typeId==='l4').reduce((s,l)=>s+l.days,0)
const adj=d.adjustments.filter(a=>a.empId===e.id&&a.month===month),bonus=adj.filter(a=>a.type==='bonus').reduce((s,a)=>s+a.amount,0),ded=adj.filter(a=>a.type!=='bonus').reduce((s,a)=>s+a.amount,0)
const s=e.salary,c=calcPayroll({gross:s.gross,allowances:s.allowances,bonus,deductions:s.deductions+ded,absentDays:absent,unpaidLeaveDays:unpaid,workingDays,rules})
return{empId:e.id,gross:s.gross,allowances:s.allowances,bonus,absent,unpaid,presentDays:att.filter(a=>a.status==='present').length,workingDays,...c,other:s.deductions+ded}})
d.runs=d.runs.filter(r=>r.month!==month);d.runs.push({id:'run-'+month,month,status:'draft',items});log('generate','payroll',`${month}: ${items.length} employees`)})
const step=status=>mutate((d,log)=>{const r=d.runs.find(x=>x.month===month);log(status,'payroll',month);r.status=status})
const addBonus=()=>{const emp=prompt('Employee ID (e.g. e3):'),amt=+prompt('Bonus amount (₹):');if(emp&&amt)mutate((d,log)=>{d.adjustments.push({empId:emp,month,type:'bonus',amount:amt,note:'Manual bonus'});log('adjust','payroll',`${emp} bonus ${amt}. Regenerate the draft to apply.`)})}
const mine=db.runs.filter(r=>r.status!=='draft').map(r=>({r,i:r.items.find(i=>i.empId===user.empId)})).filter(x=>x.i)
const emp=id=>db.employees.find(e=>e.id===id)
return <div className="space-y-4"><h1 className="text-xl font-bold">Payroll & payslips</h1>
{manage&&<div className="card flex flex-wrap items-center gap-2"><input type="month" className="input !w-44" value={month} onChange={e=>setMonth(e.target.value)}/>
<button className="btn" disabled={run&&run.status!=='draft'} onClick={generate}>{run?'Regenerate draft':'Generate payroll'}</button><button className="btn-ghost" onClick={addBonus}>Add bonus</button>
{run?.status==='draft'&&<button className="btn-ghost" onClick={()=>step('approved')}>Approve</button>}{run?.status==='approved'&&<button className="btn-ghost" onClick={()=>step('locked')}>Lock</button>}
{run&&<span className="badge bg-brand-soft text-brand-dark">{run.status}</span>}</div>}
{manage&&run&&<div className="card overflow-x-auto !p-0"><table className="w-full"><thead><tr>{['Employee','Absent days','Gross','Allowances','Deductions','Loss of pay','Net pay',''].map(h=><th key={h} className="th">{h}</th>)}</tr></thead><tbody>
{run.items.map(i=><tr key={i.empId}><td className="td">{emp(i.empId).name}</td><td className="td">{i.absent}</td><td className="td">{inr(i.gross)}</td><td className="td">{inr(i.allowances)}</td><td className="td">{inr(i.totalDeductions)}</td><td className="td">{inr(i.lop)}</td><td className="td font-semibold">{inr(i.net)}</td><td className="td"><button className="btn-ghost !py-1" onClick={()=>setSlip({i,month:run.month})}>Payslip</button></td></tr>)}</tbody></table></div>}
{manage&&!run&&<div className="card text-sm text-slate-500">No payroll run exists for {month}. Choose Generate payroll to create a draft for all active employees.</div>}
{!manage&&<div className="card"><div className="mb-2 font-semibold">My payslips</div>{mine.map(({r,i})=><div key={r.id} className="flex items-center justify-between border-t border-slate-100 py-2 text-sm dark:border-slate-700"><span>{r.month} — net {inr(i.net)}</span><button className="btn-ghost !py-1" onClick={()=>setSlip({i,month:r.month})}>View</button></div>)}{!mine.length&&<p className="text-sm text-slate-500">Payslips appear here once payroll is approved.</p>}</div>}
{slip&&<div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4"><div className="max-h-full w-full max-w-lg overflow-auto rounded-lg bg-white p-5 text-slate-800">
<div id="payslip" className="space-y-3"><div className="border-b pb-2"><div className="text-lg font-bold">{db.settings.company.name}</div><div className="text-xs">{db.settings.company.address}</div><div className="mt-1 font-semibold">Payslip for {slip.month}</div></div>
<div className="text-sm">{emp(slip.i.empId).name} · {emp(slip.i.empId).empId} · {emp(slip.i.empId).designation}<br/>Bank: {emp(slip.i.empId).bank?.account||'—'}</div>
<table className="w-full text-sm"><tbody>{[['Gross salary',slip.i.gross],['Allowances',slip.i.allowances],['Bonus',slip.i.bonus],['Provident fund',-slip.i.pf],['ESI',-slip.i.esi],['Professional tax',-slip.i.pt],['Other deductions',-slip.i.other],['Loss of pay',-slip.i.lop]].map(([k,v])=><tr key={k}><td className="py-0.5">{k}</td><td className="text-right">{inr(v)}</td></tr>)}
<tr className="border-t font-bold"><td className="pt-1">Net pay</td><td className="pt-1 text-right">{inr(slip.i.net)}</td></tr></tbody></table>
<div className="text-xs text-slate-600">Attendance: {slip.i.presentDays} present, {slip.i.absent} absent, {slip.i.workingDays} working days</div></div>
<div className="mt-4 flex gap-2"><button className="btn" onClick={()=>window.print()}>Print or save as PDF</button><button className="btn-ghost !text-slate-800" onClick={()=>setSlip(null)}>Close</button></div></div></div>}</div>}
