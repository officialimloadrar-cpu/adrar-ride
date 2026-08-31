type Job={id:string,action:()=>Promise<void>,retries:number};
export class OfflineQueue{
  private q:Job[]=[];
  private running=false;
  enqueue(action:()=>Promise<void>){
    const job:Job={id:crypto.randomUUID(),action,retries:0};
    this.q.push(job);
    this.process();
  }
  private async process(){
    if(this.running) return;
    this.running=true;
    while(this.q.length){
      const job=this.q[0];
      try{
        if(!navigator.onLine) throw new Error("offline");
        await job.action();
        this.q.shift();
      }catch{
        job.retries++;
        if(job.retries>5) this.q.shift();
        else await new Promise(r=>setTimeout(r,1000*Math.pow(2,job.retries)));
      }
    }
    this.running=false;
  }
  get pending(){return this.q.length;}
}
export const offlineQueue=new OfflineQueue();
