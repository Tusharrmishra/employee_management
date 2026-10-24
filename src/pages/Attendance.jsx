import {useRef,useState} from 'react';import {useStore} from '../context/Store';import {TODAY,MONTH} from '../data/mock';import {checkGeofence} from '../lib/geofence'
const color={present:'bg-green-100 text-green-800',absent:'bg-red-100 text-red-800',half_day:'bg-amber-100 text-amber-800',leave:'bg-blue-100 text-blue-800',weekly_off:'bg-slate-200 text-slate-600',holiday:'bg-purple-100 text-purple-800'}
function Punch(){const {db,mutate,user}=useStore();const vid=useRef(),[shot,setShot]=useState(null),[pos,setPos]=useState(null),[msg,setMsg]=useState('')
const emp=db.employees.find(e=>e.id===user.empId),site=db.sites.find(s=>s.id===emp?.siteId),rec=db.attendance.find(a=>a.empId===emp?.id&&a.date===TODAY)
if(!emp)return <div className="card">Punching is available for employee accounts only. Sign in as an employee or manager.</div>
const cam=async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}});vid.current.srcObject=s;vid.current.play()}catch{setMsg('Camera access was blocked. Allow camera permission, or use the demo selfie.')}}
const snap=()=>{const v=vid.current,c=document.createElement('canvas');c.width=v.videoWidth||320;c.height=v.videoHeight||240;c.getContext('2d').drawImage(v,0,0);setShot(c.toDataURL('image/jpeg',.6))}
const gps=()=>navigator.geolocation?.getCurrentPosition(p=>setPos({lat:p.coords.latitude,lng:p.coords.longitude}),()=>setMsg('Location access was blocked. Allow location, or use a demo location.'))
const demo=out=>setPos({lat:site.lat+(out?0.01:0.0002),lng:site.lng})
const punch=type=>{if(!shot||!pos)return setMsg('Take a selfie and capture your location first.')
const g=checkGeofence(pos,site),t=new Date().toTimeString().slice(0,5)
mutate((d,log)=>{let r=d.attendance.find(a=>a.empId===emp.id&&a.date===TODAY)
if(!r){r={id:`${emp.id}-${TODAY}`,empId:emp.id,date:TODAY,status:'absent',flags:[],checkIn:null,checkOut:null,workedMinutes:0};d.attendance.push(r)}
const p={time:t,lat:pos.lat,lng:pos.lng,selfie:shot,distance:g.distance,outOfRange:g.outOfRange}
if(type==='in'){r.checkIn=p;r.status='present'}else{r.checkOut=p;const[a,b]=r.checkIn.time.split(':'),[c,e]=t.split(':');r.workedMinutes=(+c*60+ +e)-(+a*60+ +b)}
if(g.outOfRange&&!r.flags.includes('out_of_range'))r.flags.push('out_of_range');log('punch','attendance',`${emp.empId} check-${type} ${g.distance}m from ${site.name}`)})
setMsg(g.outOfRange?`Punch saved and flagged: you are ${g.distance} m from ${site.name} (limit ${site.radius} m).`:`Punch saved. You are ${g.distance} m from ${site.name}.`);setShot(null)}
return <div className="card space-y-3"><div className="font-semibold">Check in or out — {site.name}</div>
<div className="grid gap-3 md:grid-cols-2"><div><video ref={vid} muted playsInline className="aspect-video w-full rounded bg-slate-200 dark:bg-slate-700"/>
<div className="mt-2 flex flex-wrap gap-2"><button className="btn-ghost" onClick={cam}>Start camera</button><button className="btn-ghost" onClick={snap}>Take selfie</button><button className="btn-ghost" onClick={()=>setShot('demo')}>Use demo selfie</button></div></div>
<div className="space-y-2 text-sm"><div>Selfie: {shot?'captured':'not taken'}</div><div>Location: {pos?`${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`:'not captured'}</div>
<div className="flex flex-wrap gap-2"><button className="btn-ghost" onClick={gps}>Get my location</button><button className="btn-ghost" onClick={()=>demo(false)}>Demo: at site</button><button className="btn-ghost" onClick={()=>demo(true)}>Demo: away</button></div>
<div className="flex gap-2"><button className="btn" disabled={!!rec?.checkIn} onClick={()=>punch('in')}>Check in</button><button className="btn" disabled={!rec?.checkIn||!!rec?.checkOut} onClick={()=>punch('out')}>Check out</button></div>
{msg&&<p className="text-brand-dark dark:text-brand-soft">{msg}</p>}</div></div></div>}
export default function Attendance(){const {db,mutate,user}=useStore();const [view,setView]=useState(user.role==='employee'?'me':'site'),[site,setSite]=useState('s1'),[date,setDate]=useState(TODAY)
const staff=user.role!=='employee',emp=db.employees.find(e=>e.id===user.empId)
const regularize=a=>{const status=prompt('New status (present, absent, half_day, leave, holiday, weekly_off):',a.status);if(!status||!color[status])return
const reason=prompt('Reason for this correction (required):');if(!reason)return
mutate((d,log)=>{const r=d.attendance.find(x=>x.id===a.id);log('regularize','attendance',`${r.empId} ${r.date}: ${r.status} → ${status}. Reason: ${reason}`);r.status=status;r.flags=r.flags.filter(f=>f!=='out_of_range')})}
const mine=db.attendance.filter(a=>a.empId===emp?.id&&a.date.startsWith(MONTH))
const daily=db.attendance.filter(a=>a.date===date&&db.employees.find(e=>e.id===a.empId)?.siteId===site&&(user.role!=='manager'||db.employees.find(e=>e.id===a.empId)?.managerId===user.empId))
return <div className="space-y-4"><h1 className="text-xl font-bold">Attendance</h1><Punch/>
<div className="flex gap-2">{emp&&<button className={view==='me'?'btn':'btn-ghost'} onClick={()=>setView('me')}>My history</button>}{staff&&<button className={view==='site'?'btn':'btn-ghost'} onClick={()=>setView('site')}>Site daily view</button>}</div>
{view==='me'&&<div className="card"><div className="mb-2 font-semibold">{MONTH} calendar</div><div className="grid grid-cols-7 gap-1 text-center text-xs">{['S','M','T','W','T','F','S'].map((d,i)=><div key={i} className="text-slate-500">{d}</div>)}
{Array.from({length:new Date(2026,9,1).getDay()}).map((_,i)=><div key={'b'+i}/>)}
{Array.from({length:31},(_,i)=>{const dt=`${MONTH}-${String(i+1).padStart(2,'0')}`,a=mine.find(m=>m.date===dt);return <div key={i} title={a?.status} className={`rounded p-2 ${a?color[a.status]:'bg-slate-50 dark:bg-slate-900'}`}>{i+1}</div>})}</div></div>}
{view==='site'&&staff&&<div className="card space-y-2"><div className="flex flex-wrap gap-2"><select className="input !w-40" value={site} onChange={e=>setSite(e.target.value)}>{db.sites.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select><input type="date" className="input !w-44" value={date} onChange={e=>setDate(e.target.value)}/></div>
<div className="overflow-x-auto"><table className="w-full"><thead><tr>{['Employee','Status','In','Out','Flags',''].map(h=><th key={h} className="th">{h}</th>)}</tr></thead><tbody>
{daily.map(a=><tr key={a.id}><td className="td">{db.employees.find(e=>e.id===a.empId).name}</td><td className="td"><span className={`badge ${color[a.status]}`}>{a.status.replace('_',' ')}</span></td><td className="td">{a.checkIn?.time||'—'}</td><td className="td">{a.checkOut?.time||'—'}</td>
<td className="td">{a.flags.map(f=><span key={f} className="badge bg-red-100 text-red-800">{f.replace('_',' ')}</span>)}</td><td className="td"><button className="btn-ghost !py-1" onClick={()=>regularize(a)}>Regularize</button></td></tr>)}
{!daily.length&&<tr><td className="td" colSpan={6}>No attendance records for this site and date.</td></tr>}</tbody></table></div></div>}</div>}
