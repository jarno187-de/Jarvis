const JarvisMotion=(()=>{
  const overlay=document.getElementById('model-summon');
  const canvas=document.getElementById('summon-particles');
  const ctx=canvas.getContext('2d');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let generation=0,frameId=0,closeTimer=0;
  const easeOut=t=>1-Math.pow(1-t,3);
  const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
  function rgb(value){let hex=value;if(!/^#[0-9a-f]{6}$/i.test(hex))hex=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#A78BFA';return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));}
  function stop(){generation++;cancelAnimationFrame(frameId);clearTimeout(closeTimer);ctx.clearRect(0,0,canvas.width,canvas.height);overlay.classList.remove('active');document.body.classList.remove('model-summoning');}
  function summon({label,color}){
    stop();if(reduced.matches)return;
    const token=++generation,shade=rgb(color),accent=`rgb(${shade.join(' ')})`;
    const scale=Math.min(devicePixelRatio||1,1.6),width=innerWidth,height=innerHeight;
    canvas.width=Math.round(width*scale);canvas.height=Math.round(height*scale);ctx.setTransform(scale,0,0,scale,0,0);
    overlay.style.setProperty('--summon-color',accent);
    document.body.style.setProperty('--summon-accent',accent);
    document.getElementById('summon-name').textContent=label;
    document.body.classList.add('model-summoning');
    void overlay.offsetWidth;overlay.classList.add('active');
    const count=width<680?88:150,cx=width/2,cy=height/2,start=performance.now();
    const sparks=Array.from({length:count},(_,i)=>({angle:i*2.399963+Math.random()*.45,distance:Math.max(width,height)*(.36+Math.random()*.48),orbit:65+Math.random()*175,size:.65+Math.random()*1.75,delay:Math.random()*.15,turn:(Math.random()-.5)*2.2,kind:i%7===0?'streak':'point'}));
    function draw(now){
      if(token!==generation)return;
      const t=clamp((now-start)/2200);ctx.clearRect(0,0,width,height);ctx.globalCompositeOperation='lighter';
      for(const p of sparks){
        const u=clamp((t-p.delay)/(1-p.delay));if(!u)continue;
        let radius,alpha;
        if(u<.36){const k=easeOut(u/.36);radius=p.distance+(p.orbit-p.distance)*k;alpha=Math.sin(k*Math.PI*.72)*.74;}
        else if(u<.72){const k=(u-.36)/.36;radius=p.orbit+Math.sin(k*Math.PI*2+p.angle)*10;alpha=.7+Math.sin(k*Math.PI)*.22;}
        else{const k=easeOut((u-.72)/.28);radius=p.orbit+(p.distance*.9-p.orbit)*k;alpha=(1-k)*.8;}
        const angle=p.angle+u*(2.2+p.turn),x=cx+Math.cos(angle)*radius,y=cy+Math.sin(angle)*radius*.68;
        if(p.kind==='streak'){const length=10+22*(1-Math.abs(.52-u));ctx.strokeStyle=`rgba(${shade.join(',')},${alpha*.75})`;ctx.lineWidth=p.size*.75;ctx.beginPath();ctx.moveTo(x-Math.cos(angle+.7)*length,y-Math.sin(angle+.7)*length*.68);ctx.lineTo(x,y);ctx.stroke();}
        else{ctx.fillStyle=`rgba(${shade.join(',')},${alpha})`;ctx.beginPath();ctx.arc(x,y,p.size*(u>.72?1.25:1),0,Math.PI*2);ctx.fill();}
      }
      ctx.globalCompositeOperation='source-over';
      if(t<1)frameId=requestAnimationFrame(draw);else ctx.clearRect(0,0,width,height);
    }
    frameId=requestAnimationFrame(draw);
    closeTimer=setTimeout(()=>{if(token===generation)stop();},2230);
  }
  reduced.addEventListener?.('change',()=>{if(reduced.matches)stop();});
  return {summon,stop};
})();
