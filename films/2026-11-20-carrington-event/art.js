'use strict';
/* ================= line-art assets ================= */
const P=d=>mkPath(d);
const ART={
  keyStatic:['M0,240 H560 V276 H0 Z','M14,228 H546 L560,240 M14,228 L0,240','M60,228 V210 H500 V228',
    'M262,210 V142 Q262,114 290,114 Q318,114 318,142 V210','M301,142 a11,11 0 1,0 -22,0 a11,11 0 1,0 22,0',
    'M146,210 V184 H182 V210 M158,184 V174 H170 V184','M386,210 l-11,-7 l22,-7 l-22,-7 l22,-7 l-22,-7 l22,-7 l-11,-7',
    'M430,210 V168 H458 V210','M88,210 V190 M74,190 H102 V176 H74 Z M88,176 V166','M476,210 V190 M462,190 H490 V176 H462 Z M476,176 V166'].map(P),
  keyLever:['M98,156 L290,134 L472,124 L472,138 L290,152 L100,170 Z','M112,157 V124 M124,156 V124',
    'M70,112 a48,13 0 1,0 96,0 a48,13 0 1,0 -96,0 M80,120 Q118,138 156,120','M444,126 V92 M430,92 H458 M436,108 H452'].map(P),
  jar:['M0,40 V210 Q0,232 22,232 H78 Q100,232 100,210 V40','M-8,40 H108','M6,100 Q28,92 50,100 T94,100','M34,18 V190 H66 V18 Z','M50,18 V-4',
    'M58,-12 a8,8 0 1,0 -16,0 a8,8 0 1,0 16,0'].map(P),
  strap:P('M50,-20 Q106,-66 162,-20'),
  poleTop:['M-9,0 H9','M-96,38 H96 V54 H-96 Z','M-72,100 H72 V114 H-72 Z','M-89,38 V22 Q-82,8 -75,22 V38','M-41,38 V22 Q-34,8 -27,22 V38',
    'M27,38 V22 Q34,8 41,22 V38','M75,38 V22 Q82,8 89,22 V38','M-65,100 V86 Q-58,72 -51,86 V100','M51,100 V86 Q58,72 65,86 V100','M-9,150 L-58,114 M9,150 L58,114'].map(P),
  hand:P('M0,0 C-8,-14 -40,-18 -72,-16 L-124,-26 C-156,-32 -182,-24 -198,-8 L-460,-8 L-460,80 L-198,80 C-172,92 -134,90 -112,72 C-92,68 -80,56 -84,44 C-70,40 -62,28 -68,16 L-30,14 C-14,14 -2,10 0,0 Z'),
  handDetail:P('M-262,-8 V80 M-150,-12 C-140,8 -120,18 -96,17 M-84,44 L-56,42 M-68,16 L-44,20'),
};
function drawKey(d,ang,w=3.4){ink(w);strokeSet(ART.keyStatic,d,.55);ctx.save();ctx.translate(290,142);ctx.rotate(ang);ctx.translate(-290,-142);strokeSet(ART.keyLever,clamp(d*1.2-.2),.4);ctx.restore();}
function drawBattery(d,w=3.2){ink(w);for(let i=0;i<3;i++){ctx.save();ctx.translate(i*112,0);strokeSet(ART.jar,clamp(d*1.3-i*.15),.5);if(i<2)drawOn(ART.strap,clamp(d*1.5-.5));ctx.restore();}}
function drawPole(x,y,s,len){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ink(Math.max(1.1,3.2*Math.sqrt(s))/s);for(const p of ART.poleTop)ctx.stroke(p.p);
  ctx.beginPath();ctx.moveTo(-9,0);ctx.lineTo(-11,len);ctx.moveTo(9,0);ctx.lineTo(11,len);ctx.stroke();ctx.restore();}
function drawBird(x,y,s,up,sing){ctx.save();ctx.translate(x,y-16*s);ctx.scale(s,s);ctx.fillStyle=C.black;
  ctx.beginPath();ctx.moveTo(-18,-6);ctx.lineTo(-58,22);ctx.lineTo(-50,30);ctx.lineTo(-12,10);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.ellipse(0,-12,30,21,-.35,0,7);ctx.fill();
  const hx=lerp(20,24,up),hy=lerp(-20,-37,up);ctx.beginPath();ctx.arc(hx,hy,13,0,7);ctx.fill();
  const bo=sing*7;ctx.beginPath();ctx.moveTo(hx+9,hy-6);ctx.lineTo(hx+29,hy-2-bo);ctx.lineTo(hx+11,hy+1);ctx.closePath();ctx.fill();
  ctx.beginPath();ctx.moveTo(hx+10,hy);ctx.lineTo(hx+27,hy+2+bo);ctx.lineTo(hx+8,hy+6);ctx.closePath();ctx.fill();
  ctx.strokeStyle=C.black;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-4,6);ctx.lineTo(-4,16);ctx.moveTo(6,6);ctx.lineTo(6,16);ctx.stroke();ctx.restore();}

