'use strict';
/* ================= background schedule ================= */
function glParams(t){
  const aur=kf(t,[[0,0],[3.9,0],[5.5,.12],[5.95,.55],[6.8,1],[7.75,1],[8.15,0],[17.2,0],[17.45,1.1],[19.9,1],[20.2,.42],[22.5,.42],[22.8,.95],[25.3,.95],[25.6,.22],[31.4,.22],[31.8,.8],[37.8,.8],[38.1,.12],[42.4,.12],[42.7,0],[48.8,0],[49.1,.16],[52.0,.16],[52.6,.6],[55.6,1.05],[57.3,.95],[58,.3]]);
  const base=kf(t,[[0,.56],[5.5,.56],[6.4,.47],[8.2,.47],[17.3,.42],[19.9,.40],[20.2,.55],[22.6,.55],[22.9,.46],[25.4,.46],[25.7,.80],[37.8,.80],[38.1,.82],[48.9,.82],[49.1,.74],[52,.74],[52.6,.54],[58,.52]]);
  const span=kf(t,[[0,.42],[17.3,.42],[17.6,.5],[19.9,.5],[20.2,.4],[25.5,.42],[25.7,.3],[31.4,.3],[31.8,.38],[52,.38],[52.6,.46],[58,.46]]);
  const red=kf(t,[[0,.95],[52,.95],[53.2,.72],[58,.72]]);
  let sun=[0,0,1,0],flare=0,spots=0,boil=1;
  if(t>=7.9&&t<14.08){sun=[540,720,350,kf(t,[[7.9,0],[8.5,1],[14.08,1]])];spots=1;flare=kf(t,[[10.9,0],[11.35,.7],[12.2,1.35],[13.2,1.7],[13.9,2.6]]);}
  else if(t>=14.08&&t<17.6){sun=[640,470,150,kf(t,[[14.08,1],[17.42,1],[17.6,0]])];}
  else if(t>=37.9&&t<42.5){sun=[540,1560,560,kf(t,[[37.9,0],[38.4,1],[42.2,1],[42.5,0]])];boil=1.6;}
  else if(t>=42.5&&t<49.0){sun=[540,760,64,kf(t,[[42.5,0],[42.95,1],[48.8,1],[49.0,0]])];}
  const star=clamp(1-.6*aur)*(sun[3]>0&&sun[2]>300?.5:1);
  return {aur,red,base,span,star,glow:1,sun,flare,spots,boil};
}
const bez=(u,p0,p1,p2,p3)=>{const v=1-u;return [v*v*v*p0[0]+3*v*v*u*p1[0]+3*v*u*u*p2[0]+u*u*u*p3[0],v*v*v*p0[1]+3*v*v*u*p1[1]+3*v*u*u*p2[1]+u*u*u*p3[1]];};

/* ================= A1: the desk (0 - 5.7) ================= */
const S1=morse('-.-. --.- -.. .',.045,.95).filter(v=>v[1]<2.66),S2=morse('.- ..- .-. --- .-. .-',.05,4.08);
const DROPR=samplePath('M820,1090 C868,1042 955,1070 955,960 L955,-40',80).reverse();
function sceneA1(t){
  const w=E.io(prog(t,5.5,6.0));if(w>=1)return;ctx.translate(0,w*2200);
  const d=E.o(prog(t,-.3,1.05));
  ctx.font=F.num(330);ctx.textBaseline='alphabetic';ctx.textAlign='left';let x=64;
  for(let i=0;i<4;i++){const ch='1859'[i],p=E.o5(prog(t,-.34+i*.1,.2+i*.1));A(p);ctx.fillStyle=C.paper;ctx.fillText(ch,x,640+(1-p)*70);x+=ctx.measureText(ch).width;}
  A(.5);ink(2);seg(70,692,730,692,E.o(prog(t,.1,1.0)));
  A(.9);ink(3.2);seg(40,1180,1040,1180,d);
  A(.32);ink(2);for(let i=0;i<24;i++){const hx=60+i*42;seg(hx,1192,hx-22,1230,clamp(d*2-i/24));}
  // battery
  const dis=prog(t,2.75,2.95),off=prog(t,2.9,3.3);
  ctx.save();ctx.translate(70,948);A(1-.6*off);drawBattery(d);ctx.restore();
  const K=[502,1090],e=E.back(dis),ex=K[0]-52*e,ey=K[1]-92*e;
  A(1-.45*off);ink(3.2);ctx.setLineDash(d<1?[380*d,420]:[]);
  ctx.beginPath();ctx.moveTo(344,936);ctx.bezierCurveTo(430,860,ex+6,ey-150+40*e,ex,ey);ctx.stroke();ctx.setLineDash([]);
  if(d>=1){ctx.beginPath();ctx.arc(ex,ey,7,0,7);ctx.stroke();}
  if(t>.7&&t<2.78){const ca=env(t,.7,2.78,.3,.05);ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=0;i<5;i++){const u=(t*.9+i/5)%1,q=bez(u,[344,936],[430,860],[508,940],[502,1090]);A(ca*Math.sin(Math.PI*u));ctx.fillStyle=C.amber;ctx.shadowColor=C.amber;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(q[0],q[1],5,0,7);ctx.fill();}
    ctx.restore();}
  // key
  const down=t<2.7?keyDown(t,S1):keyDown(t,S2);
  ctx.save();ctx.translate(430,954);ctx.scale(.82,.82);A(1);drawKey(d,-down*.045,3.9);ctx.restore();
  // pole + drop wire
  A(.8);ink(3);seg(971,1180,971,-40,d);seg(989,1180,989,-40,d);
  A(1);ink(3);strokeRange(DROPR,1-d,1);
  A(.7);ink(2.4);for(let y=880;y>0;y-=160)seg(955,y,971,y,d);
  // aurora current arriving down the line
  const g=prog(t,3.95,4.5);
  if(g>0){A(.55*g);glowLine(()=>strokePts(DROPR),C.crimson,7,26);
    for(const [a,b] of S2){const u1=1-(b-t)*1.5,u2=1-(a-t)*1.5;if(u2<=0||u1>=1)continue;A(g);glowLine(()=>strokeRange(DROPR,u1,u2),C.green,7,22,C.hot);}
    const kd=keyDown(t,S2);A(g*(.35+.65*kd));ctx.save();ctx.globalCompositeOperation='lighter';const rg=ctx.createRadialGradient(820,1090,0,820,1090,100);
    rg.addColorStop(0,'rgba(99,255,194,.75)');rg.addColorStop(1,'rgba(99,255,194,0)');ctx.fillStyle=rg;ctx.fillRect(720,990,200,200);ctx.restore();}
  // unplug
  sparks(K[0],K[1],2.76,t,{n:16,seed:3,sp:420,life:.45,size:3.5});
  const st=E.o(prog(t,2.95,3.25));if(st>0){A(.95);ink(6,C.crimson);seg(52,930,412,1192,st);}
  const lb=prog(t,.9,1.3)*(1-prog(t,2.85,3.05));if(lb>0){A(.75*lb);txt('battery',72,1238,{font:F.ital(46)});}
  const lb2=prog(t,3.05,3.3);if(lb2>0){A(lb2);txt('disconnected',72,1240,{font:F.ital(56),fill:C.crimson});}
}

