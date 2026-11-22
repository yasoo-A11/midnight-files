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
/* Franksgiving: why Thanksgiving is on the fourth Thursday.  Film times = narration + 0.25 s.  55.5 s. */
HEAD.push(
  [6.6,12.0,'1863','Thanksgiving proclamation'],
  [12.6,23.2,'November 1939','United States'],
  [23.4,28.0,'August 1939','A new date'],
  [28.1,38.9,'Thanksgiving 1939','Two dates'],
  [39.2,43.9,'1941','Commerce Department'],
  [44.2,48.9,'December 26, 1941','A fixed date'],
  [49.2,51.0,'2026','This year']);
FLASH.push([5.4,.03,.4,'255,60,70',.4],[12.85,.05,.5,'255,200,140',.45],[26.85,.04,.45,'255,60,70',.5],[33.45,.05,.45,'255,60,70',.45],
  [42.25,.04,.45,'255,60,70',.45],[45.95,.04,.4,'255,250,240',.35],[50.05,.05,.45,'255,200,140',.4]);
SHAKE.push([5.4,.35,10],[12.85,.45,14],[26.85,.4,14],[28.35,.5,12],[33.45,.35,10],[42.25,.4,12],[45.95,.3,9]);

function glParams(t){
  const star=kf(t,[[0,.6],[12.6,.6],[13,.3],[44,.3],[44.4,.7],[55.5,.85]]);
  let sun=[0,0,1,0];
  if(t>12.6&&t<23.4)sun=[540,1800,520,kf(t,[[12.6,0],[13.3,.85],[18.3,.85],[19,.35],[23.4,0]])];
  return {aur:0,red:.9,base:.5,span:.4,star,glow:1,sun,flare:0,spots:0,boil:1.3};
}

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

/* ---------- A: cover (0-6.4) ---------- */
function sceneA(t){
  BA=env(t,-1,6.45,.01,.25);
  A(1);txt('Thanksgiving',70,350,{font:F.num(150),...SH});
  A(.9);txt('why the fourth Thursday?',80,418,{font:F.ital(54),...SH});
  month(150,470,780,-.03,1,'NOVEMBER',0,30,{thu:r=>prog(t,1.0+r*.18,1.25+r*.18)*(r===3?1:.35),circle:{26:prog(t,2.0,2.6)}});
  stamp(540,1120,-.12,840,170,prog(t,5.35,5.65),[['A FIGHT ABOUT SHOPPING',4,F.slab(54,900),2]],C.crimson,'rgba(6,8,14,.85)');
}

/* ---------- B: 1863 and seventy quiet years (6.3-12.4) ---------- */
function sceneB(t){
  BA=env(t,6.3,12.45,.25,.25);
  const p=E.o5(prog(t,6.9,7.4));if(p>0){A(p);txt('1863',540,560,{font:F.slab(260,900),align:'center',fill:C.hot,glow:C.amber,blur:60});}
  card(140,640,800,300,.02,E.o(prog(t,8.0,8.5)),()=>{
    txt('PROCLAMATION',400,70,{font:F.slab(40,800),fill:C.ink,align:'center',ls:8});ctx.fillStyle='rgba(18,14,11,.6)';ctx.fillRect(40,96,720,3);
    txt('President Lincoln',400,160,{font:F.ital(52),fill:C.ink,align:'center'});
    wipe(40,190,720,90,E.o(prog(t,8.9,9.8)),()=>txt('Thanksgiving: the last Thursday',400,250,{font:F.slab(44,800),fill:C.deep,align:'center'}));
  });
  const q=prog(t,10.4,11.7);if(q>0){const yr=Math.round(lerp(1863,1933,E.io(q)));A(env(t,10.3,12.45,.2,.2));
    txt(String(yr),540,1120,{font:F.slab(120,900),align:'center',fill:C.paper,...SH});
    ctx.fillStyle='rgba(239,230,210,.2)';ctx.fillRect(180,1160,720,3);ctx.fillStyle=C.amber;ctx.fillRect(180,1159,720*E.io(q),5);
    txt('70 years, same rule',540,1220,{font:F.ital(44),align:'center',...SH});}
}

