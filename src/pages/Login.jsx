import {useState} from 'react';import {useStore} from '../context/Store'
export default function Login(){const {login}=useStore();const [email,setEmail]=useState('admin@demo.com'),[pw,setPw]=useState('demo123'),[err,setErr]=useState('')
return <div className="flex min-h-screen items-center justify-center p-4"><form className="card w-full max-w-sm space-y-3" onSubmit={e=>{e.preventDefault();setErr(login(email,pw)?'':'Email or password is incorrect.')}}>
<h1 className="text-xl font-bold text-brand">Sign in</h1>
<input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"/>
<input className="input" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password"/>
{err&&<p className="text-sm text-red-600">{err}</p>}<button className="btn w-full">Sign in</button>
<div className="text-xs text-slate-500">Demo logins (password demo123):<div className="mt-1 flex flex-wrap gap-1">
{['admin','hr','manager','employee'].map(r=><button type="button" key={r} className="btn-ghost !py-1 text-xs" onClick={()=>setEmail(`${r}@demo.com`)}>{r}</button>)}</div></div></form></div>}