/* ================= A2: the line under the sky (5.5 - 8.1) ================= */
const POLES=[];for(let n=-1;n<=6;n++){const k=Math.pow(.6,n);POLES.push({x:30+830*k,y:1215-795*k,s:1.45*k});}
const SLOTS=[[-82,12],[-34,12],[34,12],[82,12],[-58,74],[58,74]];
const WIRES=SLOTS.map(sl=>{const pts=[],sc=[];
  for(let n=POLES.length-1;n>0;n--){const a=POLES[n],b=POLES[n-1],ax=a.x+sl[0]*a.s,ay=a.y+sl[1]*a.s,bx=b.x+sl[0]*b.s,by=b.y+sl[1]*b.s,mx=(ax+bx)/2,my=(ay+by)/2+92*b.s;
    for(let i=0;i<16;i++){const u=i/16,v=1-u;pts.push([v*v*ax+2*u*v*mx+u*u*bx,v*v*ay+2*u*v*my+u*u*by]);sc.push(lerp(a.s,b.s,u));}}
  const l=POLES[0];pts.push([l.x+sl[0]*l.s,l.y+sl[1]*l.s]);sc.push(l.s);return {pts,sc};});
const HILLS=(()=>{const p=new Path2D();p.moveTo(-20,2100);for(let x=-20;x<=1100;x+=20)p.lineTo(x,1224+12*Math.sin(x/170)-16*vn(x/110+3));p.lineTo(1100,2100);p.closePath();return p;})();
function strokeChain(wr,wf){const n=wr.pts.length-1;for(let j=0;j<n;j+=16){ctx.lineWidth=wf(wr.sc[Math.min(n,j+8)]);strokePts(wr.pts,j,Math.min(n,j+16));}}
function sceneA2(t){
  const w=E.io(prog(t,5.5,6.0));ctx.translate(0,-(1-w)*2200);
  BA=1-prog(t,7.85,8.12);
  const g=prog(t,5.9,6.7);
  A(1);ctx.fillStyle=C.black;ctx.fill(HILLS);
  A(.95);for(let i=POLES.length-1;i>=1;i--){const p=POLES[i];drawPole(p.x,p.y,p.s,1000);}
  for(let k=0;k<WIRES.length;k++){const wr=WIRES[k];A(.85);ink(2);strokeChain(wr,s=>Math.max(.9,2.4*Math.sqrt(s)));}
  if(g>0){
    for(let k=0;k<WIRES.length;k++){const wr=WIRES[k],n=wr.pts.length-1;
      A(.5*g);ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=C.crimson;ctx.shadowColor=C.crimson;ctx.shadowBlur=18;ctx.lineCap='round';strokeChain(wr,s=>Math.max(1.5,5*Math.sqrt(s)));ctx.restore();
      for(let j=0;j<2;j++){const ph=(t*.36+k*.29+j*.5)%1,u1=ph,u0=ph-.07;const s=wr.sc[Math.min(n,Math.floor(clamp(u1)*n))];
        A(g);glowLine(()=>strokeRange(wr.pts,u0,u1),C.green,Math.max(2,7*Math.sqrt(s)),8+16*Math.sqrt(s),C.hot);}}
    const p1=POLES[1],dx=p1.x+58*p1.s,dy=p1.y+74*p1.s;
    A(.55*g);glowLine(()=>{ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx-10,2000);ctx.stroke();},C.crimson,7,24);
    for(let j=0;j<3;j++){const ph=(t*.9+j/3)%1,y0=dy+ph*1500;A(g);glowLine(()=>{ctx.beginPath();ctx.moveTo(dx-(y0-dy)*.007,y0);ctx.lineTo(dx-(y0+130-dy)*.007,y0+130);ctx.stroke();},C.green,8,24,C.hot);}
  }  A(1);ctx.fillStyle=C.black;ctx.fill(HILLS);
}

/* ================= B: Carrington sees the flare (7.9 - 14.2) ================= */
function sceneB(t){
  BA=env(t,7.95,14.2,.45,.1);
  const cx=540,cy=720,R=350,d=E.o(prog(t,8.1,9.3));
  A(.55);ink(2);ctx.beginPath();ctx.arc(cx,cy,R+18,-Math.PI/2,-Math.PI/2+Math.PI*2*d);ctx.stroke();
  for(let i=0;i<36;i++){if(i/36>d)break;const a=i*10*Math.PI/180-Math.PI/2,r1=R+18,r2=R+(i%3===0?44:30);A(i%3===0?.6:.35);seg(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1,cx+Math.cos(a)*r2,cy+Math.sin(a)*r2);}
  A(.17*d);ink(1.6);
  for(const L of [30,60]){const rx=R*Math.sin(L*Math.PI/180);ctx.beginPath();ctx.ellipse(cx,cy,rx,R,0,-Math.PI/2,Math.PI/2);ctx.stroke();ctx.beginPath();ctx.ellipse(cx,cy,rx,R,0,Math.PI/2,Math.PI*1.5);ctx.stroke();}
  seg(cx,cy-R,cx,cy+R);
  for(const L of [-60,-30,0,30,60]){const y=cy-R*Math.sin(L*Math.PI/180),hw=R*Math.cos(L*Math.PI/180);seg(cx-hw,y,cx+hw,y);}
  const ax=cx+.165*R,ay=cy-.335*R,bx=cx+.27*R,by=cy-.275*R;
  const la=E.o(prog(t,11.15,11.6)),lb=E.o(prog(t,11.55,12.0)),fo=1-prog(t,13.3,13.8);
  if(la>0){A(.9*la*fo);ink(2.2);seg(ax+10,ay-12,810,404,la);A(la*fo);txt('A',818,396,{font:F.ital(60),glow:'rgba(0,0,0,.8)',blur:16});}
  if(lb>0){A(.9*lb*fo);ink(2.2);seg(bx+14,by-6,905,528,lb);A(lb*fo);txt('B',915,528,{font:F.ital(60),glow:'rgba(0,0,0,.8)',blur:16});}
  const q=prog(t,11.75,12.3)*(1-prog(t,13.35,13.8));
  if(q>0){A(q*.95);txt('“two patches of intensely bright',78,1178,{font:F.ital(46)});txt('and white light”',78,1234,{font:F.ital(46)});A(q*.72);txt('R. C. Carrington, 1859',1000,1234,{font:F.rom(34),align:'right'});}
}