/* ---- 1859 town silhouette (baseline y=0, up is negative) ---- */
const TOWN=(()=>{const p=new Path2D(),R=[];p.moveTo(-40,800);p.lineTo(-40,0);
  const house=(x,w,h,r,ch)=>{p.lineTo(x,0);p.lineTo(x,-h);p.lineTo(x-10,-h);p.lineTo(x+w/2,-h-r);p.lineTo(x+w+10,-h);p.lineTo(x+w,-h);p.lineTo(x+w,0);if(ch)R.push([x+w*.22,-h-r*.9-8,18,r*.9]);};
  const block=(x,w,h)=>{p.lineTo(x,0);p.lineTo(x,-h);p.lineTo(x-6,-h);p.lineTo(x-6,-h-10);p.lineTo(x+w+6,-h-10);p.lineTo(x+w+6,-h);p.lineTo(x+w,-h);p.lineTo(x+w,0);R.push([x+16,-h-40,16,32],[x+w-34,-h-34,16,26]);};
  house(-30,150,110,60,1);block(126,112,170);
  {const x=250,tw=78,th=250,sh=210;p.lineTo(x,0);p.lineTo(x,-th);p.lineTo(x-5,-th);p.lineTo(x-5,-th-12);p.lineTo(x+10,-th-12);p.lineTo(x+tw/2,-th-sh);p.lineTo(x+tw-10,-th-12);p.lineTo(x+tw+5,-th-12);p.lineTo(x+tw+5,-th);p.lineTo(x+tw,-th);p.lineTo(x+tw,0);
   R.push([x+tw/2-2,-th-sh-32,4,36],[x+tw/2-11,-th-sh-22,22,4]);}
  house(328,168,135,72,0);house(506,124,100,55,1);block(640,146,205);house(796,118,118,60,1);block(922,104,150);house(1036,130,104,58,0);
  p.lineTo(1200,0);p.lineTo(1200,800);p.closePath();for(const r of R)p.rect(r[0],r[1],r[2],r[3]);return p;})();
const TOWNPOLES=[96,575,960];
function drawTown(){ctx.fillStyle=C.black;A(1);ctx.fill(TOWN);
  ctx.strokeStyle=C.black;ctx.lineCap='butt';
  for(const x of TOWNPOLES){ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,-335);ctx.stroke();ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x-36,-312);ctx.lineTo(x+36,-312);ctx.moveTo(x-27,-284);ctx.lineTo(x+27,-284);ctx.stroke();}
  ctx.lineWidth=2;const xs=[-420,...TOWNPOLES,1480];
  for(let i=0;i<xs.length-1;i++)for(const [o,yy] of [[-30,-316],[30,-316],[-22,-288],[22,-288]]){ctx.beginPath();ctx.moveTo(xs[i]+o,yy);ctx.quadraticCurveTo((xs[i]+xs[i+1])/2+o,yy+70,xs[i+1]+o,yy);ctx.stroke();}
  A(.3);ctx.strokeStyle=C.crimson;ctx.lineWidth=2;ctx.lineJoin='round';ctx.stroke(TOWN);}

/* ---- modern skyline ---- */
function buildCity(){const b=[];let x=-10,i=0;while(x<1090){const w=58+rnd(700+i*3.3)*86,cen=1-Math.min(1,Math.abs((x+w/2)-540)/620);
  const h=330+Math.pow(rnd(900+i*7.7),1.4)*300*(.55+.45*cen)+cen*100;b.push({x,w,h,ant:rnd(300+i*1.9)>.7,step:rnd(500+i*2.3)>.55,i});x+=w+4+rnd(100+i)*8;i++;}return b;}

/* ---- geometry helpers ---- */
function smooth(pts,n){const out=[],m=pts.length;const g=i=>pts[clamp(i,0,m-1)];
  for(let s=0;s<m-1;s++){const p0=g(s-1),p1=g(s),p2=g(s+1),p3=g(s+2);for(let j=0;j<n;j++){const u=j/n,u2=u*u,u3=u2*u;
    out.push([.5*((2*p1[0])+(-p0[0]+p2[0])*u+(2*p0[0]-5*p1[0]+4*p2[0]-p3[0])*u2+(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*u3),
              .5*((2*p1[1])+(-p0[1]+p2[1])*u+(2*p0[1]-5*p1[1]+4*p2[1]-p3[1])*u2+(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*u3)]);}}
  out.push(pts[m-1]);return out;}
function dest(c,brg,dist){const r=Math.PI/180,f1=c[1]*r,l1=c[0]*r,th=brg*r,dl=dist*r;
  const f2=Math.asin(Math.sin(f1)*Math.cos(dl)+Math.cos(f1)*Math.sin(dl)*Math.cos(th));
  const l2=l1+Math.atan2(Math.sin(th)*Math.sin(dl)*Math.cos(f1),Math.cos(dl)-Math.sin(f1)*Math.sin(f2));return [l2/r,f2/r];}
function wedgePath(cx,cy,ang,half,r0,r1){const p=new Path2D();p.moveTo(cx+Math.cos(ang-half)*r0,cy+Math.sin(ang-half)*r0);p.arc(cx,cy,r1,ang-half,ang+half);p.arc(cx,cy,r0,ang+half,ang-half,true);p.closePath();return p;}
