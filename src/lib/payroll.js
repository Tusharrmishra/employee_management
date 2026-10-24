export const r2=n=>Math.round((n+Number.EPSILON)*100)/100
export function calcPayroll({gross,allowances=0,overtime=0,bonus=0,deductions=0,absentDays=0,unpaidLeaveDays=0,workingDays,rules={}}){
const perDay=r2(gross/workingDays),lop=r2((absentDays+unpaidLeaveDays)*perDay)
const pf=rules.pf?.enabled?r2(Math.min(gross,rules.pf.ceiling||Infinity)*rules.pf.rate/100):0
const esi=rules.esi?.enabled&&gross<=rules.esi.ceiling?r2(gross*rules.esi.rate/100):0
const slab=(rules.pt?.slabs||[]).find(s=>gross>=s.from&&gross<=s.to);const pt=slab?slab.amount:0
const totalDeductions=r2(deductions+pf+esi+pt)
const net=r2(gross+allowances+overtime+bonus-totalDeductions-lop)
return{perDay,lop,pf,esi,pt,totalDeductions,net}}