/* ================= C: 17.6 hours to Earth (14.05 - 17.6) ================= */
const projG=d3.geoOrthographic().clipAngle(90).precision(.5),pathG=d3.geoPath(projG,ctx);
const LF50=topojson.feature(LAND50,LAND50.objects.land),LF110=topojson.feature(LAND110,LAND110.objects.land),GRAT=d3.geoGraticule().step([15,15])();
function miniEarth(cx,cy,r,lon,lat){
  projG.scale(r).translate([cx,cy]).rotate([-lon,-lat]);
  ctx.save();ctx.globalCompositeOperation='lighter';A(.5);const g=ctx.createRadialGradient(cx,cy,r*.8,cx,cy,r*1.8);g.addColorStop(0,'rgba(127,184,255,.55)');g.addColorStop(1,'rgba(127,184,255,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,r*1.8,0,7);ctx.fill();ctx.restore();
  A(1);ctx.fillStyle='#0B1838';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();
  A(.6);ctx.fillStyle=C.paper;ctx.beginPath();pathG(LF110);ctx.fill();
  A(.9);ink(2);ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.stroke();
}
function sceneC(t){
  BA=env(t,14.05,17.6,.2,.12);
  const sx=640,sy=470,ex=640,ey=1160,p=prog(t,14.55,17.05),R=150+(ey-sy-150-58)*Math.pow(p,.85);
  A(.4);ink(2);ctx.setLineDash([4,14]);seg(sx,sy+190,ex,ey-70,E.o(prog(t,14.15,14.7)));ctx.setLineDash([]);
  A(.72*prog(t,14.4,14.8));txt('150 million km',672,836,{font:F.ital(38)});
  const imp=prog(t,17.0,17.15),rel=1-prog(t,17.15,17.6);
  miniEarth(ex,ey,44,-60,25);
  A(.95);txt('Earth',706,1174,{font:F.romB(46)});
  for(let k=0;k<3;k++){const sq=1-.25*imp*rel,jit=imp*rel*(rnd(Math.floor(t*30)*1.9+k)-.5)*10,rr=(74+k*28)*sq;
    A(imp>0?.9:.45-k*.08);ink(imp>0?4:2.2,imp>0?C.crimson:C.blue);ctx.beginPath();ctx.arc(ex+jit,ey+12*k,rr,Math.PI*1.12,Math.PI*1.88);ctx.stroke();}
  if(p>0){ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    for(let i=0;i<70;i++){const a=Math.PI/2+(rnd(i*3.1)-.5)*.84,f=(rnd(i*7.3)+t*.55)%1,rr=150+(R-150)*(.15+.85*f),L=26+50*rnd(i*1.9);
      A(.55*f*Math.min(1,p*4));ctx.strokeStyle=f>.6?C.crimson:C.amber;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(sx+Math.cos(a)*rr,sy+Math.sin(a)*rr);ctx.lineTo(sx+Math.cos(a)*(rr-L),sy+Math.sin(a)*(rr-L));ctx.stroke();}
    for(let k=0;k<3;k++){const rr=R-k*46;if(rr<160)continue;A((1-k*.3)*Math.min(1,p*5));ctx.strokeStyle=k===0?C.hot:C.crimson;ctx.shadowColor=C.crimson;ctx.shadowBlur=40;ctx.lineWidth=k===0?10:5;
      ctx.beginPath();ctx.arc(sx,sy,rr,Math.PI/2-.42,Math.PI/2+.42);ctx.stroke();}
    ctx.restore();}
  const ta=prog(t,14.3,14.6);A(ta);txt((17.6*p).toFixed(1),72,900,{font:F.num(190)});A(ta*.9);txt('hours',82,972,{font:F.ital(64)});
  A(.82*prog(t,15.45,15.85));txt('Most solar storms',82,1062,{font:F.ital(40)});txt('take days.',82,1110,{font:F.ital(40)});
}

/* ================= D1: the sky turns blood red (17.4 - 20.1) ================= */
function sceneD1(t){
  BA=env(t,17.45,20.1,.15,.2);
  const z=1+.05*prog(t,17.5,20.1);
  ctx.translate(540,1300);ctx.scale(z,z);ctx.translate(-540,0);drawTown();
}

/* ================= D2: as far south as Cuba (19.9 - 22.8) ================= */
const AC=[-70,80];
function sceneD2(t){
  BA=env(t,19.95,22.8,.25,.2);
  const cx=540,cy=760,R=400*(.93+.07*E.o(prog(t,19.95,20.9))),u=E.io(prog(t,20.1,22.3));
  projG.scale(R).translate([cx,cy]).rotate([lerp(76,80,u),-lerp(47,31,u)]);
  A(.94);const g=ctx.createRadialGradient(cx-90,cy-120,40,cx,cy,R);g.addColorStop(0,'#0E1630');g.addColorStop(1,'#04060E');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.fill();
  A(.13);ink(1.2);ctx.beginPath();pathG(GRAT);ctx.stroke();
  A(.10);ctx.fillStyle=C.paper;ctx.beginPath();pathG(LF50);ctx.fill();
  A(.6);ink(1.7);ctx.beginPath();pathG(LF50);ctx.stroke();
  A(.6);ink(2.2);ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
  const r=lerp(22,58.6,E.io(prog(t,20.25,22.0)));
  const cap=d3.geoCircle().center(AC).radius(r).precision(2)(),ring={type:'LineString',coordinates:cap.coordinates[0]};
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.clip();ctx.globalCompositeOperation='lighter';
  A(.2);ctx.fillStyle=C.crimson;ctx.beginPath();pathG(cap);ctx.fill();
  const rays={type:'MultiLineString',coordinates:[]};for(let i=0;i<90;i++){const b=i*4+vn(i*.7+t*.8)*3,l=3+7*vn(i*1.3+t*1.6);rays.coordinates.push([dest(AC,b,r),dest(AC,b,r-l)]);}
  A(.5);ctx.strokeStyle=C.crimson;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();pathG(rays);ctx.stroke();
  A(.95);ctx.shadowColor=C.crimson;ctx.shadowBlur=36;ctx.lineWidth=9;ctx.beginPath();pathG(ring);ctx.stroke();
  ctx.shadowBlur=0;ctx.shadowColor='transparent';A(.9);ctx.strokeStyle=C.hot;ctx.lineWidth=2.5;ctx.beginPath();pathG(ring);ctx.stroke();
  ctx.restore();
  const us=d3.geoCircle().center(AC).radius(22).precision(2)(),ua=prog(t,20.15,20.6);
  A(.6*ua);ink(2);ctx.setLineDash([8,10]);ctx.beginPath();pathG({type:'LineString',coordinates:us.coordinates[0]});ctx.stroke();ctx.setLineDash([]);
  const ul=projG(dest(AC,128,22));if(ul){A(.6*ua);ink(1.8);seg(770,430,ul[0],ul[1],ua);A(.9*ua);txt('where auroras',778,396,{font:F.ital(38),glow:'rgba(0,0,0,.9)',blur:14});txt('usually stay',778,440,{font:F.ital(38),glow:'rgba(0,0,0,.9)',blur:14});}
  const cu=projG([-79.4,21.9]),cb=E.back(prog(t,21.75,22.15));
  if(cu&&cb>0){A(1);ink(3.4,C.hot);ctx.beginPath();ctx.arc(cu[0],cu[1],16*cb,0,7);ctx.stroke();
    A(.9);ink(2);seg(cu[0]+13,cu[1]+11,cu[0]+86,cu[1]+70,clamp(cb));
    A(clamp(cb));txt('Cuba',cu[0]+96,cu[1]+104,{font:F.romB(68),glow:'rgba(0,0,0,.9)',blur:16});A(.85*clamp(cb));txt('23° north',cu[0]+100,cu[1]+152,{font:F.ital(42),glow:'rgba(0,0,0,.9)',blur:12});}
}

/* ================= D3: birds wake at 1 a.m. (22.55 - 25.55) ================= */
const BWIRE=samplePath('M-40,930 Q540,1050 1120,880',60);
function sceneD3(t){
  BA=env(t,22.6,25.55,.2,.2);
  ctx.save();ctx.globalCompositeOperation='lighter';A(.4);const g=ctx.createLinearGradient(0,800,0,1320);g.addColorStop(0,'rgba(255,60,50,0)');g.addColorStop(1,'rgba(255,96,60,.6)');ctx.fillStyle=g;ctx.fillRect(0,800,W,520);ctx.restore();
  ctx.save();ctx.translate(0,1500);drawTown();ctx.restore();
  A(1);ctx.strokeStyle=C.black;ctx.lineCap='butt';ctx.lineWidth=12;ctx.beginPath();ctx.moveTo(1012,850);ctx.lineTo(1012,1500);ctx.stroke();
  ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(930,896);ctx.lineTo(1090,882);ctx.moveTo(950,962);ctx.lineTo(1080,950);ctx.stroke();
  ctx.lineWidth=3.5;strokePts(BWIRE);ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-40,1010);ctx.quadraticCurveTo(540,1120,1120,948);ctx.stroke();
  const us=[.17,.3,.44,.58,.71];
  for(let i=0;i<5;i++){const q=ptAt(BWIRE,us[i]),up=E.o(prog(t,22.85+i*.13,23.2+i*.13)),sg=env(t,24.0+i*.06,25.6,.1,.1),beat=.5+.5*Math.sin(t*24+i*1.9),sing=sg*beat*(vn(t*5+i*3)>.35?1:0);
    const bob=Math.sin(t*10+i*2.1)*2.5*up;A(1);drawBird(q[0],q[1]+bob,1.55,up,sing);
    if(sg>0){const hx=q[0]+(24+34)*1.55,hy=q[1]-16*1.55-37*1.55;for(let k=0;k<2;k++){const ph=(t*2.2+k*.5+i*.3)%1;A(sg*(1-ph)*.9);ink(3);ctx.beginPath();ctx.arc(hx,hy,12+ph*34,-.7,.5);ctx.stroke();}}}
  const c1=prog(t,23.3,23.65);ctx.font=F.num(250);const w1=ctx.measureText('1:00').width;
  A(c1);txt('1:00',68,580+(1-E.o(c1))*30,{font:F.num(250),glow:'rgba(0,0,0,.6)',blur:24});txt('a.m.',68+w1+22,580+(1-E.o(c1))*30,{font:F.ital(88),glow:'rgba(0,0,0,.6)',blur:20});
  A(.92*prog(t,24.15,24.5));txt('They think it’s sunrise.',76,664,{font:F.ital(50),glow:'rgba(0,0,0,.7)',blur:16});
}

