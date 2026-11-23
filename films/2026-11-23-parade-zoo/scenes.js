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
/* ---------- a month card: 7 columns, first weekday 0=Sun ---------- */
const DOW=['S','M','T','W','T','F','S'];
function month(x,y,w,rot,a,title,first,ndays,opt){
  const cw=(w-60)/7,rh=cw*.78,h=170+rh*Math.ceil((first+ndays)/7)+30;
  card(x,y,w,h,rot,a,()=>{
    ctx.fillStyle=C.deep;ctx.fillRect(0,0,w,96);txt(title,w/2,66,{font:F.slab(46,800),fill:'#F7F0DE',align:'center',ls:4});
    DOW.forEach((d,i)=>{const hot=i===4&&opt.thu;txt(d,30+cw*(i+.5),146,{font:F.slab(30,800),fill:hot?C.deep:'rgba(18,14,11,.55)',align:'center'});});
    for(let d=1;d<=ndays;d++){const k=first+d-1,c=k%7,r=Math.floor(k/7),cx=30+cw*(c+.5),cy=170+rh*(r+.62);
      const isThu=c===4,hl=isThu&&opt.thu?clamp(opt.thu(r)):0;
      if(hl>0){ctx.save();A(a*hl*.9);ctx.fillStyle='rgba(255,182,77,.55)';ctx.beginPath();ctx.roundRect(cx-cw*.42,cy-rh*.6,cw*.84,rh*.8,10);ctx.fill();ctx.restore();A(a);}
      txt(String(d),cx,cy,{font:F.rom(Math.round(cw*.42)),fill:C.ink,align:'center'});
      if(opt.circle&&opt.circle[d]){const p=clamp(opt.circle[d]);if(p>0){ctx.save();ink(6,C.crimson);ctx.beginPath();ctx.ellipse(cx,cy-rh*.2,cw*.5,rh*.52,-.1,-1.4,-1.4+6.6*E.o(p));ctx.stroke();ctx.restore();A(a);}}
      if(opt.cross&&opt.cross[d]){const p=clamp(opt.cross[d]);if(p>0){ctx.save();ink(7,C.crimson);seg(cx-cw*.38,cy-rh*.55,cx+cw*.38,cy+rh*.1,E.o(p));ctx.restore();A(a);}}
    }
    if(opt.cell)opt.cell(cw,rh);
  });
  return h;
}

/* The parade's first stars were zoo animals.  Film times = narration + 0.25 s.  57.6 s. */
HEAD.push(
  [6.4,14.2,'November 27, 1924','New York'],
  [14.4,25.7,'Thanksgiving morning, 1924','The parade route'],
  [26.0,35.5,'1927','The balloons arrive'],
  [35.8,48.0,'Late 1920s','After the parade'],
  [48.3,51.6,'This Thursday','November 26, 2026'],
  );
FLASH.push([5.25,.04,.45,'255,60,70',.45],[7.05,.05,.5,'255,200,140',.4],[10.4,.03,.4,'255,60,70',.4],[22.95,.04,.5,'255,120,80',.4],
  [26.35,.05,.45,'255,200,140',.4],[30.95,.05,.5,'255,250,240',.35],[40.45,.04,.4,'255,200,140',.35],[46.85,.05,.5,'255,60,70',.45]);
SHAKE.push([5.25,.35,10],[7.05,.4,12],[22.95,.6,16],[26.35,.35,10],[40.45,.3,8],[46.85,.4,12]);

function glParams(t){
  const star=kf(t,[[0,.6],[35,.6],[36,.9],[57.6,.85]]);
  let sun=[0,0,1,0];
  if(t>6&&t<14.4)sun=[540,1800,520,kf(t,[[6,0],[7,.8],[13.6,.8],[14.4,0]])];
  return {aur:0,red:.9,base:.5,span:.4,star,glow:1,sun,flare:0,spots:0,boil:1.2};
}

