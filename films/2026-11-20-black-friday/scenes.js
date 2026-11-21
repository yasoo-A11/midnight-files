'use strict';
/* Black Friday: the name was an insult.  Scenes for the Midnight Files engine (1080x1920, 30 fps, 57 s). */
HEAD.splice(0,HEAD.length,
  [5.9,14.1,'24 September 1869','The Gold Room, New York'],
  [14.75,18.05,'The 1950s','Almost a century later'],
  [18.25,24.2,'The day after Thanksgiving','Center City, Philadelphia'],
  [24.5,32.7,'Philadelphia Police','Traffic squad'],
  [33.0,38.4,'1961','Philadelphia merchants'],
  [38.8,45.7,'The 1980s','A new official story'],
  [46.0,51.9,'Thanksgiving weekend, 2025','United States']);
FLASH.splice(0,FLASH.length,[4.47,.03,.4,'255,60,70',.5],[13.2,.05,.5,'255,60,70',.6],[23.4,.04,.4,'255,60,70',.45],[30.4,.05,.45,'255,250,240',.35],
  [36.3,.05,.4,'255,200,140',.4],[45.0,.05,.5,'255,200,140',.45]);
SHAKE.splice(0,SHAKE.length,[4.47,.4,14],[13.2,.55,20],[23.4,.45,14],[30.4,.3,7],[37.55,.3,7],[45.0,.35,10]);

/* ================= background schedule ================= */
function glParams(t){
  const star=kf(t,[[0,.5],[5.4,.5],[6,.22],[14.2,.22],[14.8,.95],[24.2,.95],[24.6,.5],[45.8,.5],[46.2,.85],[57,.85]]);
  let sun=[0,0,1,0],boil=1;
  if(t>=5.5&&t<14.5){sun=[540,1790,560,kf(t,[[5.5,0],[6.3,1],[13.15,1],[13.5,.22],[14.5,0]])];boil=1.5;}
  return {aur:0,red:.9,base:.5,span:.4,star,glow:1,sun,flare:0,spots:0,boil};
}

