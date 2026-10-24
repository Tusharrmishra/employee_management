import {useState} from 'react';import {NavLink} from 'react-router-dom';import {useStore} from '../context/Store';import {NAV} from '../App'
export default function Layout({children}){const {user,logout,dark,setDark,db}=useStore();const [open,setOpen]=useState(false)
return <div className="min-h-screen md:flex">
<aside className={`fixed inset-y-0 left-0 z-20 w-60 border-r border-slate-200 bg-white p-4 transition-transform dark:border-slate-700 dark:bg-slate-800 md:static md:translate-x-0 ${open?'':'-translate-x-full'}`}>
<div className="mb-6 text-lg font-bold text-brand">{db.settings.company.name}</div>
<nav className="space-y-1">{NAV.filter(n=>n[2].includes(user.role)).map(([to,label])=>
<NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)} className={({isActive})=>`block rounded-md px-3 py-2 text-sm ${isActive?'bg-brand text-white':'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>{label}</NavLink>)}</nav></aside>
<div className="flex-1 min-w-0"><header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
<button className="btn-ghost md:hidden" onClick={()=>setOpen(!open)}>Menu</button><div className="hidden md:block"/>
<div className="flex items-center gap-2"><span className="text-sm">{user.name} <span className="badge bg-brand-soft text-brand-dark">{user.role}</span></span>
<button className="btn-ghost" onClick={()=>setDark(!dark)}>{dark?'Light':'Dark'}</button><button className="btn-ghost" onClick={logout}>Sign out</button></div></header>
<main className="p-4 md:p-6">{children}</main></div></div>}