/* ---------- C: 1939, five Thursdays (12.3-23.3) ---------- */
function sceneC(t){
  BA=env(t,12.3,23.35,.2,.25);
  const p=E.o5(prog(t,12.85,13.3)),up=E.io(prog(t,13.9,14.5));
  if(p>0){A(p);txt('1939',540,lerp(820,430,up),{font:F.slab(lerp(300,150,up),900),align:'center',fill:C.hot,glow:C.amber,blur:60});}
  const ca=E.o(prog(t,14.0,14.5)),dim=1-prog(t,18.2,18.7);
  if(ca>0)month(150,500,780,.02,ca*dim,'NOVEMBER 1939',3,30,{thu:r=>prog(t,15.0+r*.22,15.25+r*.22),circle:{30:prog(t,17.3,17.9)}});
  const d=env(t,18.4,23.4,.3,.2);if(d>0){A(d);txt('The Great Depression',540,760,{font:F.num(80),align:'center',...SH});
    A(d*E.o(prog(t,20.0,20.4)));txt('Thanksgiving to Christmas:',540,900,{font:F.ital(46),align:'center',...SH});
    A(d*E.o(prog(t,20.9,21.3)));txt('25 days',540,1020,{font:F.slab(90,900),align:'center',fill:C.crimson,glow:'rgba(0,0,0,.9)',blur:20});}
}

/* ---------- D: moved a week earlier (23.2-28.2) ---------- */
function sceneD(t){
  BA=env(t,23.2,28.25,.25,.2);
  month(150,430,780,.02,1,'NOVEMBER 1939',3,30,{thu:r=>r>=3?1:.3,circle:{30:1-prog(t,25.3,25.6),23:prog(t,26.6,27.1)},cross:{30:prog(t,25.4,25.8)}});
  const ar=E.io(prog(t,25.6,26.6));if(ar>0){ctx.save();ink(8,C.crimson);ctx.shadowColor=C.crimson;ctx.shadowBlur=18;const x=980;seg(x,1060,x,lerp(1060,920,ar),1);ctx.beginPath();ctx.moveTo(x-18,lerp(1060,920,ar)+22);ctx.lineTo(x,lerp(1060,920,ar));ctx.lineTo(x+18,lerp(1060,920,ar)+22);ctx.stroke();ctx.restore();}
  const n=Math.round(lerp(25,32,E.io(prog(t,26.6,27.3))));A(E.o(prog(t,23.6,24.0)));
  txt('Thanksgiving to Christmas:',540,1110,{font:F.ital(46),align:'center',...SH});
  txt(n+' days',540,1205,{font:F.slab(96,900),align:'center',fill:n>25?C.amber:C.crimson,glow:'rgba(0,0,0,.9)',blur:20});
}

/* ---------- E: the country splits (28.0-39.0) ---------- */
const TILES=(()=>{const a=[];for(let i=0;i<48;i++){const k=rnd(i*7.13);a.push({i,side:i<3?2:(k<.5?0:1)});}return a;})();
function sceneE(t){
  BA=env(t,28.0,39.05,.2,.25);
  const sp=E.io(prog(t,28.3,29.6));
  let n0=0,n1=0,nb=0;
  TILES.forEach((tl,i)=>{const c=i%8,r=Math.floor(i/8);let x=160+c*104,y=470+r*96;
    const side=tl.side,both=side===2;
    let tx=side===0?120+((n0)%4)*96:side===1?600+((n1)%4)*96:384+nb*104, ty=side===0?470+Math.floor(n0/4)*90:side===1?470+Math.floor(n1/4)*90:1080;
    if(side===0)n0++;else if(side===1)n1++;else nb++;
    const bp=both?E.o(prog(t,34.6+tl.i*.6,35.0+tl.i*.6)):0;
    x=lerp(x,tx,sp);y=lerp(y,ty,sp);
    const col=both?(bp>0?C.amber:'#B9AE98'):(sp<.5?'#B9AE98':(side===0?C.crimson:C.blue));
    A(.92);ctx.fillStyle=col;ctx.beginPath();ctx.roundRect(x,y,80,70,10);ctx.fill();
    if(both&&bp>0){A(bp);txt(['TX','CO','MS'][tl.i],x+40,y+48,{font:F.slab(34,900),fill:C.ink,align:'center'});}
  });
  const l=E.o(prog(t,29.2,29.7));A(l);
  txt('Nov. 23',264,440,{font:F.slab(56,900),align:'center',fill:C.crimson,...SH});txt('Nov. 30',744,440,{font:F.slab(56,900),align:'center',fill:C.blue,...SH});
  A(E.o(prog(t,29.5,30.0)));txt('with the president',264,1032,{font:F.ital(36),align:'center',...SH});
  A(E.o(prog(t,30.9,31.3)));txt('the old date',744,1032,{font:F.ital(36),align:'center',...SH});
  stamp(540,760,-.1,780,170,prog(t,33.35,33.65)*(1-prog(t,34.3,34.6)),[['FRANKSGIVING',6,F.slab(104,900),6]],C.crimson,'rgba(6,8,14,.88)');
  const tw=E.o5(prog(t,37.9,38.3));if(tw>0){A(tw);txt('celebrated twice',540,1200,{font:F.slab(64,900),align:'center',fill:C.amber,glow:'rgba(0,0,0,.9)',blur:20});}
  A(.7*E.o(prog(t,30.0,30.5)));txt('One tile = one state (48 in 1939)',84,1252,{font:F.ital(30),...SH});
}