/* ================= E: the telegraph goes haywire (25.4 - 31.6) ================= */
const ETAPE=samplePath('M826,560 C790,700 930,860 860,1010 C830,1080 870,1130 900,1168',90);
const EW=['M370,838 C360,930 330,980 338,1074','M450,838 C470,960 700,960 746,1074','M746,1074 C800,1010 960,1060 1100,1000'].map(d=>samplePath(d,30));
function flames(x,y,t,n,sz,seed){ctx.save();ctx.globalCompositeOperation='lighter';
  for(let i=0;i<n;i++){const ph=(t*2.6+rnd(seed+i*3.1))%1,fx=x+(rnd(seed+i*7.7)-.5)*sz*1.6+Math.sin(t*9+i)*6*ph,fy=y-ph*sz*4.2,r=sz*(1-ph)*(.6+.5*rnd(seed+i*1.3));
    const c=ph<.3?'255,243,220':ph<.65?'255,182,77':'255,70,50',g=ctx.createRadialGradient(fx,fy,0,fx,fy,r*1.4+.1);g.addColorStop(0,`rgba(${c},${(.85*(1-ph)).toFixed(3)})`);g.addColorStop(1,`rgba(${c},0)`);
    A(1);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(fx,fy,r+.1,r*1.7+.1,0,0,7);ctx.fill();}
  ctx.restore();}
