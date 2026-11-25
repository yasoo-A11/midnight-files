'use strict';
const SH={glow:'rgba(0,0,0,.85)',blur:26};
function wipe(x,y,w,h,p,fn){if(p<=0)return;ctx.save();ctx.beginPath();ctx.rect(x,y,w*p,h);ctx.clip();fn();ctx.restore();}
function card(x,y,w,h,rot,a,fn){if(a<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);A(a);ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=34;ctx.shadowOffsetY=14;
  const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#F7F0DE');g.addColorStop(1,'#E2D6B9');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;fn();ctx.restore();}
function stamp(cx,cy,rot,w,h,p,lines,col=C.deep,back=null){if(p<=0)return;const s=1+1.4*(1-E.o5(p));ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.scale(s,s);
  if(back){A(Math.min(1,p*3));ctx.fillStyle=back;ctx.fillRect(-w/2,-h/2,w,h);}A(Math.min(1,p*3)*.93);ctx.strokeStyle=col;ctx.lineJoin='miter';ctx.lineWidth=10;ctx.strokeRect(-w/2,-h/2,w,h);ctx.lineWidth=3;ctx.strokeRect(-w/2+17,-h/2+17,w-34,h-34);
  for(const l of lines)txt(l[0],0,l[1],{font:l[2],align:'center',base:'middle',fill:col,ls:l[3]||0});ctx.restore();}
const CITY=buildCity();
let TNOW=0;
function skyline(base,sy,lit,a,glows){ctx.save();ctx.translate(0,base);ctx.scale(1,sy);
  for(const [rgb,ga] of (glows||[])){if(ga<=0)continue;A(a);const g=ctx.createLinearGradient(0,-900,0,0);g.addColorStop(0,`rgba(${rgb},0)`);g.addColorStop(.55,`rgba(${rgb},${ga*.35})`);g.addColorStop(1,`rgba(${rgb},${ga})`);ctx.fillStyle=g;ctx.fillRect(0,-900,W,900);}
  for(const b of CITY){A(a);ctx.fillStyle=C.black;ctx.fillRect(b.x,-b.h,b.w,b.h+60);if(b.step)ctx.fillRect(b.x+b.w*.2,-b.h-26,b.w*.6,26);if(b.ant)ctx.fillRect(b.x+b.w/2-2,-b.h-(b.step?26:0)-70,4,70);
    A(a*.32);ctx.fillStyle=C.paper;ctx.fillRect(b.x,-b.h,b.w,2);
    const cols=Math.floor((b.w-14)/22),rows=Math.floor((b.h-20)/30);
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const id=b.i*1000+r*37+c;if(rnd(id*1.7)<.5)continue;
      let tw=.86+.14*Math.sin(TNOW*1.7+rnd(id*4.3)*60);const bl=rnd(id*6.1);if(bl<.07){const ph=(TNOW*.19+bl*14)%1;if(ph<.4)tw*=.12;}
      A(a*lit*(.5+.5*rnd(id*9.9))*tw);ctx.fillStyle=rnd(id*2.2)>.8?'#FFE9B8':'#FFC36B';ctx.fillRect(b.x+9+c*22,-b.h+14+r*30,11,15);}}
  ctx.restore();}