/* ---------- F: the numbers (38.9-44.0) ---------- */
function sceneF(t){
  BA=env(t,38.9,44.05,.25,.2);
  card(150,470,780,420,-.02,E.o(prog(t,39.2,39.7)),()=>{
    txt('REPORT, 1941',390,70,{font:F.slab(40,800),fill:C.ink,align:'center',ls:6});ctx.fillStyle='rgba(18,14,11,.6)';ctx.fillRect(40,96,700,3);
    txt('U.S. Commerce Department',390,160,{font:F.ital(46),fill:C.ink,align:'center'});
    wipe(40,190,700,80,E.o(prog(t,40.9,41.8)),()=>txt('Did the earlier date help sales?',390,248,{font:F.slab(40,700),fill:C.ink,align:'center'}));
    A(.12);ctx.fillStyle=C.ink;for(let i=0;i<3;i++)ctx.fillRect(70,300+i*28,i===2?380:640,10);
  });
  stamp(540,1020,-.1,760,180,prog(t,42.15,42.45),[['NO REAL BOOST',6,F.slab(110,900),6]],C.crimson,'rgba(6,8,14,.88)');
}

/* ---------- G: locked in 1941, and this year (43.9-51.3) ---------- */
const LOCK=[P('M-60,-10 L-60,-70 C-60,-150 60,-150 60,-70 L60,-10'),P('M-95,-10 L95,-10 L95,120 L-95,120 Z'),P('M0,30 L0,80')];
function sceneG(t){
  BA=env(t,43.9,51.35,.2,.25);
  const o=1-E.io(prog(t,48.6,49.1));
  if(o>0){const p=E.o5(prog(t,44.3,44.8));A(p*o);txt('1941',540,520,{font:F.slab(200,900),align:'center',fill:C.hot,glow:C.amber,blur:50});
    const lp=E.o(prog(t,45.2,45.9)),snap=E.back(prog(t,45.9,46.2));
    ctx.save();ctx.translate(540,760);A(o*lp);ink(10,C.amber);ctx.shadowColor=C.amber;ctx.shadowBlur=20;ctx.translate(0,-30*(1-snap));strokeSet([LOCK[0]],lp,.3);ctx.translate(0,30*(1-snap));strokeSet([LOCK[1],LOCK[2]],lp,.3);ctx.restore();
    A(o*E.o(prog(t,46.7,47.2)));txt('the fourth Thursday',540,1000,{font:F.num(96),align:'center',...SH});
    A(o*E.o(prog(t,47.2,47.6)));txt('of November, by law',540,1080,{font:F.ital(52),align:'center',...SH});}
  const c=E.o(prog(t,48.8,49.3));if(c>0)month(150,420,780,-.02,c,'NOVEMBER 2026',0,30,{thu:r=>r===3?1:.3,circle:{26:prog(t,49.9,50.5)}});
}

/* ---------- H: the question (51.1-55.5) ---------- */
function sceneH(t){
  BA=env(t,51.1,56,.25,.1);
  [['Would you move',51.35],['a holiday',51.95],['to sell more?',52.55]].forEach(([s,ts],i)=>{const q=E.o(prog(t,ts,ts+.45));if(q<=0)return;A(q);
    txt(s,78,500+i*140+(1-q)*30,{font:F.num(130),fill:i===2?C.crimson:C.paper,...SH});});
  A(.95*prog(t,53.6,54.0));txt('Tell us in the comments.',84,960,{font:F.ital(52),...SH});
}

/* ---------- the city along the bottom, rising for the ending ---------- */
function drawCity(t){
  const r=E.io(prog(t,51.1,51.9));
  const base=lerp(1990,1700,r),sy=lerp(.78,1,r),lit=lerp(.55,1,r);
  BA=1;if(base<H){A(1);ctx.fillStyle='#05070C';ctx.fillRect(0,base,W,H-base);}
  skyline(base,sy,lit,lerp(.85,1,r),[['90,120,220',.26],['255,140,80',.25*r]]);
}

const SC=[[0,6.45,sceneA],[6.3,12.45,sceneB],[12.3,23.35,sceneC],[23.2,28.25,sceneD],[28.0,39.05,sceneE],[38.9,44.05,sceneF],[43.9,51.35,sceneG],[51.1,56,sceneH]];
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
