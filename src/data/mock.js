const Y=2026,M=10,pad=n=>String(n).padStart(2,'0'),ds=d=>`${Y}-${pad(M)}-${pad(d)}`
export const TODAY=ds(19),MONTH=`${Y}-${pad(M)}`
const sites=[{id:'s1',name:'Mumbai HQ',address:'BKC, Mumbai',lat:19.0596,lng:72.8656,radius:150},
{id:'s2',name:'Pune Branch',address:'Hinjewadi, Pune',lat:18.5912,lng:73.7389,radius:200}]
const departments=[{id:'d1',name:'Engineering'},{id:'d2',name:'Operations'},{id:'d3',name:'Sales'}]
const names=['Aarav Mehta','Priya Nair','Rohan Shah','Sneha Kulkarni','Vikram Singh','Anjali Rao','Karan Patel','Meera Iyer','Arjun Desai','Kavya Reddy','Imran Khan','Neha Joshi','Sanjay Verma','Divya Menon','Rahul Bose']
const employees=names.map((name,i)=>({id:`e${i+1}`,empId:`EMP-${String(i+1).padStart(4,'0')}`,name,email:`${name.split(' ')[0].toLowerCase()}@demo.com`,
phone:`98200${10000+i*37}`,designation:['Developer','Analyst','Executive','Lead'][i%4],deptId:`d${i%3+1}`,siteId:`s${i%2+1}`,
managerId:i<3?null:'e2',joining:`2024-0${i%9+1}-10`,status:i===14?'inactive':'active',
bank:{holder:name,account:`XXXXXX${1000+i}`,ifsc:'HDFC0001234'},
salary:{type:'monthly',gross:30000+i*2500,allowances:3000,deductions:500,otRate:150}}))
const users=[{email:'admin@demo.com',name:'Admin User',role:'admin',empId:null},
{email:'hr@demo.com',name:'Riya HR',role:'hr',empId:'e1'},
{email:'manager@demo.com',name:'Priya Nair',role:'manager',empId:'e2'},
{email:'employee@demo.com',name:'Karan Patel',role:'employee',empId:'e7'}]
const attendance=[]
employees.forEach((e,i)=>{for(let d=1;d<=19;d++){const dow=new Date(Y,M-1,d).getDay()
let status=dow===0?'weekly_off':(d*7+i*3)%11===0?'absent':(d*5+i)%13===0?'half_day':'present'
if(d===19)status='absent'
attendance.push({id:`${e.id}-${d}`,empId:e.id,date:ds(d),status,flags:[],
checkIn:status==='present'||status==='half_day'?{time:'09:'+pad((i*4+d)%30),outOfRange:false}:null,
checkOut:status==='present'?{time:'18:'+pad((i+d)%40)}:null,workedMinutes:status==='present'?540:status==='half_day'?240:0})}})
export const seed={sites,departments,employees,users,attendance,
leaveTypes:[{id:'l1',name:'Casual Leave',quota:12,paid:true,carry:false},{id:'l2',name:'Sick Leave',quota:8,paid:true,carry:false},{id:'l3',name:'Earned Leave',quota:15,paid:true,carry:true},{id:'l4',name:'Loss of Pay',quota:0,paid:false,carry:false}],
leaves:[{id:'r1',empId:'e7',typeId:'l1',from:ds(22),to:ds(23),days:2,reason:'Family function',status:'pending'},
{id:'r2',empId:'e4',typeId:'l2',from:ds(14),to:ds(14),days:1,reason:'Fever',status:'approved'}],
holidays:[{id:'h1',date:'2026-10-20',name:'Diwali Holiday'},{id:'h2',date:'2026-12-25',name:'Christmas'}],
settings:{company:{name:'Staffroll Pvt Ltd',address:'BKC, Mumbai 400051'},workingDays:26,
rules:{pf:{enabled:true,rate:12,ceiling:15000},esi:{enabled:true,rate:0.75,ceiling:21000},pt:{slabs:[{from:0,to:7500,amount:0},{from:7501,to:10000,amount:175},{from:10001,to:1e9,amount:200}]}}},
runs:[],audit:[],adjustments:[]}
