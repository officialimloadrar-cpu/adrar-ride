type Point = {lat:number,lon:number};
export const distance = (a:Point,b:Point) => {
  const R=6371, dLat=(b.lat-a.lat)*Math.PI/180, dLon=(b.lon-a.lon)*Math.PI/180;
  const s=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s));
};
export const optimizeRoute = (points:Point[]) => {
  if (points.length<=2) return points;
  const unvisited = points.slice(1);
  const route:Point[] = [points[0]];
  let current = points[0];
  while (unvisited.length){
    let idx=0, min=Infinity;
    for (let i=0;i<unvisited.length;i++){ const d=distance(current,unvisited[i]); if(d<min){min=d; idx=i;} }
    current=unvisited[idx]; route.push(current); unvisited.splice(idx,1);
  }
  return route;
};
export const calcTotalDistance = (route:Point[]) => route.reduce((s,_,i)=> i===0?0:s+distance(route[i-1],route[i]),0);
export const batchOrders = (orders:{id:string,point:Point}[], maxDist=20) => {
  const groups:any[][]=[]; const used=new Set<string>();
  for (const o of orders){ if(used.has(o.id)) continue; const g=[o]; used.add(o.id); for(const o2 of orders){ if(used.has(o2.id)) continue; if(distance(o.point,o2.point)<=maxDist) {g.push(o2); used.add(o2.id);} } groups.push(g); }
  return groups;
};
