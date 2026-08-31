export const zoneFromDistance=(d:number):"city"|"region"|"national"=> d<=8?"city":d<=50?"region":"national";
export const isLocal=(d:number)=> zoneFromDistance(d)==="city";
export const isRegional=(d:number)=> zoneFromDistance(d)==="region";
export const isNational=(d:number)=> zoneFromDistance(d)==="national";
export const calcZoneMultiplier=(z:string)=> z==="city"?1:z==="region"?1.5:2.2;
