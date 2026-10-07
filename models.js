// Public model metadata is derived from server-side configuration. Never expose keys.
const specs = [
  {provider:'gemini',name:'Gemini',key:'GEMINI_API_KEY',model:'GEMINI_MODEL',fallback:'gemini-2.5-flash',limit:'GEMINI_RPD_LIMIT',color:'#8C8BFF',info:'Google Gemini · Cloud-Modell'},
  {provider:'groq',name:'Groq',key:'GROQ_API_KEY',model:'GROQ_MODEL',fallback:'openai/gpt-oss-120b',limit:'GROQ_RPD_LIMIT',color:'#F28A60',info:'Groq Cloud · Modell laut Konfiguration'}
];
export function availableModels(){
  return specs.filter(x=>Boolean(process.env[x.key])).map(x=>({
    id:x.provider,name:x.name,provider:x.provider,model:process.env[x.model]||x.fallback,
    totalLimit:process.env[x.limit]||null,limitUnit:'Anfragen pro Tag',color:x.color,info:x.info
  }));
}
export function resolveModel(id){
  const models=availableModels();
  return models.find(x=>x.id===id)||(!id?models[0]:null);
}