function sceneE(t){
  BA=env(t,25.45,31.6,.2,.15);
  const d=E.o(prog(t,25.4,26.2)),cx=410,cy=640,r=200,f30=Math.floor(t*30+.5);
  // dial
  A(.95);ink(3.4);ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*d);ctx.stroke();A(.5);ink(1.8);ctx.beginPath();ctx.arc(cx,cy,r-14,-Math.PI/2,-Math.PI/2+Math.PI*2*d);ctx.stroke();
  const pvx=cx,pvy=cy+60;
  for(let i=-6;i<=6;i++){const a=i*10*Math.PI/180;A(.8*d);ink(i%3===0?3:2);const r1=150,r2=i%3===0?172:162;seg(pvx+Math.sin(a)*r1,pvy-Math.cos(a)*r1,pvx+Math.sin(a)*r2,pvy-Math.cos(a)*r2);}
  A(.5*d);ink(2);ctx.beginPath();ctx.arc(pvx,pvy,150,-Math.PI/2-1.047,-Math.PI/2+1.047);ctx.stroke();
  A(.8*d);txt('line current',cx,cy+150,{font:F.ital(36),align:'center'});
  const wild=prog(t,25.7,26.1);let na=((vn(t*9)-.5)*3.1+Math.sin(t*23)*.25)*wild+(vn(t*4)-.5)*.08;na=clamp(na,-1.31,1.31);
  const peg=Math.abs(na)>1.05;A(1);ink(5,peg?C.crimson:C.paper);seg(pvx-Math.sin(na)*30,pvy+Math.cos(na)*30,pvx+Math.sin(na)*166,pvy-Math.cos(na)*166);
  ctx.fillStyle=C.paper;ctx.beginPath();ctx.arc(pvx,pvy,10,0,7);ctx.fill();
  ink(3);A(.9);ctx.beginPath();ctx.arc(370,838,8,0,7);ctx.stroke();ctx.beginPath();ctx.arc(450,838,8,0,7);ctx.stroke();
  // wires
  for(const wr of EW){A(.9);ink(3);strokeRange(wr,0,d);}
  const sur=wild*(.45+.55*vn(t*13));for(const wr of EW){A(.7*sur);glowLine(()=>strokePts(wr),C.crimson,8,28);}
  // reel + tape
  const bf=E.o(prog(t,29.9,31.45)),uf=1-.66*bf;
  A(.95);ink(3.2);ctx.beginPath();ctx.arc(870,500,74,0,7*d);ctx.stroke();ctx.beginPath();ctx.arc(870,500,13,0,7);ctx.stroke();
  for(let i=0;i<6;i++){const a=i*Math.PI/3+t*.5;A(.6);ink(2);seg(870+Math.cos(a)*13,500+Math.sin(a)*13,870+Math.cos(a)*74,500+Math.sin(a)*74,d);}
  ctx.save();ctx.lineCap='butt';ctx.lineJoin='round';A(1);ctx.strokeStyle='#EFE6D2';ctx.lineWidth=32;strokeRange(ETAPE,0,uf*d);
  ctx.strokeStyle=C.ink;ctx.lineWidth=7;const sh=(t*.07)%.06;for(let i=0;i<16;i++){const u0=i*.06+sh,len=(i*7%3===0)?.026:.009;if(u0+len<uf*d-.01){A(.85);strokeRange(ETAPE,u0,u0+len);}}
  if(bf>0){ctx.strokeStyle='#2A130A';ctx.lineWidth=32;A(.92);strokeRange(ETAPE,uf-.07,uf);ctx.strokeStyle=C.amber;A(1);ctx.shadowColor=C.amber;ctx.shadowBlur=30;strokeRange(ETAPE,uf-.016,uf);ctx.shadowBlur=0;}
  ctx.restore();
  if(bf>0&&bf<1){const q=ptAt(ETAPE,uf);ctx.save();ctx.globalCompositeOperation='lighter';A(.5*Math.min(1,bf*6)*(.8+.2*vn(t*14)));const hg=ctx.createRadialGradient(q[0],q[1]-30,0,q[0],q[1]-30,230);hg.addColorStop(0,'rgba(255,150,60,.55)');hg.addColorStop(1,'rgba(255,90,40,0)');ctx.fillStyle=hg;ctx.fillRect(q[0]-240,q[1]-270,480,480);ctx.restore();
    flames(q[0],q[1],t,26,46,5);flames(q[0],q[1]+10,t*1.3,10,26,90);for(let k=0;k<12;k++){const tk=29.95+k*.13;sparks(q[0],q[1],tk,t,{n:5,seed:40+k,sp:150,g:-260,life:.9,size:3,spread:1.2,color:C.amber});}}
  // key
  const kx=246,ky=900,ks=1.05,jit=wild*(rnd(f30*3.3)-.5)*.02;
  ctx.save();ctx.translate(kx,ky);ctx.scale(ks,ks);A(1);drawKey(d,jit-.01,3.4);ctx.restore();
  A(.9);ink(3.2);seg(60,1190,1020,1190,d);
  // sparks
  const cxk=kx+164*ks,cyk=ky+172*ks;
  sparks(cxk,cyk,27.56,t,{n:34,seed:11,sp:620,life:.6});sparks(746,1074,27.86,t,{n:30,seed:12,sp:560,life:.55});sparks(cxk,cyk,28.16,t,{n:46,seed:13,sp:760,life:.65,size:5});
  if(t>27.5&&t<28.55&&rnd(f30*5.1)>.45){const b=bolt(kx+164*ks,ky+160*ks,kx+164*ks,ky+184*ks,f30,8,5);A(1);glowLine(()=>strokePts(b),C.amber,5,18,C.hot);}
  // the operator's hand
  if(t>28.15&&t<29.85){const ap=E.o(prog(t,28.2,28.58));let hx=lerp(-140,364,ap),hy=lerp(962,1000,ap),hr=.16;
    if(t>=28.62){const rc=E.o5(prog(t,28.62,28.78)),tr=1-prog(t,28.8,29.5);hx=364-150*rc+(rnd(f30*1.1)-.5)*16*tr;hy=1000-70*rc+(rnd(f30*2.3)-.5)*16*tr;hr=.16-.3*rc;}
    hx-=560*E.i(prog(t,29.35,29.8));
    ctx.save();ctx.translate(hx,hy);ctx.rotate(hr);A(.96);ctx.fillStyle='#0A0B10';ctx.fill(ART.hand.p);A(1);ink(3.2);ctx.stroke(ART.hand.p);A(.7);ink(2.2);ctx.stroke(ART.handDetail.p);ctx.restore();
    if(t>=28.6&&t<28.98){const kxp=kx+118*ks,kyp=ky+100*ks;for(let k=0;k<2;k++){const b=bolt(kxp,kyp,hx,hy,f30*3+k*17,26,8);A(1);glowLine(()=>strokePts(b),C.crimson,9,30,C.hot);}
      sparks(kxp,kyp,28.62,t,{n:40,seed:21,sp:700,life:.5,size:5,color:C.hot});}
  }
}