/* ================= shared pieces ================= */
const SH={glow:'rgba(0,0,0,.85)',blur:26};
function wipe(x,y,w,h,p,fn){if(p<=0)return;ctx.save();ctx.beginPath();ctx.rect(x,y,w*p,h);ctx.clip();fn();ctx.restore();}
function card(x,y,w,h,rot,a,fn){if(a<=0)return;ctx.save();ctx.translate(x,y);ctx.rotate(rot);A(a);ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=34;ctx.shadowOffsetY=14;
  const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#F7F0DE');g.addColorStop(1,'#E2D6B9');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;fn();ctx.restore();}
function stamp(cx,cy,rot,w,h,p,lines,col=C.deep,back=null){if(p<=0)return;const s=1+1.4*(1-E.o5(p));ctx.save();ctx.translate(cx,cy);ctx.rotate(rot);ctx.scale(s,s);
  if(back){A(Math.min(1,p*3));ctx.fillStyle=back;ctx.fillRect(-w/2,-h/2,w,h);}A(Math.min(1,p*3)*.93);ctx.strokeStyle=col;ctx.lineJoin='miter';ctx.lineWidth=10;ctx.strokeRect(-w/2,-h/2,w,h);ctx.lineWidth=3;ctx.strokeRect(-w/2+17,-h/2+17,w-34,h-34);
  for(const l of lines)txt(l[0],0,l[1],{font:l[2],align:'center',base:'middle',fill:col,ls:l[3]||0});ctx.restore();}
const LROWS=[['Nov. 3','Stock','412.60'],['Nov. 9','Wages','1,204.15'],['Nov. 14','Rent','380.00'],['Nov. 17','Freight','96.45'],['Nov. 21','Stock','2,310.80'],['Nov. 24','Wages','1,198.30']];
function ledger(x,y,rot,a,rowP,inkP,finalP,noteP){
  card(x,y,860,740,rot,a,()=>{
    txt('Ledger',44,86,{font:F.ital(66),fill:C.ink});txt('November',816,86,{font:F.ital(44),fill:C.ink,align:'right'});
    ctx.fillStyle='rgba(18,14,11,.6)';ctx.fillRect(40,110,780,3);
    ctx.fillStyle='rgba(18,14,11,.15)';for(let i=0;i<8;i++)ctx.fillRect(40,196+i*72,780,2);
    ctx.fillStyle='rgba(196,18,47,.38)';ctx.fillRect(196,110,2,596);ctx.fillRect(566,110,2,596);
    LROWS.forEach((r,i)=>{const p=clamp(rowP*LROWS.length-i);if(p<=0)return;const yy=180+i*72,bk=clamp(inkP*LROWS.length-i);
      wipe(40,yy-58,780,74,E.o(p),()=>{txt(r[0],52,yy,{font:F.rom(40),fill:C.ink});txt(r[1],216,yy,{font:F.ital(46),fill:C.ink});
        txt('− '+r[2],802,yy,{font:F.num(52),fill:C.deep,align:'right'});
        if(bk>0)wipe(566,yy-58,254,74,bk,()=>txt('− '+r[2],802,yy,{font:F.num(52),fill:C.ink,align:'right'}));});});
    if(finalP>0)wipe(40,566,780,84,finalP,()=>{ctx.fillStyle='rgba(18,14,11,.6)';ctx.fillRect(566,570,254,3);txt('Nov. 27',52,630,{font:F.romB(40),fill:C.ink});
      txt('Friday sales',216,630,{font:F.ital(46),fill:C.ink});txt('+ 9,870.00',802,630,{font:F.romB(56),fill:C.ink,align:'right'});});
    if(noteP>0)wipe(280,650,560,74,noteP,()=>txt('“in the black”',802,704,{font:F.ital(52),fill:C.ink,align:'right'}));
  });}

/* ================= A: the cover story (0 - 5.6) ================= */
function sceneA(t){
  BA=env(t,-1,5.7,.01,.25);
  A(1);txt('Black Friday',76,338,{font:F.num(150),...SH});
  A(.9);txt('the day stores go “into the black”?',84,404,{font:F.ital(50),...SH});
  ledger(110,452,-.035,1,prog(t,-.45,2.5),0,E.o(prog(t,2.75,3.5)),prog(t,3.45,4.0));
  stamp(540,830,-.2,800,220,prog(t,4.43,4.75),[['COVER STORY',6,F.slab(104,900),5]]);
}

/* ================= B: the first Black Friday, 1869 (5.5 - 14.4) ================= */
const GOLD=(()=>{const k=[[0,131],[.1,132.4],[.2,134],[.3,133.2],[.42,136.5],[.52,138],[.6,141],[.68,144.5],[.74,150],[.8,162],[.825,160.6],[.86,133],[.92,134.6],[1,133.4]],pts=[];
  for(let i=0;i<=240;i++){const u=i/240;let j=1;while(j<k.length-1&&k[j][0]<u)j++;const a=k[j-1],b=k[j],v=(u-a[0])/(b[0]-a[0]);
    const pr=lerp(a[1],b[1],v)+(u<.78?1.1*Math.sin(u*70)+1.6*(vn(u*48)-.5):0);pts.push([130+u*820,1130-(pr-128)*15.5]);}return pts;})();
const HAT=[P('M-46,0 L-40,-112 Q0,-124 40,-112 L46,0'),P('M-88,2 Q0,26 88,2 Q0,-12 -88,2 Z'),P('M-44,-28 Q0,-16 44,-28')];
function sceneB(t){
  BA=env(t,5.5,14.45,.25,.25);
  const fo=1-prog(t,8.95,9.35),p0=E.o(prog(t,5.65,6.05)),p1=E.o5(prog(t,5.95,6.6)),p2=E.o(prog(t,6.85,7.3));
  if(fo>0){A(fo);wipe(60,330,500,120,p0,()=>txt('The first',84,420,{font:F.ital(88),...SH}));
    wipe(40,420,1000,200,p1,()=>txt('Black Friday',76,580,{font:F.num(170),...SH}));
    A(fo*p2);txt('was a disaster.',84,676,{font:F.ital(84),fill:C.crimson,...SH});
    const py=E.o5(prog(t,7.85,8.3));if(py>0){const sc=1+.35*(1-py);ctx.save();ctx.translate(540,1010);ctx.scale(sc,sc);A(fo*py);txt('1869',0,0,{font:F.slab(300,900),align:'center',fill:C.hot,glow:C.amber,blur:70});ctx.restore();}}
  const ci=prog(t,9.2,9.7);if(ci<=0)return;
  for(const pr of [130,140,150,160]){const y=1130-(pr-128)*15.5;A(.16*ci);ctx.fillStyle=C.paper;ctx.fillRect(130,y,820,2);A(.6*ci);txt('$'+pr,112,y+11,{font:F.num(34),align:'right'});}
  A(.7*ci);txt('Price of gold, New York',130,1196,{font:F.ital(36),...SH});
  const u=kf(t,[[9.4,0],[12.2,.8],[13.15,.8],[13.42,.86],[14.1,1]]);
  A(ci);glowLine(()=>strokeRange(GOLD,0,Math.min(u,.8)),C.amber,9,26,C.hot);
  if(u>.8)glowLine(()=>strokeRange(GOLD,.8,u),C.crimson,10,30,'#FFD0D0');
  const hd=ptAt(GOLD,u);A(ci);ctx.fillStyle=u>.8?C.crimson:C.hot;ctx.beginPath();ctx.arc(hd[0],hd[1],11,0,7);ctx.fill();
  [['Jay Gould',230,9.5],['Jim Fisk',510,9.9]].forEach(([nm,x,ts])=>{const p=E.o(prog(t,ts,ts+.7));if(p<=0)return;ctx.save();ctx.translate(x,470);A(p);ink(4.5);strokeSet(HAT,p,.5);ctx.restore();
    A(.9*p);txt(nm,x,548,{font:F.ital(46),align:'center',...SH});});
  const pk=E.o5(prog(t,12.15,12.5));if(pk>0){A(pk*(1-.6*prog(t,13.2,13.6)));txt('$162',800,556,{font:F.slab(84,900),align:'center',fill:C.hot,glow:C.amber,blur:40});}
  const cr=E.o5(prog(t,13.38,13.7));if(cr>0){A(cr);txt('$133',1000,1072,{font:F.slab(84,900),align:'right',fill:C.crimson,glow:'rgba(0,0,0,.9)',blur:20});txt('within minutes',1000,1120,{font:F.ital(40),align:'right',...SH});}
  sparks(786,603,13.18,t,{n:46,life:.8,color:C.crimson,dir:Math.PI/2,spread:1.6,sp:560,g:500,seed:7});
}

/* ================= C: Philadelphia, the day after Thanksgiving (14.35 - 24.4) ================= */
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
/* one city for the whole film: low on the horizon, rising for the Philadelphia shot and for the ending */
function drawCity(t){
  const a0=t<5.7?1-prog(t,5.45,5.7):prog(t,14.3,14.9);if(a0<=0)return;
  const r1=E.io(prog(t,16.55,17.5))*(1-E.io(prog(t,18.0,18.7))),r2=E.io(prog(t,52.05,52.75));
  const base=lerp(lerp(1990,1240,r1),1700,r2),sy=lerp(lerp(.78,1,r1),1,r2),lit=lerp(lerp(.55,.9,r1),1,r2),a=a0*lerp(.85,1,Math.max(r1,r2));
  BA=1;
  if(base<H){                                                                   // the river: a rippled reflection
    A(a);ctx.fillStyle='#05070C';ctx.fillRect(0,base,W,H-base);
    ctx.save();ctx.beginPath();ctx.rect(0,base,W,H-base);ctx.clip();
    ctx.save();ctx.translate(0,2*base);ctx.scale(1,-1);skyline(base,sy*.62,lit*.8,a*.42,[['255,140,80',.5*r1],['90,120,220',.3*r2]]);ctx.restore();
    const g=ctx.createLinearGradient(0,base,0,base+620);g.addColorStop(0,'rgba(5,7,12,.1)');g.addColorStop(1,'rgba(5,7,12,1)');A(a);ctx.fillStyle=g;ctx.fillRect(0,base,W,H-base);
    ctx.fillStyle='#05070C';for(let k=0,y=base+7;y<H;k++){const hh=2+1.6*(1+Math.sin(k*2.1+t*1.6));A(a*(.55+.25*Math.sin(k*1.3-t*1.1)));ctx.fillRect(0,y,W,hh);y+=7+k*.35+hh;}
    ctx.restore();
    A(a*.5);ctx.fillStyle=C.paper;ctx.fillRect(0,base,W,1.5);
  }
  skyline(base,sy,lit,a,[['90,120,220',.26*(1-r1)+.04*r2],['255,140,80',.42*r1]]);
}
const GX0=110,GY0=440,GW=860,GH=790,GN=11,GCX=540,GCY=835;                      // Center City street grid, seen from above
const STREETS=(()=>{const s=[];for(let i=0;i<GN;i++){const x=GX0+GW*i/(GN-1);s.push({v:1,c:x,a:GY0,b:GY0+GH,m:GCY,d:Math.abs(x-GCX),main:i===5,i});}
  for(let i=0;i<GN;i++){const y=GY0+GH*i/(GN-1);s.push({v:0,c:y,a:GX0,b:GX0+GW,m:GCX,d:Math.abs(y-GCY),main:i===5,i:i+GN});}return s;})();
const sline=(st,u0,u1)=>{ctx.beginPath();if(st.v){ctx.moveTo(st.c,u0);ctx.lineTo(st.c,u1);}else{ctx.moveTo(u0,st.c);ctx.lineTo(u1,st.c);}ctx.stroke();};
function sceneC(t){
  BA=env(t,14.35,24.45,.25,.25);
  const yc=env(t,14.5,16.9,.2,.35);
  if(yc>0){const pp=prog(t,14.65,16.35),yr=Math.round(lerp(1869,1950,E.io(pp)));A(yc);txt(pp>=1?'1950s':String(yr),540,860,{font:F.slab(280,900),align:'center',fill:C.hot,glow:C.amber,blur:60});
    A(yc*.2);ctx.fillStyle=C.paper;ctx.fillRect(200,931,680,3);A(yc*.7);ctx.fillStyle=C.amber;ctx.fillRect(200,930,680*E.io(pp),5);}
  // establishing shot: the city rises (drawCity) and the name writes itself
  const ph=env(t,16.85,18.3,.5,.3);if(ph>0){A(ph);wipe(40,380,1000,200,E.o5(prog(t,16.9,17.5)),()=>txt('Philadelphia',74,540,{font:F.num(168),...SH}));}
  const gp=E.o(prog(t,18.2,19.3));if(gp<=0)return;
  // the street grid draws on
  STREETS.forEach((st,k)=>{const p=clamp(gp*1.6-(k%GN)/GN*.6);A(st.main?.5:.26);ink(st.main?5:2.5,C.paper);sline(st,st.a,lerp(st.a,st.b,p));});
  A(.9*gp);ctx.fillStyle='#0A0D14';ctx.fillRect(GCX-24,GCY-24,48,48);ink(3,C.paper);ctx.strokeRect(GCX-24,GCY-24,48,48);A(.8*gp);txt('City Hall',GCX+36,GCY-34,{font:F.ital(34),...SH});
  // cars pour in from every side
  const R=kf(t,[[19.9,0],[21.5,190],[22.6,360],[23.35,760]]);
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.shadowColor='#FFC36B';ctx.shadowBlur=14;ctx.fillStyle='#FFE2A6';
  STREETS.forEach((st,k)=>{const Rs=R*(.72+.56*rnd(k*3.3)),half=Rs>st.d?Math.sqrt(Rs*Rs-st.d*st.d):0,t0=19.45+rnd(k*5.1)*.5;if(t<t0)return;
    for(const dir of [1,-1]){const end=dir>0?st.a:st.b,L=Math.abs(st.m-end)-half;if(L<=6)continue;const head=(t-t0)*250,n=Math.min(12,Math.floor(head/78));
      for(let q=0;q<=n;q++){const sd=(head-q*78)%(L+78);if(sd<0||sd>L)continue;const u=end+dir*sd;A(.9*Math.min(1,sd/40));ctx.beginPath();if(st.v)ctx.arc(st.c,u,5.5,0,7);else ctx.arc(u,st.c,5.5,0,7);ctx.fill();}}});
  ctx.restore();
  // the jam spreads out from the centre
  STREETS.forEach((st,k)=>{const Rs=R*(.72+.56*rnd(k*3.3));if(Rs<=st.d)return;const half=Math.sqrt(Rs*Rs-st.d*st.d),u0=Math.max(st.a,st.m-half),u1=Math.min(st.b,st.m+half);
    A(1);glowLine(()=>sline(st,u0,u1),C.crimson,st.main?11:7,20,'#FFC2C8');});
  const lo=1-prog(t,23.15,23.35),l1=E.o(prog(t,21.65,22.0))*lo,l2=E.o(prog(t,22.35,22.7))*lo;
  A(l1);txt('shoppers',84,408-(1-l1)*20,{font:F.ital(70),...SH});
  A(l2);txt('football fans',996,408-(1-l2)*20,{font:F.ital(70),align:'right',...SH});
  stamp(540,835,-.07,760,190,prog(t,23.3,23.6),[['GRIDLOCK',6,F.slab(118,900),8]],C.crimson,'rgba(6,8,14,.88)');
}

/* ================= D: the police name it (24.35 - 32.9) ================= */
const BADGE=[P('M0,-150 C52,-112 104,-108 132,-112 C138,-10 112,96 0,160 C-112,96 -138,-10 -132,-112 C-104,-108 -52,-112 0,-150 Z'),P('M0,-74 L18,-22 L72,-22 L28,10 L44,62 L0,30 L-44,62 L-28,10 L-72,-22 L-18,-22 Z')];
const SWASH=P('M80,1052 C300,1016 720,1094 1000,1036');
function badge(x,y,s,p,a){if(p<=0||a<=0)return;ctx.save();ctx.translate(x,y);ctx.scale(s,s);A(a);ctx.shadowColor=C.blue;ctx.shadowBlur=22;ink(5/s,C.blue);strokeSet(BADGE,p,.4);ctx.restore();}
function sceneD(t){
  BA=env(t,24.35,32.95,.2,.25);
  const dim=1-prog(t,28.85,29.5),b0=BA;
  badge(290,560,1,E.io(prog(t,24.45,25.5)),dim);
  card(620,372,320,300,.05,dim*E.o(prog(t,24.55,24.95)),()=>{ctx.fillStyle=C.deep;ctx.fillRect(0,0,320,86);txt('NOVEMBER',160,58,{font:F.slab(40,800),fill:'#F7F0DE',align:'center',ls:3});
    txt('FRI',160,226,{font:F.slab(140,900),fill:C.ink,align:'center'});});
  BA=b0*dim;stamp(786,648,-.2,372,112,prog(t,25.4,25.7),[['NO LEAVE',4,F.slab(58,900),4]]);BA=b0;
  [['long shifts','12 hours',25.95],['traffic','jammed streets',26.95],['shoplifters','crowded stores',27.75]].forEach(([s,d,ts],i)=>{const p=E.o(prog(t,ts,ts+.35));if(p<=0)return;const y=850+i*118;
    A(dim*p);ctx.fillStyle=C.crimson;ctx.fillRect(84,y-56,24,56);wipe(120,y-92,900,124,p,()=>txt(s,134,y,{font:F.slab(86,800),...SH}));A(dim*p*.72);txt(d,996,y-8,{font:F.ital(42),align:'right',...SH});});
  const n0=E.o5(prog(t,30.3,30.8)),n1=E.o5(prog(t,30.6,31.15));
  A(1);wipe(40,500,1000,300,n0,()=>txt('Black',76,740,{font:F.num(290),...SH}));wipe(40,770,1000,300,n1,()=>txt('Friday',76,1000,{font:F.num(290),...SH}));
  const us=prog(t,31.1,31.5);if(us>0){A(1);ink(11,C.crimson);drawOn(SWASH,E.o(us));}
  A(prog(t,31.6,31.95));txt('not a compliment.',84,1170,{font:F.ital(76),fill:C.crimson,...SH});
}

/* ================= E: "Big Friday", 1961 (32.85 - 38.6) ================= */
const MQ={x:120,y:470,w:840,h:440};
const BULBS=(()=>{const b=[],n1=15,n2=8;for(let i=0;i<=n1;i++)b.push([MQ.x+MQ.w*i/n1,MQ.y]);for(let i=1;i<=n2;i++)b.push([MQ.x+MQ.w,MQ.y+MQ.h*i/n2]);
  for(let i=1;i<=n1;i++)b.push([MQ.x+MQ.w-MQ.w*i/n1,MQ.y+MQ.h]);for(let i=1;i<n2;i++)b.push([MQ.x,MQ.y+MQ.h-MQ.h*i/n2]);return b;})();
function sceneE(t){
  BA=env(t,32.85,38.65,.2,.25);
  const old=env(t,32.9,34.75,.2,.35);
  if(old>0){A(old);txt('Black Friday',540,640,{font:F.num(150),align:'center',...SH});
    ink(14,C.crimson);seg(110,548,970,668,E.o(prog(t,33.25,33.5)));seg(110,668,970,548,E.o(prog(t,33.5,33.75)));}
  const yr=env(t,34.2,35.2,.25,.3);if(yr>0){A(yr);txt('1961',540,1010,{font:F.slab(230,900),align:'center',fill:C.hot,glow:C.amber,blur:50});}
  const on=prog(t,35.15,36.1);if(on<=0)return;
  const dead=prog(t,37.5,38.1),rot=-.07*E.o(prog(t,37.55,37.95)),drop=46*E.o(prog(t,37.55,37.95)),f30=Math.floor(t*30+.5);
  ctx.save();ctx.translate(MQ.x,MQ.y);ctx.rotate(rot);ctx.translate(-MQ.x,-MQ.y+drop);
  const lit=E.o5(prog(t,36.25,36.6)),flick=dead>0?(rnd(f30*1.9)>.45?1:.35)*(1-.8*dead):1;
  if(lit>0){ctx.save();ctx.translate(540,690);ctx.globalCompositeOperation='lighter';ctx.fillStyle=C.amber;for(let k=0;k<18;k++){const a=k/18*Math.PI*2+t*.25;A(.10*lit*flick);ctx.beginPath();ctx.moveTo(0,0);
    ctx.lineTo(Math.cos(a-.045)*900,Math.sin(a-.045)*900);ctx.lineTo(Math.cos(a+.045)*900,Math.sin(a+.045)*900);ctx.closePath();ctx.fill();}ctx.restore();}
  A(.95*on);ctx.fillStyle='#090B11';ctx.beginPath();ctx.roundRect(MQ.x,MQ.y,MQ.w,MQ.h,36);ctx.fill();A(on);ink(5,C.amber);ctx.beginPath();ctx.roundRect(MQ.x,MQ.y,MQ.w,MQ.h,36);ctx.stroke();
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.shadowColor=C.amber;ctx.shadowBlur=18;ctx.fillStyle='#FFE2A6';
  BULBS.forEach((b,i)=>{const bo=clamp(on*BULBS.length-i);if(bo<=0)return;const td=37.5+rnd(i*3.7)*.55;let v=((i+Math.floor(t*9))%3===0)?1:.38;if(t>td)v=.05;else if(t>td-.12)v=rnd(f30+i)>.5?1:.1;
    A(bo*v);ctx.beginPath();ctx.arc(b[0],b[1],9,0,7);ctx.fill();});
  ctx.restore();
  if(lit>0){const sc=1+.3*(1-lit);ctx.save();ctx.translate(540,690);ctx.scale(sc,sc);A(lit*flick);txt('BIG',0,-10,{font:F.slab(250,900),align:'center',fill:C.hot,glow:C.amber,blur:50});
    txt('FRIDAY',0,150,{font:F.slab(150,900),align:'center',fill:C.hot,glow:C.amber,blur:40,ls:6});ctx.restore();}
  ctx.restore();
}

/* ================= F: the story is rewritten (38.55 - 45.9) ================= */
function sceneF(t){
  BA=env(t,38.55,45.95,.2,.25);
  const out=E.io(prog(t,42.75,43.2)),a1=1-out;
  card(110,400-70*out,860,560,.022,a1*E.o(prog(t,38.6,39.0)),()=>{
    txt('RETAIL NEWS',430,72,{font:F.slab(34,800),align:'center',fill:C.ink,ls:8});ctx.fillStyle='rgba(18,14,11,.6)';ctx.fillRect(40,96,780,3);ctx.fillRect(40,104,780,1);
    wipe(40,120,780,150,E.o5(prog(t,40.25,40.85)),()=>txt('BLACK FRIDAY',430,236,{font:F.slab(108,900),align:'center',fill:C.ink}));
    A(BA*0+a1*prog(t,39.0,39.4));txt('the day the police dread',430,336,{font:F.ital(56),align:'center',fill:C.ink});
    const sp=E.o(prog(t,41.45,41.8));if(sp>0){A(a1);ink(7,C.deep);seg(110,320,750,316,sp);}
    const s='The day stores go “into the black”',nch=Math.round(s.length*prog(t,41.75,42.75));
    if(nch>0){A(a1);ctx.font=F.slab(44,700);const fw=ctx.measureText(s).width;txt(s.slice(0,nch),430-fw/2,434,{font:F.slab(44,700),fill:C.ink});}
    A(a1*.14);ctx.fillStyle=C.ink;for(let i=0;i<3;i++)ctx.fillRect(60,476+i*24,i===2?470:740,9);
  });
  const lin=E.o(prog(t,42.8,43.25));
  if(lin>0)ledger(110,452+(1-lin)*260,-.035,lin,1,prog(t,43.2,44.5),1,1);
  stamp(540,850,-.12,600,210,prog(t,44.9,45.2),[['PROFIT',6,F.slab(128,900),8]],C.ink);
}

/* ================= G: 200 million shoppers (45.9 - 52.1) ================= */
function sceneG(t){
  BA=env(t,45.9,52.15,.2,.25);
  const v=202.9*E.o(prog(t,46.9,48.4)),red=prog(t,50.1,51.0);
  A(prog(t,46.7,47.0));txt(v.toFixed(1),80,640,{font:F.slab(236,900),fill:C.hot,glow:C.amber,blur:50});
  A(prog(t,47.0,47.4));txt('million shoppers',86,726,{font:F.slab(76,800),...SH});
  for(let i=0;i<203;i++){const c=i%20,r=Math.floor(i/20),x=140+c*42.1,y=796+r*39.5,tf=46.9+i/203*1.5,p=E.o5(prog(t,tf,tf+.25)),rc=clamp(red*1.4-c/20*.4);
    if(p<=0){A(.14);ctx.fillStyle=C.paper;ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill();continue;}
    A(p);ctx.fillStyle=rc>.5?C.crimson:'#FFC36B';ctx.beginPath();ctx.arc(x,y,12.5*(1+.5*(1-p)),0,7);ctx.fill();}
  A(.75*prog(t,48.3,48.8));txt('One dot is one million people. Source: National Retail Federation.',84,1250,{font:F.ital(32),...SH});
  badge(900,440,.55,E.io(prog(t,49.4,50.4)),1);
}

/* ================= H: the question (52.05 - 57) ================= */
function sceneH(t){
  BA=env(t,52.05,57.3,.25,.1);
  const nf=(rnd(Math.floor(t*11)*.37)>.14?1:.3)*prog(t,52.2,52.6);
  ctx.save();ctx.globalCompositeOperation='lighter';A(.9*nf);ctx.shadowColor=C.crimson;ctx.shadowBlur=30;ink(6,C.crimson);ctx.beginPath();ctx.roundRect(650,1014,300,116,18);ctx.stroke();ctx.restore();
  A(nf);txt('SALE',800,1102,{font:F.slab(84,900),align:'center',fill:C.crimson,glow:C.crimson,blur:30,ls:6});
  [['What else',52.25],['were you sold',52.6],['that was never',53.4],['true?',54.0]].forEach(([s,ts],i)=>{const q=E.o(prog(t,ts,ts+.45));if(q<=0)return;A(q);
    txt(s,78,450+i*132+(1-q)*30,{font:F.num(132),fill:i===3?C.crimson:C.paper,...SH});});
  A(.95*prog(t,54.9,55.3));txt('Tell us in the comments.',84,934,{font:F.ital(52),...SH});
}

/* ================= master ================= */
const SC=[[0,5.7,sceneA],[5.5,14.45,sceneB],[14.35,24.45,sceneC],[24.35,32.95,sceneD],[32.85,38.65,sceneE],[38.55,45.95,sceneF],[45.9,52.15,sceneG],[52.05,57.3,sceneH]];
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
window.EVENTS={};
window.READY=true;
