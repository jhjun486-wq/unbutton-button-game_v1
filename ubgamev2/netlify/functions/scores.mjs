import { getStore } from "@netlify/blobs";
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
export default async (req)=>{
 try{
  const store=getStore({name:"unbutton-scores",consistency:"strong"}); const {blobs}=await store.list(); const scores=[];
  for(const b of blobs){const x=await store.get(b.key,{type:"json"});if(x)scores.push({nickname:x.nickname,seconds:x.seconds});}
  scores.sort((a,b)=>a.seconds-b.seconds);
  return json({scores:scores.slice(0,10)});
 }catch(e){return json({error:"기록을 불러오지 못했습니다."},500)}
};