/* ================= F: Boston to Portland on auroral current (31.4 - 38) ================= */
const MAP={lon0:-70.5,lat0:43.0,k:430,cx:560,cy:760};
const mp=(lon,lat)=>[MAP.cx+(lon-MAP.lon0)*MAP.k*.7314,MAP.cy-(lat-MAP.lat0)*MAP.k];
const NEPATH=(()=>{const p=new Path2D();for(const r of NE10){r.forEach((q,i)=>{const xy=mp(q[0],q[1]);if(i)p.lineTo(xy[0],xy[1]);else p.moveTo(xy[0],xy[1]);});p.closePath();}return p;})();
const NEINV=(()=>{const p=new Path2D();p.rect(-400,-400,W+800,H+800);p.addPath(NEPATH);return p;})();
const BOS=mp(-71.06,42.36),PWM=mp(-70.26,43.66);
const LINE=smooth([[-71.06,42.36],[-70.96,42.53],[-70.92,42.81],[-70.82,43.07],[-70.64,43.33],[-70.44,43.52],[-70.26,43.66]].map(q=>mp(q[0],q[1])),12);
function slip(x,y,w,h,rot,lines,p){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=20;ctx.shadowOffsetY=7;
  const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#F6EFDD');g.addColorStop(1,'#E4D9BE');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const tot=lines.reduce((a,l)=>a+l.length,0);let n=Math.round(tot*p);ctx.font=F.slab(40,700);ctx.fillStyle=C.ink;ctx.textAlign='left';ctx.textBaseline='alphabetic';
  lines.forEach((l,i)=>{const s=l.slice(0,Math.max(0,n));n-=l.length;if(s)ctx.fillText(s,26,54+i*52);});ctx.restore();}
function miniJar(x,y,off){ctx.save();ctx.translate(x,y);ctx.scale(.46,.46);A(1-.6*off);ink(3/.46*.8);for(const q of ART.jar)ctx.stroke(q.p);ctx.restore();
  if(off>0){A(.95);ink(5,C.crimson);seg(x-10,y-4,x+56,y+112,off);}}
function sceneF(t){
  BA=env(t,31.45,38.0,.3,.15);
  const zi=1+.1*(1-E.o(prog(t,31.45,32.3)));ctx.translate(MAP.cx,MAP.cy);ctx.scale(zi,zi);ctx.translate(-MAP.cx,-MAP.cy);
  ctx.save();ctx.clip(NEINV,'evenodd');ink(44);A(.07);ctx.stroke(NEPATH);ink(28);ctx.stroke(NEPATH);ink(14);ctx.stroke(NEPATH);ctx.restore();
  A(.15);ctx.fillStyle=C.paper;ctx.fill(NEPATH);A(.75);ink(2.2);ctx.stroke(NEPATH);
  A(.42);txt('Atlantic Ocean',700,905,{font:F.ital(42),ls:3});
  // telegraph line
  const ld=E.o(prog(t,31.8,32.7));A(.95);ink(3);strokeRange(LINE,0,ld);
  for(let i=4;i<LINE.length-2;i+=6){if(i/LINE.length>ld)break;const a=LINE[i-1],b=LINE[i+1],nx=-(b[1]-a[1]),ny=b[0]-a[0],L=Math.hypot(nx,ny)||1;A(.8);ink(2.2);seg(LINE[i][0]-nx/L*9,LINE[i][1]-ny/L*9,LINE[i][0]+nx/L*9,LINE[i][1]+ny/L*9);}
  // cities
  const b1=E.back(prog(t,31.95,32.3)),b2=E.back(prog(t,32.2,32.55));
  for(const [c,b,n1,n2] of [[BOS,b1,'Boston',''],[PWM,b2,'Portland','Maine']]){if(b<=0)continue;A(1);ctx.fillStyle=C.paper;ctx.beginPath();ctx.arc(c[0],c[1],9*b,0,7);ctx.fill();ink(2.5);A(.8);ctx.beginPath();ctx.arc(c[0],c[1],19*b,0,7);ctx.stroke();
    A(clamp(b));txt(n1,c[0]+34,c[1]+20,{font:F.romB(56),glow:'rgba(0,0,0,.85)',blur:14});if(n2){A(.85*clamp(b));txt(n2,c[0]+36,c[1]+62,{font:F.ital(40),glow:'rgba(0,0,0,.85)',blur:12});}}
  // batteries
  const o1=E.o(prog(t,32.7,33.0)),o2=E.o(prog(t,33.05,33.35)),ja=prog(t,32.25,32.6);
  if(ja>0){const BA0=BA;BA=BA0*ja;A(.8);ink(2.2);seg(BOS[0]-88,BOS[1]-8,BOS[0]-22,BOS[1]-2);seg(PWM[0]-88,PWM[1]-8,PWM[0]-22,PWM[1]-2);
    miniJar(BOS[0]-138,BOS[1]-76,o1);miniJar(PWM[0]-138,PWM[1]-76,o2);
    if(o1>0){A(o1);txt('off',BOS[0]-150,BOS[1]+84,{font:F.ital(44),fill:C.crimson,glow:'rgba(0,0,0,.85)',blur:12});}
    if(o2>0){A(o2);txt('off',PWM[0]-150,PWM[1]+84,{font:F.ital(44),fill:C.crimson,glow:'rgba(0,0,0,.85)',blur:12});}BA=BA0;}
  // auroral current
  const g=prog(t,33.7,34.3);
  if(g>0){A(.6*g*(.75+.25*vn(t*6)));glowLine(()=>strokePts(LINE),C.crimson,9,30);
    for(let k=0;k<9;k++){const len=k%3===0?.06:.026;let u=(t-34.95)*.85-k*.1;if(t<36.15){if(u>0&&u-len<1){A(g);glowLine(()=>strokeRange(LINE,u-len,u),C.green,8,22,C.hot);}}
      else{u=1-((t-36.2)*.85-k*.1);if(u<1&&u+len>0){A(g);glowLine(()=>strokeRange(LINE,u,u+len),C.green,8,22,C.hot);}}}}
  const s1=prog(t,34.95,35.75),s2=prog(t,36.15,36.95);
  if(t>34.85){const e1=E.o(prog(t,34.85,35.1));ctx.save();ctx.globalAlpha=BA*e1;slip(430,1104+(1-e1)*30,480,126,.012,['“How do you receive','my writing?”'],s1);ctx.restore();}
  if(t>36.05){const e2=E.o(prog(t,36.05,36.3));ctx.save();ctx.globalAlpha=BA*e2;slip(586,588+(1-e2)*30,452,126,-.014,['“Better than with','our batteries on.”'],s2);ctx.restore();}
}

