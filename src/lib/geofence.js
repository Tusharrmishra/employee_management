export function distanceMeters(a,b,c,d){const R=6371000,t=x=>x*Math.PI/180,
h=Math.sin(t(c-a)/2)**2+Math.cos(t(a))*Math.cos(t(c))*Math.sin(t(d-b)/2)**2
return 2*R*Math.asin(Math.sqrt(h))}
export function checkGeofence(pos,site){const distance=Math.round(distanceMeters(pos.lat,pos.lng,site.lat,site.lng))
return{distance,outOfRange:distance>site.radius}}
