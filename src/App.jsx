import {Routes,Route,Navigate} from 'react-router-dom'
import {useStore} from './context/Store'
import Layout from './components/Layout'
import Login from './pages/Login';import Dashboard from './pages/Dashboard';import Employees from './pages/Employees'
import Attendance from './pages/Attendance';import Leave from './pages/Leave';import Payroll from './pages/Payroll'
import Organization from './pages/Organization';import Audit from './pages/Audit';import Settings from './pages/Settings'
const A=['admin'],AH=['admin','hr'],AHM=['admin','hr','manager'],ALL=['admin','hr','manager','employee']
export const NAV=[['/','Dashboard',ALL],['/attendance','Attendance',ALL],['/leave','Leave',ALL],['/employees','Employees',AHM],
['/organization','Organization',AH],['/payroll','Payroll & payslips',ALL],['/audit','Audit log',AH],['/settings','Settings',A]]
const Guard=({roles,children})=>{const {user}=useStore();return roles.includes(user.role)?children:<Navigate to="/" replace/>}
export default function App(){const {user}=useStore()
if(!user)return <Login/>
const R=(path,el)=>{const roles=NAV.find(n=>n[0]===path)[2];return <Route path={path} element={<Guard roles={roles}>{el}</Guard>}/>}
return <Layout><Routes>{R('/',<Dashboard/>)}{R('/attendance',<Attendance/>)}{R('/leave',<Leave/>)}{R('/employees',<Employees/>)}
{R('/organization',<Organization/>)}{R('/payroll',<Payroll/>)}{R('/audit',<Audit/>)}{R('/settings',<Settings/>)}
<Route path="*" element={<Navigate to="/"/>}/></Routes></Layout>}
