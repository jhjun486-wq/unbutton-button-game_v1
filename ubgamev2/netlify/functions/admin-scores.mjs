import { getStore } from "@netlify/blobs";
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
export default async (req)=>{
 const auth=req.headers.get("authorization")||""; const key=auth.startsWith("Bearer ")?auth.slice(7):"";
 if(!process.env.ADMIN_KEY || key!==process.env.ADMIN_KEY)return json({error:"관리자 인증이 필요합니다."},401);
 try{
  const store=getStore({name:"unbutton-scores",consistency:"strong"});const {blobs}=await store.list();const scores=[];
  for(const b of blobs){const x=await store.get(b.key,{type:"json"});if(x)scores.push(x)}
  scores.sort((a,b)=>a.seconds-b.seconds);return json({scores});
 }catch(e){return json({error:"기록을 불러오지 못했습니다."},500)}
};