/* ================= G: title (37.8 - 42.6) ================= */
function wipe(x,y,w,h,p,fn){if(p<=0)return;ctx.save();ctx.beginPath();ctx.rect(x,y,w*p,h);ctx.clip();fn();ctx.restore();}
function sceneG(t){
  BA=env(t,37.85,42.5,.2,.3);
  const sx=540,sy=1560,R=560;
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
  for(let k=0;k<5;k++){const th=(-90+(k-2)*21+(rnd(k*3.3)-.5)*8)*Math.PI/180,dl=.06+.03*rnd(k*5.1),gk=E.o(prog(t,38.15+k*.35,40.6+k*.3));if(gk<=0)continue;
    const h=(40+70*rnd(k*9.7))*gk,a1=th-dl,a2=th+dl,p1=[sx+Math.cos(a1)*R,sy+Math.sin(a1)*R],p2=[sx+Math.cos(a2)*R,sy+Math.sin(a2)*R];
    const c1=[sx+Math.cos(a1-.03)*(R+h*1.35),sy+Math.sin(a1-.03)*(R+h*1.35)],c2=[sx+Math.cos(a2+.03)*(R+h*1.35),sy+Math.sin(a2+.03)*(R+h*1.35)];
    const f=()=>{ctx.beginPath();ctx.moveTo(p1[0],p1[1]);ctx.bezierCurveTo(c1[0],c1[1],c2[0],c2[1],p2[0],p2[1]);ctx.stroke();};
    A(.85*gk);ctx.strokeStyle=C.amber;ctx.shadowColor=C.amber;ctx.shadowBlur=30;ctx.lineWidth=10;f();ctx.shadowBlur=0;ctx.strokeStyle=C.hot;ctx.lineWidth=3;f();}
  ctx.restore();
  const p0=E.o(prog(t,38.05,38.45)),p1=E.o5(prog(t,38.5,39.25)),p2=E.o5(prog(t,39.15,39.75)),sh={glow:'rgba(0,0,0,.85)',blur:26};
  A(1);wipe(60,320,400,120,p0,()=>txt('The',84,410,{font:F.ital(92),...sh}));
  wipe(40,410,1000,210,p1,()=>txt('Carrington',74,572,{font:F.num(184),...sh}));
  wipe(40,590,1000,210,p2,()=>txt('Event',74,744,{font:F.num(184),...sh}));
  const p3=E.o(prog(t,39.8,40.3));A(.5*p3);ctx.fillStyle=C.paper;ctx.fillRect(84,796,430*p3,2);
  A(.88*prog(t,39.95,40.4));txt('1–2 September 1859',84,856,{font:F.ital(48),...sh});
}

/* ================= H: July 2012, one week from a direct hit (42.4 - 49) ================= */
function sceneH(t){
  BA=env(t,42.45,49.0,.3,.2);
  const cx=540,cy=760,RO=390,ea=Math.PI/2,ex=cx,ey=cy+RO,ca=-Math.PI/6,d=E.o(prog(t,42.5,43.4));
  A(.5);ink(2);ctx.beginPath();ctx.arc(cx,cy,RO,-Math.PI/2,-Math.PI/2+Math.PI*2*d);ctx.stroke();
  const px=cx+Math.cos(ca)*RO,py=cy+Math.sin(ca)*RO;
  A(.9*d);ink(2.6);ctx.beginPath();ctx.moveTo(px,py-13);ctx.lineTo(px+13,py);ctx.lineTo(px,py+13);ctx.lineTo(px-13,py);ctx.closePath();ctx.stroke();
  const p=E.o(prog(t,43.55,45.5));
  if(p>0){const r1=70+760*p,fade=1-.6*prog(t,45.6,46.7);ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
    const gr=ctx.createRadialGradient(cx,cy,60,cx,cy,Math.max(80,r1));gr.addColorStop(0,'rgba(255,200,120,.55)');gr.addColorStop(.6,'rgba(255,70,60,.36)');gr.addColorStop(.93,'rgba(255,43,69,.5)');gr.addColorStop(1,'rgba(255,43,69,0)');
    A(fade);ctx.fillStyle=gr;ctx.fill(wedgePath(cx,cy,ca,.5,66,r1));
    A(fade);ctx.strokeStyle=C.hot;ctx.shadowColor=C.crimson;ctx.shadowBlur=36;ctx.lineWidth=8;ctx.beginPath();ctx.arc(cx,cy,r1*.96,ca-.5,ca+.5);ctx.stroke();ctx.shadowBlur=0;
    for(let i=0;i<60;i++){const a=ca+(rnd(i*3.7)-.5)*.95,f=(rnd(i*5.9)+t*.5)%1,rr=70+(r1-70)*f;A(.5*f*fade);ctx.strokeStyle=C.amber;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);ctx.lineTo(cx+Math.cos(a)*(rr-40),cy+Math.sin(a)*(rr-40));ctx.stroke();}
    ctx.restore();
    const hp=prog(t,44.3,45.1);if(hp>0&&hp<1){A(1-hp);ink(3.5,C.hot);ctx.beginPath();ctx.arc(px,py,14+70*hp,0,7);ctx.stroke();}}
  const lp=prog(t,44.5,44.9)*(1-prog(t,46.35,46.65));
  if(lp>0){A(.8*lp);ink(1.8);seg(px+4,py+20,900,800,lp);A(.9*lp);txt('It hit a NASA probe instead.',1010,848,{font:F.ital(40),align:'right',glow:'rgba(0,0,0,.9)',blur:12});}
  // rewind one week
  if(t>46.6){const rw=E.io(prog(t,46.95,47.95)),ga=lerp(ca,ea,rw),al=prog(t,46.6,46.95),wp=wedgePath(cx,cy,ga,.5,66,600);
    ctx.save();ctx.globalCompositeOperation='lighter';A(.34*al);ctx.fillStyle=C.crimson;ctx.fill(wp);ctx.restore();
    A(.95*al);ink(2.6,C.crimson);ctx.setLineDash([14,10]);ctx.stroke(wp);ctx.setLineDash([]);
    if(rw>0&&rw<1){A(.9);ink(3,C.paper);ctx.beginPath();ctx.arc(cx,cy,128,ca,ga);ctx.stroke();const hx=cx+Math.cos(ga)*128,hy=cy+Math.sin(ga)*128;
      ctx.save();ctx.translate(hx,hy);ctx.rotate(ga+Math.PI/2);ctx.fillStyle=C.paper;ctx.beginPath();ctx.moveTo(14,0);ctx.lineTo(-8,-10);ctx.lineTo(-8,10);ctx.closePath();ctx.fill();ctx.restore();}}
  miniEarth(ex,ey,30,-40,30);
  const hit=prog(t,48.1,48.8);
  if(hit>0){A(.55*(1-.4*hit));ctx.fillStyle=C.crimson;ctx.beginPath();ctx.arc(ex,ey,30,0,7);ctx.fill();
    ctx.save();ctx.globalCompositeOperation='lighter';for(let k=0;k<3;k++){const hk=clamp(hit*1.5-k*.22);if(hk<=0||hk>=1)continue;A(1-hk);ink(5,C.crimson);ctx.beginPath();ctx.arc(ex,ey,34+150*hk,0,7);ctx.stroke();}ctx.restore();}
  A(.95*d);txt('Earth',ex+52,ey+16,{font:F.romB(46),glow:'rgba(0,0,0,.9)',blur:12});
}