function turkey(x,y,s,t,a,tag){
  if(a<=0)return;ctx.save();A(a);ctx.translate(x,y);ctx.scale(s,s);
  const bob=Math.sin(t*5)*3,wob=Math.sin(t*3.1)*.06;
  ctx.strokeStyle=C.ink;ctx.lineWidth=3;
  for(let i=0;i<7;i++){const ang=-2.6+i*.31+wob;ctx.save();ctx.translate(-30,-120);ctx.rotate(ang);ctx.fillStyle=i%2?'#8A5A2B':'#B9783A';
    ctx.beginPath();ctx.ellipse(0,-70,26,72,0,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#F1D9A8';ctx.beginPath();ctx.ellipse(0,-128,14,10,0,0,7);ctx.fill();ctx.restore();}
  ctx.strokeStyle=C.ink;ctx.lineWidth=7;ctx.lineCap='round';
  for(const dx of[-14,16]){ctx.beginPath();ctx.moveTo(dx,-42);ctx.lineTo(dx+4,0);ctx.stroke();}
  ctx.lineWidth=3;ctx.translate(0,bob);
  ctx.fillStyle='#6B4423';ctx.beginPath();ctx.ellipse(0,-80,62,50,0,0,7);ctx.fill();ctx.stroke();
  ctx.fillStyle='#7A5030';ctx.beginPath();ctx.ellipse(46,-140,16,40,.25,0,7);ctx.fill();ctx.stroke();
  ctx.fillStyle='#E9DDC4';ctx.beginPath();ctx.ellipse(58,-178,20,18,0,0,7);ctx.fill();ctx.stroke();
  ctx.fillStyle=C.crimson;ctx.beginPath();ctx.ellipse(66,-158,7,14,.2,0,7);ctx.fill();
  ctx.fillStyle=C.amber;ctx.beginPath();ctx.moveTo(74,-182);ctx.lineTo(92,-176);ctx.lineTo(74,-170);ctx.closePath();ctx.fill();
  ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(62,-184,3.5,0,7);ctx.fill();
  if(tag){ctx.save();ctx.translate(40,-120);ctx.rotate(-.08);ctx.fillStyle='#F7F0DE';ctx.fillRect(-130,-6,260,tag.length*44+18);ctx.strokeRect(-130,-6,260,tag.length*44+18);
    tag.forEach((l,i)=>txt(l,0,30+i*44,{font:F.slab(30,800),fill:C.ink,align:'center'}));ctx.restore();}
  ctx.restore();
}
/* Why the turkey is called a turkey.  Film times = narration + 0.25 s.  53.5 s. */
HEAD.push(
  [10.9,19.8,'The 1500s','Europe'],
  [19.9,28.9,'The 1500s','Spanish ships'],
  [29.0,43.9,'Today','The same bird, everywhere']);
FLASH.push([5.5,.04,.45,'255,60,70',.45],[7.1,.05,.4,'255,200,140',.35],[11.5,.05,.45,'255,200,140',.4],[18.8,.04,.45,'255,60,70',.4],
  [26.2,.04,.4,'255,250,240',.35],[27.85,.04,.45,'255,60,70',.45],[32.4,.04,.4,'255,60,70',.35],[46.95,.05,.5,'255,60,70',.45]);
SHAKE.push([5.5,.35,10],[11.5,.3,8],[18.8,.35,10],[27.85,.35,10],[46.95,.4,12]);

function glParams(t){
  const star=kf(t,[[0,.6],[49,.6],[50,.9],[53.5,.85]]);
  let sun=[0,0,1,0];
  if(t>19.8&&t<29)sun=[540,1800,520,kf(t,[[19.8,0],[20.6,.75],[28.2,.75],[29,0]])];
  return {aur:0,red:.9,base:.5,span:.4,star,glow:1,sun,flare:0,spots:0,boil:1.2};
}

/* guinea fowl: round grey-blue body with white dots, small bare head; x,y = feet */
function guinea(x,y,s,t,a){
  if(a<=0)return;ctx.save();A(a);ctx.translate(x,y);ctx.scale(s,s);
  const bob=Math.sin(t*6)*3;ctx.strokeStyle=C.ink;ctx.lineWidth=6;ctx.lineCap='round';
  for(const dx of[-12,14]){ctx.beginPath();ctx.moveTo(dx,-34);ctx.lineTo(dx+3,0);ctx.stroke();}
  ctx.translate(0,bob);ctx.lineWidth=3;
  ctx.fillStyle='#3B4250';ctx.beginPath();ctx.ellipse(-6,-78,70,46,-.12,0,7);ctx.fill();ctx.stroke();
  ctx.fillStyle='#E9E4DA';for(let i=0;i<34;i++){const u=rnd(i*3+1),v=rnd(i*3+2),ang=u*6.28,r=Math.sqrt(v);
    const px=-6+Math.cos(ang)*62*r,py=-78+Math.sin(ang)*38*r;ctx.beginPath();ctx.arc(px,py,3.2,0,7);ctx.fill();}
  ctx.fillStyle='#3B4250';ctx.beginPath();ctx.ellipse(52,-112,12,26,.35,0,7);ctx.fill();ctx.stroke();
  ctx.fillStyle='#7FB8FF';ctx.beginPath();ctx.ellipse(62,-140,15,14,0,0,7);ctx.fill();ctx.stroke();
  ctx.fillStyle=C.crimson;ctx.beginPath();ctx.ellipse(58,-124,6,8,0,0,7);ctx.fill();
  ctx.fillStyle='#E9DDC4';ctx.beginPath();ctx.moveTo(56,-152);ctx.lineTo(62,-170);ctx.lineTo(68,-152);ctx.closePath();ctx.fill();
  ctx.fillStyle=C.amber;ctx.beginPath();ctx.moveTo(76,-144);ctx.lineTo(90,-139);ctx.lineTo(76,-134);ctx.closePath();ctx.fill();
  ctx.fillStyle=C.ink;ctx.beginPath();ctx.arc(66,-144,3,0,7);ctx.fill();
  ctx.restore();
}

function crossOut(x,y,w,p,col){if(p<=0)return;ctx.save();ctx.strokeStyle=col||C.crimson;ctx.lineWidth=10;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+w*E.o(p),y-8*E.o(p));ctx.stroke();ctx.restore();}

/* ---------- A: cover (0-6.3) ---------- */
function sceneA(t){
  BA=env(t,-1,6.35,.01,.25);
  A(1);txt('Why “turkey”?',70,350,{font:F.num(124),...SH});
  A(.9);txt('the bird with the wrong name',80,425,{font:F.ital(52),...SH});
  turkey(540,1130,2.1,t,1);
  stamp(540,990,-.08,700,140,prog(t,5.45,5.75),[['NOT FROM TURKEY',4,F.slab(56,900),4]],C.crimson,'rgba(6,8,14,.88)');
}

/* ---------- B: from North America (6.2-11.0) ---------- */
function sceneB(t){
  BA=env(t,6.2,11.05,.25,.25);
  card(140,430,800,330,-.02,E.o(prog(t,6.3,6.8)),()=>{
    txt('WHERE TURKEYS COME FROM',400,70,{font:F.slab(36,800),fill:C.ink,align:'center',ls:5});ctx.fillStyle='rgba(18,14,11,.6)';ctx.fillRect(40,96,720,3);
    txt('Turkey',400,190,{font:F.num(70),fill:'rgba(18,14,11,.55)',align:'center'});
    crossOut(290,185,220,prog(t,6.6,7.0));
    wipe(40,215,720,100,E.o(prog(t,6.9,7.6)),()=>txt('North America',400,285,{font:F.slab(64,900),fill:C.deep,align:'center'}));
  });
  A(E.o(prog(t,8.0,8.4)));txt('So why the name?',540,940,{font:F.num(92),align:'center',...SH});
  A(E.o(prog(t,9.6,10.1)));txt('blame a different bird',540,1060,{font:F.ital(60),align:'center',fill:C.amber,...SH});
}

/* ---------- C: 1500s, guinea fowl, turkey cock (10.9-19.9) ---------- */
function sceneC(t){
  BA=env(t,10.9,19.95,.25,.25);
  const p=E.o5(prog(t,11.45,11.9)),up=E.io(prog(t,12.4,13.0));
  if(p>0){A(p);txt('1500s',540,lerp(760,470,up),{font:F.slab(lerp(260,140,up),900),align:'center',fill:C.hot,glow:C.amber,blur:60});}
  guinea(540,930,1.7,t,E.o(prog(t,13.3,13.9)));
  A(E.o(prog(t,14.4,14.9)));txt('guinea fowl',540,1015,{font:F.num(80),align:'center',...SH});
  A(E.o(prog(t,14.6,15.1)));txt('from Africa',540,1070,{font:F.ital(44),align:'center',...SH});
  // route ribbon
  const r=E.io(prog(t,16.2,17.3));
  if(r>0){const pts=[['Africa',160],['Ottoman ports',540],['England',920]];
    ctx.save();ctx.strokeStyle=C.amber;ctx.lineWidth=6;ctx.setLineDash([16,12]);A(1);ctx.beginPath();ctx.moveTo(160,1140);ctx.lineTo(160+760*r,1140);ctx.stroke();ctx.restore();
    pts.forEach(([n,x],i)=>{const q=clamp((r-i*.45)/.1);if(q<=0)return;A(q);ctx.fillStyle=C.amber;ctx.beginPath();ctx.arc(x,1140,12,0,7);ctx.fill();
      txt(n,x,1200,{font:F.slab(34,800),align:'center',fill:C.paper,...SH});});}
  stamp(540,790,-.06,600,130,prog(t,18.75,19.05),[['“TURKEY COCK”',4,F.slab(62,900),3]],C.amber,'rgba(6,8,14,.88)');
}

/* ---------- D: Spanish ships, same thing (19.7-29.0) ---------- */
function sceneD(t){
  BA=env(t,19.7,29.05,.25,.25);
  A(E.o(prog(t,20.4,20.9)));txt('from the New World',540,470,{font:F.ital(60),align:'center',...SH});
  const tin=E.o(prog(t,21.6,22.4));
  turkey(lerp(1250,830,tin),1000,1.25,t,tin);
  guinea(240,1000,1.3,t,E.o(prog(t,23.9,24.4)));
  const eq=prog(t,26.1,26.4);if(eq>0){A(E.o5(eq));txt('=',470,880,{font:F.slab(150,900),align:'center',fill:C.paper,...SH});}
  A(E.o(prog(t,24.4,24.8)));txt('looks similar',540,620,{font:F.num(84),align:'center',...SH});
  stamp(540,1170,-.07,520,140,prog(t,27.8,28.1),[['TURKEY',4,F.slab(96,900),10]],C.crimson,'rgba(6,8,14,.88)');
}

/* ---------- E: names around the world (28.9-44.0) ---------- */
const ROWS=[['Turkish','hindi','India',32.35],['French','dinde','India',35.95],['Portuguese','peru','Peru',39.45],['Arabic','dik rumi','Rome',41.25]];
function sceneE(t){
  BA=env(t,28.9,44.05,.25,.25);
  A(E.o(prog(t,29.1,29.6)));txt('What do the Turks call it?',540,440,{font:F.ital(56),align:'center',...SH});
  ROWS.forEach(([lang,word,place,ts],i)=>{
    const q=E.o(prog(t,ts-.5,ts));if(q<=0)return;const y=560+i*165,x=lerp(-200,0,q);
    A(q);ctx.fillStyle='rgba(239,230,210,.94)';ctx.save();ctx.translate(x,0);
    ctx.fillRect(90,y,900,135);ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.strokeRect(90,y,900,135);
    txt(lang.toUpperCase(),130,y+42,{font:F.slab(28,800),fill:'rgba(18,14,11,.6)',ls:4});
    txt(word,130,y+108,{font:F.num(72),fill:C.ink});
    const pq=E.o(prog(t,ts+(i==3?1.4:1.2),ts+(i==3?1.8:1.6)));
    if(pq>0){A(q*pq);txt('→ '+place,950,y+100,{font:F.slab(58,900),fill:C.deep,align:'right'});}
    ctx.restore();
  });
}

/* ---------- F: four places (43.8-50.1) ---------- */
function sceneF(t){
  BA=env(t,43.8,50.1,.25,.25);
  A(E.o(prog(t,44.0,44.5)));txt('one bird from America',540,450,{font:F.ital(58),align:'center',...SH});
  const p=E.o5(prog(t,46.9,47.3));if(p>0){A(p);txt('4',540,800,{font:F.slab(340,900),align:'center',fill:C.crimson,glow:'rgba(0,0,0,.9)',blur:30});
    txt('wrong places',540,910,{font:F.num(84),align:'center',...SH});}
  ['Turkey','India','Peru','Rome'].forEach((n,i)=>{const q=E.o(prog(t,47.6+i*.2,47.9+i*.2));if(q<=0)return;const x=180+i*240;A(q);
    txt(n,x,1100,{font:F.slab(50,800),align:'center',fill:C.paper,...SH});crossOut(x-80,1088,160,prog(t,48.4+i*.15,48.7+i*.15));});
  A(E.o(prog(t,48.1,48.6))*.85);txt('the turkey is native to none of them',540,1190,{font:F.ital(40),align:'center',...SH});
}

/* ---------- G: question (49.9-53.5) ---------- */
function sceneG(t){
  BA=env(t,49.9,55,.25,.1);
  [['What would you',50.1],['have called it?',50.5]].forEach(([s,ts],i)=>{const q=E.o(prog(t,ts,ts+.45));if(q<=0)return;A(q);
    txt(s,70,520+i*140+(1-q)*30,{font:F.num(118),fill:i===1?C.crimson:C.paper,...SH});});
  turkey(800,1150,1.1,t,E.o(prog(t,50.6,51.1)));
  A(.95*prog(t,51.4,51.8));txt('Tell us in the comments.',84,860,{font:F.ital(52),...SH});
}

function drawCity(t){
  const r=clamp(E.io(prog(t,49.6,50.4)));
  const base=lerp(1990,1700,r),sy=lerp(.78,1,r),lit=lerp(.55,1,r);
  BA=1;if(base<H){A(1);ctx.fillStyle='#05070C';ctx.fillRect(0,base,W,H-base);}
  skyline(base,sy,lit,lerp(.85,1,r),[['90,120,220',.26],['255,140,80',.25*r]]);
}

const SC=[[0,6.35,sceneA],[6.2,11.05,sceneB],[10.9,19.95,sceneC],[19.7,29.05,sceneD],[28.9,44.05,sceneE],[43.8,50.1,sceneF],[49.9,55,sceneG]];
function renderFrame(t){
  const sh=shakeAt(t);glc.style.transform=`translate(${sh[0].toFixed(1)}px,${sh[1].toFixed(1)}px)`;
  drawGL(t,glParams(t));
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.shadowBlur=0;ctx.shadowColor='transparent';ctx.setLineDash([]);ctx.clearRect(0,0,W,H);
  ctx.save();ctx.translate(sh[0],sh[1]);TNOW=t;
  ctx.save();drawCity(t);ctx.restore();
  for(const [a,b,fn] of SC){if(t>=a&&t<b){ctx.save();BA=1;ctx.globalAlpha=1;const z=1+.035*clamp((t-a)/(b-a));ctx.translate(540,800);ctx.scale(z,z);ctx.translate(-540,-800);fn(t);ctx.restore();}}
  ctx.restore();BA=1;
  drawFlashes(t);drawHeader(t);drawCaptions(t);drawFx(t);
  return true;
}
buildTextures();
window.READY=true;
