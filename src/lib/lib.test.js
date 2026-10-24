import {describe,it,expect} from 'vitest'
import {calcPayroll} from './payroll';import {checkGeofence} from './geofence'
describe('payroll',()=>{it('applies LOP and no statutory deductions',()=>{
const r=calcPayroll({gross:26000,allowances:2000,bonus:500,absentDays:2,unpaidLeaveDays:1,workingDays:26})
expect(r.perDay).toBe(1000);expect(r.lop).toBe(3000);expect(r.net).toBe(25500)})})
describe('geofence',()=>{const site={lat:19.0596,lng:72.8656,radius:150}
it('inside',()=>expect(checkGeofence({lat:19.0597,lng:72.8657},site).outOfRange).toBe(false))
it('outside',()=>expect(checkGeofence({lat:19.07,lng:72.88},site).outOfRange).toBe(true))})
