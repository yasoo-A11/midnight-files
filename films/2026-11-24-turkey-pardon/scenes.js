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
/* The turkey pardon is younger than you think.  Film times = narration + 0.25 s.  56.3 s. */
HEAD.push(
  [6.6,11.4,'The 1860s','A Christmas bird'],
  [11.7,18.3,'1947','A bird for the president'],
  [18.6,24.6,'The Truman years','The record'],
  [25.0,37.9,'November 19, 1963','The Rose Garden'],
  [38.9,47.6,'November 17, 1989','The White House']);
FLASH.push([6.05,.04,.45,'255,60,70',.45],[11.95,.05,.45,'255,200,140',.4],[17.65,.04,.4,'255,60,70',.4],[23.55,.04,.45,'255,60,70',.45],
  [25.45,.05,.45,'255,200,140',.4],[33.85,.05,.4,'255,250,240',.35],[37.45,.04,.45,'255,60,70',.45],[39.35,.05,.45,'255,200,140',.4],[50.55,.05,.5,'255,60,70',.45]);
SHAKE.push([6.05,.35,10],[11.95,.35,10],[17.65,.3,8],[23.55,.35,10],[25.45,.35,10],[37.45,.35,10],[39.35,.35,10],[50.55,.4,12]);

function glParams(t){
  const star=kf(t,[[0,.6],[50,.6],[51,.9],[56.3,.85]]);
  let sun=[0,0,1,0];
  if(t>38.8&&t<47.8)sun=[540,1800,520,kf(t,[[38.8,0],[39.6,.8],[47,.8],[47.8,0]])];
  return {aur:0,red:.9,base:.5,span:.4,star,glow:1,sun,flare:0,spots:0,boil:1.2};
}

/* ---------- a turkey made of rounded shapes, facing right; x,y = feet ---------- */
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

/* ---------- A: cover (0-6.5) ---------- */
function sceneA(t){
  BA=env(t,-1,6.55,.01,.25);
  A(1);txt('The turkey pardon',70,340,{font:F.num(122),...SH});
  A(.9);txt('older than it looks?',80,410,{font:F.ital(54),...SH});
  turkey(540,1100,2.1,t,1);
  A(E.o(prog(t,4.9,5.3)));txt('since Lincoln?',540,1210,{font:F.slab(70,900),align:'center',fill:C.paper,...SH});
  stamp(540,960,-.1,520,150,prog(t,5.95,6.25),[['MYTH',4,F.slab(96,900),10]],C.crimson,'rgba(6,8,14,.88)');
}

/* ---------- B: one Christmas bird (6.4-11.6) ---------- */
function sceneB(t){
  BA=env(t,6.4,11.65,.25,.25);
  card(150,420,780,300,-.02,E.o(prog(t,6.9,7.4)),()=>{
    txt('ONE TIME ONLY',390,70,{font:F.slab(38,800),fill:C.ink,align:'center',ls:6});ctx.fillStyle='rgba(18,14,11,.6)';ctx.fillRect(40,96,700,3);
    txt('the president’s son',390,165,{font:F.ital(56),fill:C.ink,align:'center'});
    wipe(40,190,700,90,E.o(prog(t,8.0,8.9)),()=>txt('asks him to spare a turkey',390,250,{font:F.slab(40,800),fill:C.deep,align:'center'}));
  });
  turkey(540,1060,1.5,t,E.o(prog(t,8.6,9.1)));
  stamp(540,1180,-.06,640,130,prog(t,10.4,10.7),[['CHRISTMAS BIRD',4,F.slab(62,900),3]],C.amber,'rgba(6,8,14,.85)');
}

/* ---------- C: 1947, dinner (11.5-18.5) ---------- */
function sceneC(t){
  BA=env(t,11.5,18.55,.25,.25);
  const p=E.o5(prog(t,11.9,12.4)),up=E.io(prog(t,12.9,13.5));
  if(p>0){A(p);txt('1947',540,lerp(760,500,up),{font:F.slab(lerp(300,170,up),900),align:'center',fill:C.hot,glow:C.amber,blur:60});}
  const c=E.o(prog(t,13.2,13.8));
  card(250,590,580,360,.03,c,()=>{
    ctx.strokeStyle='rgba(18,14,11,.35)';ctx.lineWidth=4;for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(0,i*90);ctx.lineTo(580,i*90);ctx.stroke();}
    ctx.fillStyle='#F7F0DE';ctx.fillRect(130,120,320,120);ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.strokeRect(130,120,320,120);
    txt('TO: THE PRESIDENT',290,175,{font:F.slab(34,900),fill:C.ink,align:'center'});txt('every year',290,220,{font:F.ital(32),fill:C.ink,align:'center'});
  });
  A(E.o(prog(t,16.7,17.1)));txt('Not a pet.',540,1060,{font:F.num(96),align:'center',...SH});
  const d=E.o5(prog(t,17.6,17.9));if(d>0){A(d);txt('Dinner.',540,1190,{font:F.slab(110,900),align:'center',fill:C.crimson,glow:'rgba(0,0,0,.9)',blur:20});}
}