/* ---------- capsule animals (paper silhouettes with an ink edge), facing right, x,y = feet line centre ---------- */
function blob(x,y,rx,ry,r){ctx.beginPath();ctx.ellipse(x,y,rx,ry,r||0,0,7);ctx.fill();ctx.stroke();}
function cap(x1,y1,x2,y2,w){ctx.save();ctx.lineCap='round';ctx.lineWidth=w+6;ctx.strokeStyle=C.ink;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  ctx.lineWidth=w;ctx.strokeStyle=ctx.fillStyle;ctx.stroke();ctx.restore();}
function legs(x,y,s,ph,pairs,len,w){pairs.forEach((dx,i)=>{const a=Math.sin(ph+i*Math.PI)*.35;cap(x+dx*s,y-len*s,x+dx*s+Math.sin(a)*len*s,y-len*s+Math.cos(a)*len*s,w*s);});}
function animal(kind,x,y,s,t,a){
  if(a<=0)return;ctx.save();A(a);ctx.fillStyle='#E9DDC4';ctx.strokeStyle=C.ink;ctx.lineWidth=3;
  const ph=t*7+x*.01,bob=Math.abs(Math.sin(ph))*4*s;
  if(kind==='elephant'){legs(x,y,s,ph,[-38,-14,18,40],58,22);ctx.translate(0,-bob);blob(x,y-95*s,62*s,42*s);blob(x+60*s,y-112*s,28*s,26*s);blob(x+44*s,y-112*s,16*s,26*s,.3);
    cap(x+80*s,y-110*s,x+92*s,y-60*s+Math.sin(ph)*6*s,12*s);}
  if(kind==='camel'){legs(x,y,s,ph,[-30,-12,14,32],70,14);ctx.translate(0,-bob);blob(x,y-100*s,48*s,26*s);blob(x-12*s,y-128*s,20*s,18*s);
    cap(x+40*s,y-104*s,x+62*s,y-150*s,14*s);blob(x+72*s,y-152*s,18*s,11*s);}
  if(kind==='bear'){legs(x,y,s,ph,[-24,-8,12,26],34,22);ctx.translate(0,-bob);blob(x,y-58*s,46*s,30*s);blob(x+46*s,y-72*s,22*s,20*s);blob(x+40*s,y-92*s,7*s,7*s);}
  if(kind==='monkey'){legs(x,y,s,ph,[-6,8],32,10);ctx.translate(0,-bob);blob(x,y-50*s,16*s,24*s);blob(x+4*s,y-86*s,15*s,15*s);
    ctx.save();ctx.lineWidth=5*s;ctx.beginPath();ctx.moveTo(x-12*s,y-42*s);ctx.quadraticCurveTo(x-48*s,y-30*s,x-36*s,y-80*s+Math.sin(ph)*8*s);ctx.stroke();ctx.restore();}
  ctx.restore();
}
/* a round parade balloon with handler lines */
function balloon(x,y,r,col,a,lines,tag){if(a<=0)return;ctx.save();A(a);
  if(lines>0){ctx.strokeStyle='rgba(239,230,210,.6)';ctx.lineWidth=2;for(const dx of [-.6,0,.6]){ctx.beginPath();ctx.moveTo(x+dx*r,y+r*.8);ctx.lineTo(x+dx*r*.4,y+r*.8+lines);ctx.stroke();}}
  const g=ctx.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r);g.addColorStop(0,'#FFFFFF');g.addColorStop(.25,col);g.addColorStop(1,'#3A0A12');
  ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,r,r*1.1,0,0,7);ctx.fill();ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.stroke();
  ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x-10,y+r*1.08);ctx.lineTo(x+10,y+r*1.08);ctx.lineTo(x,y+r*1.2);ctx.fill();
  if(tag){ctx.fillStyle='#F7F0DE';ctx.fillRect(x-56,y+r*1.25,112,44);ctx.strokeRect(x-56,y+r*1.25,112,44);txt('RETURN',x,y+r*1.25+30,{font:F.slab(22,800),fill:C.ink,align:'center',ls:2});}
  ctx.restore();}

/* ---------- A: cover (0-6.3) ---------- */
function sceneA(t){
  BA=env(t,-1,6.35,.01,.25);
  A(1);txt('The parade’s',70,330,{font:F.num(110),...SH});txt('first stars',70,440,{font:F.num(130),...SH});
  A(.9);txt('weren’t balloons.',80,510,{font:F.ital(56),...SH});
  const pop=prog(t,3.6,4.2);
  balloon(540,800-Math.sin(t*1.4)*12,170,C.crimson,1-E.i(pop),260,false);
  animal('elephant',470,1060,2.2,t,E.o(prog(t,4.9,5.4)));
  stamp(540,1180,-.08,700,150,prog(t,5.15,5.45),[['REAL ELEPHANTS',4,F.slab(66,900),3]],C.crimson,'rgba(6,8,14,.85)');
}

