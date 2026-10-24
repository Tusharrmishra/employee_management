import {LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,PieChart,Pie,Cell} from 'recharts'
import {useStore} from '../context/Store';import {TODAY,MONTH} from '../data/mock'
const Stat=({l,v})=><div className="card"><div className="text-2xl font-bold">{v}</div><div className="text-sm text-slate-500">{l}</div></div>
export default function Dashboard(){const {db,user}=useStore()
const me=db.employees.find(e=>e.id===user.empId)
const scope=user.role==='manager'?db.employees.filter(e=>e.managerId===me.id):user.role==='employee'?[me]:db.employees
const ids=scope.map(e=>e.id),today=db.attendance.filter(a=>a.date===TODAY&&ids.includes(a.empId))
const pending=db.leaves.filter(l=>l.status==='pending'&&(user.role==='employee'?l.empId===me.id:user.role==='manager'?ids.includes(l.empId):true))
const dept=db.departments.map(d=>({name:d.name,value:db.employees.filter(e=>e.deptId===d.id&&e.status==='active').length}))
const trend=['May','Jun','Jul','Aug','Sep','Oct'].map((m,i)=>({m,cost:Math.round(db.employees.reduce((s,e)=>s+e.salary.gross,0)*(0.9+i*0.02))}))
const mine=db.attendance.filter(a=>a.empId===me?.id&&a.date.startsWith(MONTH))
const bal=db.leaveTypes.filter(t=>t.quota).map(t=>({n:t.name,left:t.quota-db.leaves.filter(l=>l.empId===me?.id&&l.typeId===t.id&&l.status==='approved').reduce((s,l)=>s+l.days,0)}))
const run=db.runs.at(-1),slip=run?.items.find(i=>i.empId===me?.id)
if(user.role==='employee')return <div className="space-y-4"><h1 className="text-xl font-bold">Hello, {user.name}</h1>
<div className="grid grid-cols-2 gap-3 md:grid-cols-5"><Stat l="Days present (month)" v={mine.filter(a=>a.status==='present').length}/><Stat l="Days absent" v={mine.filter(a=>a.status==='absent').length}/>
{bal.map(b=><Stat key={b.n} l={`${b.n} left`} v={b.left}/>)}</div>
<div className="card">Latest payslip: {slip?`${run.month} — net ₹${slip.net.toLocaleString('en-IN')}`:'No payroll has been run yet.'}</div></div>
return <div className="space-y-4"><h1 className="text-xl font-bold">{user.role==='manager'?'Team overview':'Overview'}</h1>
<div className="grid grid-cols-2 gap-3 md:grid-cols-5"><Stat l="Headcount" v={scope.filter(e=>e.status==='active').length}/>
<Stat l="Present today" v={today.filter(a=>a.status==='present').length}/><Stat l="Absent today" v={today.filter(a=>a.status==='absent').length}/>
<Stat l="On leave" v={today.filter(a=>a.status==='leave').length}/><Stat l="Pending approvals" v={pending.length}/></div>
{user.role!=='manager'&&<div className="grid gap-4 md:grid-cols-2">
<div className="card"><div className="mb-2 font-semibold">Payroll cost trend (₹)</div><ResponsiveContainer height={220}><LineChart data={trend}><XAxis dataKey="m"/><YAxis width={60}/><Tooltip/><Line dataKey="cost" stroke="#0f766e" strokeWidth={2}/></LineChart></ResponsiveContainer></div>
<div className="card"><div className="mb-2 font-semibold">Department split</div><ResponsiveContainer height={220}><PieChart><Pie data={dept} dataKey="value" nameKey="name" label>{dept.map((_,i)=><Cell key={i} fill={['#0f766e','#d97706','#4f46e5'][i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div></div>}</div>}