/* ---------- D: Truman, no record (18.4-24.8) ---------- */
function sceneD(t){
  BA=env(t,18.4,24.85,.25,.25);
  A(E.o(prog(t,18.8,19.3)));txt('the first pardon?',540,470,{font:F.ital(60),align:'center',...SH});
  A(E.o(prog(t,19.6,20.1)));txt('Truman',540,640,{font:F.num(170),align:'center',...SH});
  card(150,760,780,300,-.02,E.o(prog(t,21.4,21.9)),()=>{
    txt('PRESIDENTIAL LIBRARY',390,70,{font:F.slab(38,800),fill:C.ink,align:'center',ls:6});ctx.fillStyle='rgba(18,14,11,.6)';ctx.fillRect(40,96,700,3);
    A(.12);ctx.fillStyle=C.ink;for(let i=0;i<4;i++)ctx.fillRect(70,130+i*34,i===3?300:640,12);
  });
  stamp(540,960,-.1,600,150,prog(t,23.45,23.75),[['NO RECORD',4,F.slab(84,900),6]],C.crimson,'rgba(6,8,14,.88)');
}

/* ---------- E: 1963 (24.7-38.1) ---------- */
function sceneE(t){
  BA=env(t,24.7,38.15,.25,.25);
  const p=E.o5(prog(t,25.4,25.9)),up=E.io(prog(t,26.4,27.0));
  if(p>0){A(p*(1-prog(t,30.8,31.3)));txt('1963',540,lerp(760,500,up),{font:F.slab(lerp(300,160,up),900),align:'center',fill:C.hot,glow:C.amber,blur:60});}
  const tp=E.o(prog(t,26.9,27.5));
  turkey(470,1200,1.9,t,tp*(1-.8*prog(t,34.9,35.4)),prog(t,28.1,28.5)>0?['GOOD EATING,','MR. PRESIDENT']:null);
  const q=E.o(prog(t,33.0,33.6));if(q>0){A(q*(1-prog(t,34.9,35.3)));txt('“We’ll just let',540,470,{font:F.num(96),align:'center',...SH});txt('this one grow.”',540,580,{font:F.num(96),align:'center',fill:C.amber,...SH});}
  const n=E.o(prog(t,35.0,35.5));if(n>0){A(n);txt('newspapers: “pardon”',540,520,{font:F.ital(66),align:'center',...SH});}
  stamp(540,720,-.08,700,150,prog(t,37.35,37.65),[['NOT OFFICIAL',4,F.slab(72,900),5]],C.crimson,'rgba(6,8,14,.88)');
}

/* ---------- F: 1989, every year since (38.0-47.9) ---------- */
function sceneF(t){
  BA=env(t,38.0,47.95,.25,.25);
  const p=E.o5(prog(t,39.3,39.8)),up=E.io(prog(t,40.6,41.2));
  if(p>0){A(p);txt('1989',540,lerp(760,500,up),{font:F.slab(lerp(300,160,up),900),align:'center',fill:C.hot,glow:C.amber,blur:60});}
  A(E.o(prog(t,41.2,41.7)));txt('a promise, not a menu',540,610,{font:F.ital(58),align:'center',...SH});
  turkey(540,1000,1.2,t,E.o(prog(t,42.4,42.9)));
  const yrs=2026-1989+1,n=Math.floor(yrs*E.io(prog(t,45.9,47.5)));
  for(let i=0;i<yrs;i++){const c=i%19,r=Math.floor(i/19),x=150+c*41,y=1110+r*56;A(i<n?1:.12);ctx.fillStyle=i<n?C.amber:C.paper;ctx.fillRect(x,y,26,40);}
  A(E.o(prog(t,46.2,46.6)));txt('one every year since',540,1252,{font:F.ital(36),align:'center',...SH});
}

/* ---------- G: under forty years old, and the question (47.8-56.3) ---------- */
function sceneG(t){
  BA=env(t,47.8,57,.25,.1);
  const o=1-prog(t,51.9,52.3);
  A(E.o(prog(t,48.1,48.6))*o);txt('a tradition that feels ancient',540,520,{font:F.ital(56),align:'center',...SH});
  const p=E.o5(prog(t,50.5,50.9));if(p>0){A(p*o);txt('37',540,820,{font:F.slab(330,900),align:'center',fill:C.crimson,glow:'rgba(0,0,0,.9)',blur:30});
    txt('years old',540,940,{font:F.num(90),align:'center',...SH});A(p*o*.8);txt('1989 to 2026',540,1020,{font:F.ital(44),align:'center',...SH});}
  [['What else',52.25],['feels older',52.65],['than it really is?',53.15]].forEach(([s,ts],i)=>{const q=E.o(prog(t,ts,ts+.45));if(q<=0)return;A(q);
    txt(s,70,470+i*130+(1-q)*30,{font:F.num(112),fill:i===2?C.crimson:C.paper,...SH});});
  A(.95*prog(t,54.5,54.9));txt('Tell us in the comments.',84,900,{font:F.ital(52),...SH});
}

function drawCity(t){
  const r=clamp(E.io(prog(t,52.0,52.8)));
  const base=lerp(1990,1700,r),sy=lerp(.78,1,r),lit=lerp(.55,1,r);
  BA=1;if(base<H){A(1);ctx.fillStyle='#05070C';ctx.fillRect(0,base,W,H-base);}
  skyline(base,sy,lit,lerp(.85,1,r),[['90,120,220',.26],['255,140,80',.25*r]]);
}

const SC=[[0,6.55,sceneA],[6.4,11.65,sceneB],[11.5,18.55,sceneC],[18.4,24.85,sceneD],[24.7,38.15,sceneE],[38.0,47.95,sceneF],[47.8,57,sceneG]];
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
