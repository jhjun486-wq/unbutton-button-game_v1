import { getStore } from "@netlify/blobs";

const json = (body, status=200) => new Response(JSON.stringify(body), {status, headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});

export default async (req) => {
  if (req.method !== "POST") return json({error:"Method not allowed"},405);
  try {
    const body = await req.json();
    const nickname = String(body.nickname||"").trim().slice(0,12);
    const phone = String(body.phone||"").trim();
    const seconds = Number(body.seconds);
    const consent = body.consent === true;
    if (!nickname || !/^01[0-9]-\d{3,4}-\d{4}$/.test(phone) || !Number.isFinite(seconds) || seconds <= 0 || seconds > 600 || !consent)
      return json({error:"입력값을 확인해주세요."},400);
    const store = getStore({name:"unbutton-scores", consistency:"strong"});
    const id = `${Date.now()}-${crypto.randomUUID()}`;
    await store.setJSON(id,{id,nickname,phone,seconds,consentAt:new Date().toISOString()});
    return json({ok:true});
  } catch(e) { return json({error:"기록 저장 중 오류가 발생했습니다."},500); }
};