/* ================= I: over two trillion dollars (48.8 - 52.2) ================= */
function sceneI(t){
  BA=env(t,48.85,52.2,.2,.1);
  const f30=Math.floor(t*30+.5),fl=t<51.5?1:((rnd(f30*1.3)>.4?1:.3)*(1-prog(t,51.85,52.12)));
  A(.88*prog(t,49.0,49.3));txt('Estimated damage',76,372,{font:F.ital(58)});
  const pd=E.o5(prog(t,50.42,50.72));
  if(pd>0){const sc=1+.5*(1-pd);ctx.save();ctx.translate(64,770);ctx.scale(sc,sc);A(pd*fl);txt('$2',0,0,{font:F.slab(400,900),fill:C.hot,glow:C.amber,blur:60});ctx.restore();}
  const pt=E.o5(prog(t,50.86,51.2));A(fl);wipe(40,790,1000,220,pt,()=>txt('trillion',64,968,{font:F.slab(196,900),fill:C.hot,glow:C.amber,blur:50}));
  const S='2,000,000,000,000';ctx.font=F.num(84);let x=74;
  for(let i=0;i<S.length;i++){const ts=49.5+i*.062,ch=S[i],wch=ctx.measureText(ch).width;let c=ch,a=.92;
    if(t>=ts-.22){if(t<ts&&ch!==','){c=String(Math.floor(rnd(f30*3.1+i*7.7)*10));a=.55;}A(a*fl);txt(c,x,1100,{font:F.num(84)});}
    x+=wch;}
  A(.75*prog(t,50.9,51.3)*fl);txt('if a storm like it hit today (National Academy of Sciences)',76,1172,{font:F.ital(34)});
}

/* ================= J: how long could you last without power? (52 - 58) ================= */
const CITY=buildCity();
function sceneJ(t){
  BA=env(t,52.05,58.3,.25,.1);
  const base=1560,f30=Math.floor(t*30+.5),surge=(t>53.3&&t<53.95)?(rnd(f30*2.7)>.5?1:.55):1;
  for(const b of CITY){const top=base-b.h;A(1);ctx.fillStyle=C.black;ctx.fillRect(b.x,top,b.w,b.h+400);
    if(b.step)ctx.fillRect(b.x+b.w*.2,top-26,b.w*.6,26);if(b.ant)ctx.fillRect(b.x+b.w/2-2,top-(b.step?26:0)-70,4,70);
    A(.35);ctx.fillStyle=C.crimson;ctx.fillRect(b.x,top,b.w,2);
    const tb=54.2+(b.x/1080)*1.3+rnd(b.i*4.4)*.12,cols=Math.floor((b.w-14)/22),rows=Math.floor((b.h-20)/30);
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const id=b.i*1000+r*37+c;if(rnd(id*1.7)<.45)continue;const toff=tb+rnd(id*3.3)*.25;let on=1;
      if(t>toff)continue;else if(t>toff-.18)on=rnd(f30+id)>.5?1:.2;
      A(on*surge*(.55+.45*rnd(id*9.9)));ctx.fillStyle=rnd(id*2.2)>.8?'#FFE9B8':'#FFC36B';ctx.fillRect(b.x+9+c*22,top+14+r*30,11,15);}}
  const sh={glow:'rgba(0,0,0,.85)',blur:24},q0=E.o(prog(t,56.0,56.5)),q1=E.o(prog(t,56.25,56.75)),q2=E.o(prog(t,56.5,57.0));
  if(q0>0){A(q0);const sg=ctx.createLinearGradient(0,240,0,900);sg.addColorStop(0,'rgba(3,4,6,.62)');sg.addColorStop(.7,'rgba(3,4,6,.5)');sg.addColorStop(1,'rgba(3,4,6,0)');ctx.fillStyle=sg;ctx.fillRect(0,0,W,900);}
  A(q0);txt('How long',78,430+(1-q0)*30,{font:F.num(128),...sh});A(q1);txt('could you last',78,560+(1-q1)*30,{font:F.num(128),...sh});A(q2);txt('without power?',78,690+(1-q2)*30,{font:F.num(128),...sh});
  A(.95*prog(t,57.0,57.4));txt('Tell us in the comments.',84,772,{font:F.ital(50),...sh});
}

/* ================= master ================= */
const SC=[[0,6.05,sceneA1],[5.45,8.2,sceneA2],[7.9,14.2,sceneB],[14.05,17.6,sceneC],[17.4,20.1,sceneD1],[19.9,22.8,sceneD2],[22.55,25.55,sceneD3],[25.4,31.6,sceneE],[31.4,38.0,sceneF],[37.8,42.5,sceneG],[42.4,49.0,sceneH],[48.8,52.2,sceneI],[52.0,58.4,sceneJ]];
function renderFrame(t){
  const sh=shakeAt(t);glc.style.transform=`translate(${sh[0].toFixed(1)}px,${sh[1].toFixed(1)}px)`;
  drawGL(t,glParams(t));
  ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.shadowBlur=0;ctx.shadowColor='transparent';ctx.setLineDash([]);ctx.clearRect(0,0,W,H);
  ctx.save();ctx.translate(sh[0],sh[1]);
  for(const [a,b,fn] of SC){if(t>=a&&t<b){ctx.save();BA=1;ctx.globalAlpha=1;fn(t);ctx.restore();}}
  ctx.restore();BA=1;
  drawFlashes(t);drawHeader(t);drawCaptions(t);drawFx(t);
  return true;
}
buildTextures();
window.EVENTS={S1,S2};
window.READY=true;