/* ---------- B: 1924, a parade to sell Christmas (6.2-14.3) ---------- */
function sceneB(t){
  BA=env(t,6.2,14.35,.25,.25);
  const p=E.o5(prog(t,7.0,7.5)),up=E.io(prog(t,8.0,8.6));
  if(p>0){A(p);txt('1924',540,lerp(760,450,up),{font:F.slab(lerp(300,170,up),900),align:'center',fill:C.hot,glow:C.amber,blur:60});}
  card(150,560,780,400,.02,E.o(prog(t,8.3,8.8)),()=>{
    txt('A NEW YORK DEPARTMENT STORE',390,74,{font:F.slab(32,800),fill:C.ink,align:'center',ls:4});ctx.fillStyle='rgba(18,14,11,.6)';ctx.fillRect(40,98,700,3);
    wipe(40,120,700,130,E.o5(prog(t,11.8,12.6)),()=>txt('CHRISTMAS PARADE',390,205,{font:F.slab(62,900),fill:C.deep,align:'center'}));
    A(E.o(prog(t,13.0,13.6)));txt('on Thanksgiving morning',390,300,{font:F.ital(50),fill:C.ink,align:'center'});
  });
  stamp(540,1100,-.1,720,150,prog(t,10.3,10.6),[['TO SELL CHRISTMAS',4,F.slab(60,900),2]],C.crimson,'rgba(6,8,14,.85)');
}

/* ---------- C: the procession (14.2-25.9) ---------- */
const PROC=[['band',14.65],['float',15.25],['elephant',18.65],['camel',19.25],['bear',19.85],['monkey',20.85]];
function sceneC(t){
  BA=env(t,14.2,25.95,.25,.25);
  A(1);ctx.fillStyle='rgba(239,230,210,.08)';ctx.fillRect(0,1040,W,160);ctx.fillStyle='rgba(239,230,210,.35)';ctx.fillRect(0,1040,W,3);ctx.fillRect(0,1200,W,3);
  const scroll=(t-14.2)*55;
  PROC.forEach(([k,ts],i)=>{const p=E.o(prog(t,ts,ts+.5));if(p<=0)return;const x=[960,780,560,370,215,85][i]-(1-p)*80+((t-ts)*10),y=1170;
    if(k==='band'){A(p);ctx.fillStyle=C.crimson;ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y-50,40,30,0,0,7);ctx.fill();ctx.stroke();ctx.strokeStyle=C.amber;ctx.beginPath();ctx.moveTo(x-30,y-60);ctx.lineTo(x+30,y-40);ctx.stroke();}
    else if(k==='float'){A(p);ctx.fillStyle=C.amber;ctx.fillRect(x-70,y-110,140,80);ctx.strokeStyle=C.ink;ctx.lineWidth=3;ctx.strokeRect(x-70,y-110,140,80);ctx.fillStyle=C.ink;for(const dx of[-45,45]){ctx.beginPath();ctx.arc(x+dx,y-22,18,0,7);ctx.fill();}}
    else animal(k,x,y,k==='monkey'?1.3:1.25,t,p);
    A(p*(1-prog(t,21.4,21.9)));txt(k,x,y+44,{font:F.ital(34),align:'center',...SH});});
  A(E.o(prog(t,17.1,17.6))*(1-prog(t,21.3,21.8)));txt('on loan from the',540,560,{font:F.ital(54),align:'center',...SH});txt('Central Park Zoo',540,680,{font:F.num(110),align:'center',...SH});
  const r=E.o5(prog(t,22.9,23.3));if(r>0){const s=1+.15*Math.sin(t*30)*(1-prog(t,23.3,24));ctx.save();ctx.translate(540,640);ctx.scale(s,s);A(r*(1-prog(t,25.4,25.9)));txt('ROAR',0,0,{font:F.slab(230,900),align:'center',fill:C.amber,glow:C.crimson,blur:40});ctx.restore();}
  A(E.o(prog(t,24.7,25.1)));txt('some children are terrified',540,880,{font:F.ital(54),align:'center',fill:C.crimson,...SH});
}

/* ---------- D: 1927, balloons replace the animals (25.8-35.7) ---------- */
function sceneD(t){
  BA=env(t,25.8,35.75,.25,.25);
  const p=E.o5(prog(t,26.3,26.8)),up=E.io(prog(t,27.3,27.9));
  if(p>0){A(p);txt('1927',540,lerp(760,430,up),{font:F.slab(lerp(300,160,up),900),align:'center',fill:C.hot,glow:C.amber,blur:60});}
  const g=1-E.io(prog(t,28.0,28.8));
  ['elephant','camel','bear','monkey'].forEach((k,i)=>animal(k,200+i*230,1150,k==='elephant'?1:1,t,g*E.o(prog(t,26.4,26.8))));
  stamp(540,1000,-.1,560,150,prog(t,28.0,28.3)*(1-prog(t,29.4,29.8)),[['GONE',4,F.slab(100,900),10]],C.crimson,'rgba(6,8,14,.85)');
  const b=E.back(prog(t,30.8,31.6));
  [[300,C.crimson,150],[560,C.amber,190],[820,C.blue,140]].forEach(([x,c,r],i)=>balloon(x,lerp(1500,860+i*30,b)+Math.sin(t*1.3+i)*10,r,c,clamp(b*1.4),180,false));
  A(E.o(prog(t,32.3,32.8)));txt('the first character balloon:',540,560,{font:F.ital(48),align:'center',...SH});
  A(E.o(prog(t,33.6,34.2)));txt('a cartoon cat, Felix',540,650,{font:F.slab(72,900),align:'center',fill:C.paper,...SH});
}

