// Keep assistant output readable aloud even if a provider ignores the prompt.
export function plainReply(value){
  return String(value??'')
    .replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g,'$1')
    .replace(/^\s{0,3}#{1,6}\s*/gm,'')
    .replace(/^\s*(?:[-*•●▪]\s+|\d+[.)]\s+)/gm,'')
    .replace(/[*`#•●▪◆►➤]/g,'')
    .replace(/(?<!\w)_{1,2}|_{1,2}(?!\w)/g,'')
    .replace(/\p{Extended_Pictographic}/gu,'')
    .replace(/[–—]/g,'-')
    .replace(/([.!?])?\s*\n+\s*/g,(_,end)=>end?`${end} `:'. ')
    .replace(/^\.\s*/,'')
    .replace(/\s{2,}/g,' ')
    .trim();
}