/* ---------- E: let them go, with a reward (35.6-48.2) ---------- */
function sceneE(t){
  BA=env(t,35.6,48.25,.25,.25);
  const fly=E.i2(prog(t,40.4,47.5));
  [[300,C.crimson,120],[560,C.amber,150],[800,C.blue,110]].forEach(([x,c,r],i)=>{const y=lerp(690+i*20,380-i*40,fly)+Math.sin(t*1.3+i)*12;const dx=fly*(i-1)*60;
    balloon(x+dx,y,r*(1-.35*fly),c,1,t<40.45?180:0,t>44.2&&i===1);});
  if(t<40.45){A(1);ctx.strokeStyle='rgba(239,230,210,.5)';}
  A(E.o(prog(t,36.2,36.7))*(1-prog(t,40.2,40.6)));txt('the parade ends',540,1210,{font:F.ital(54),align:'center',...SH});
  A(E.o(prog(t,37.5,38.0))*(1-prog(t,40.2,40.6)));txt('now what?',540,1110,{font:F.slab(80,900),align:'center',fill:C.amber,...SH});
  const go=E.o5(prog(t,40.4,40.8));if(go>0){A(go*(1-prog(t,43.0,43.5)));txt('LET THEM GO',540,1150,{font:F.slab(110,900),align:'center',fill:C.hot,glow:C.amber,blur:40});}
  A(E.o(prog(t,44.4,44.9)));txt('each with a return address',540,1000,{font:F.ital(52),align:'center',...SH});
  stamp(540,1120,-.08,640,150,prog(t,46.75,47.05),[['$100 REWARD',6,F.slab(84,900),3]],C.crimson,'rgba(6,8,14,.85)');
}

/* ---------- F: this Thursday, and the question (48.1-57.6) ---------- */
function sceneF(t){
  BA=env(t,48.1,52.0,.25,.3);
  month(150,430,780,-.02,E.o(prog(t,48.3,48.8)),'NOVEMBER 2026',0,30,{thu:r=>r===3?1:.3,circle:{26:prog(t,48.7,49.3)}});
  A(E.o(prog(t,49.5,50.0)));txt('the parade marches again',540,1200,{font:F.ital(54),align:'center',...SH});
}
function sceneG(t){
  BA=env(t,51.8,58,.25,.1);
  balloon(860,1030+Math.sin(t*1.2)*14,95,C.crimson,E.o(prog(t,51.9,52.5)),0,true);
  [['Would you chase',52.05],['a runaway balloon',52.95],['for $100?',54.15]].forEach(([s,ts],i)=>{const q=E.o(prog(t,ts,ts+.45));if(q<=0)return;A(q);
    txt(s,70,470+i*130+(1-q)*30,{font:F.num(112),fill:i===2?C.crimson:C.paper,...SH});});
  A(.95*prog(t,55.6,56.0));txt('Tell us in the comments.',84,900,{font:F.ital(52),...SH});
}

function drawCity(t){
  const r=E.io(prog(t,35.6,36.4))*(1-E.io(prog(t,47.6,48.4)))+E.io(prog(t,51.8,52.6));
  const base=lerp(1990,1700,clamp(r)),sy=lerp(.78,1,clamp(r)),lit=lerp(.55,1,clamp(r));
  BA=1;if(base<H){A(1);ctx.fillStyle='#05070C';ctx.fillRect(0,base,W,H-base);}
  skyline(base,sy,lit,lerp(.85,1,clamp(r)),[['90,120,220',.26],['255,140,80',.25*clamp(r)]]);
}

const SC=[[0,6.35,sceneA],[6.2,14.35,sceneB],[14.2,25.95,sceneC],[25.8,35.75,sceneD],[35.6,48.25,sceneE],[48.1,52.0,sceneF],[51.8,58,sceneG]];
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
