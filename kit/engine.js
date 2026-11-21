'use strict';
/* ================= constants ================= */
const W=1080,H=1920,FPS=30,DUR=(typeof FILM_DUR==='number')?FILM_DUR:57;   // FILM_DUR comes from the film's timeline.js
const GLW=720,GLH=1280,GS=GLW/W;
const C={paper:'#EFE6D2',ink:'#120E0B',crimson:'#FF2B45',deep:'#C4122F',green:'#63FFC2',amber:'#FFB64D',hot:'#FFF3DC',night:'#05070D',blue:'#7FB8FF',black:'#030406'};
const F={num:px=>`${px}px "LM Roman 17"`,rom:px=>`${px}px "LM Roman 12"`,romB:px=>`bold ${px}px "LM Roman 12"`,ital:px=>`italic ${px}px "LM Roman 12"`,slab:(px,w=800)=>`${w} ${px}px "Bitter"`};

/* ================= math ================= */
const clamp=(x,a=0,b=1)=>x<a?a:(x>b?b:x);
const lerp=(a,b,u)=>a+(b-a)*u;
const prog=(t,a,b)=>clamp((t-a)/(b-a));
const E={io:x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2,o:x=>1-Math.pow(1-x,3),o5:x=>1-Math.pow(1-x,5),i:x=>x*x*x,i2:x=>x*x,
  back:x=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2);}};
const rnd=n=>{const s=Math.sin(n*12.9898+78.233)*43758.5453;return s-Math.floor(s);};
const vn=x=>{const i=Math.floor(x),f=x-i,u=f*f*(3-2*f);return lerp(rnd(i),rnd(i+1),u);};
const env=(t,a,b,fi=.3,fo=.3)=>clamp((t-a)/fi)*clamp((b-t)/fo);
function kf(t,k){if(t<=k[0][0])return k[0][1];for(let i=1;i<k.length;i++){if(t<=k[i][0]){const a=k[i-1],b=k[i],u=(t-a[0])/((b[0]-a[0])||1e-9),s=u*u*(3-2*u);return a[1]+(b[1]-a[1])*s;}}return k[k.length-1][1];}

/* ================= WebGL background: sky, stars, aurora, sun ================= */
const glc=document.getElementById('gl');
const gl=glc.getContext('webgl2',{antialias:false,alpha:false,preserveDrawingBuffer:true});
const VS=`#version 300 es
in vec2 p; void main(){gl_Position=vec4(p,0.,1.);}`;
const FS=`#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uT;
uniform float uAur,uRed,uBase,uSpan,uStar,uGlow;
uniform vec4 uSun; uniform float uFlare,uSpots,uBoil;
out vec4 o;
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*noise(p);p=p*2.03+vec2(17.1,3.7);a*=.5;}return s;}
void main(){
  vec2 fc=gl_FragCoord.xy; vec2 uv=fc/uRes; float asp=uRes.x/uRes.y;
  vec3 col=mix(vec3(.030,.040,.090),vec3(.006,.008,.024),smoothstep(0.,1.,uv.y));
  if(uStar>0.){
    vec2 g=floor(fc/4.),f=fract(fc/4.)-.5; float h=hash(g);
    if(h>.984){vec2 off=(vec2(hash(g+3.1),hash(g+7.7))-.5)*.6; float d=length(f-off);
      float tw=.65+.35*sin(uT*(1.5+3.*hash(g+5.))+h*90.);
      col+=vec3(.92,.94,1.)*smoothstep(.42,.0,d)*tw*(.35+.65*hash(g+1.3))*uStar;}
  }
  if(uAur>.001){
    vec3 aur=vec3(0.); float x0=uv.x*asp*2.2;
    for(int i=0;i<3;i++){
      float fi=float(i); float x=x0+fi*.61;
      float edge=uBase+fi*.085*uSpan+.028*sin(x*3.1+uT*.32+fi*1.9)+.17*(noise(vec2(x*1.9+fi*9.3,uT*.10+fi*3.))-.5)+.05*(noise(vec2(x*5.3-fi*4.1,uT*.16))-.5);
      float h=(uv.y-edge)/uSpan;
      float body=smoothstep(-.015,.02,h)*exp(-max(h,0.)*2.4);
      float rays=noise(vec2(x*38.+fi*31.+sin(uT*.17+fi)*1.5,uT*.3+fi*7.));
      rays=.3+rays*rays;
      float drift=.5+.5*noise(vec2(x*2.6-uT*.16,fi*4.+uT*.04));
      float a=body*rays*drift;
      float k=smoothstep(0.,.13,h);
      vec3 c=mix(vec3(.25,1.,.6),mix(vec3(.8,.15,.55),vec3(1.,.09,.14),uRed),clamp(k+uRed*.22,0.,1.));
      aur+=c*a*(1.-.2*fi);
    }
    col+=aur*uAur*1.25;
    float amb=smoothstep(uBase-.3,uBase+uSpan*.5,uv.y)*(1.-.55*smoothstep(uBase+uSpan*.5,1.25,uv.y));
    col+=mix(vec3(.10,.22,.16),vec3(.30,.025,.06),uRed)*uAur*uGlow*amb;
  }
  if(uSun.w>.001){
    vec2 q=(fc-uSun.xy)/uSun.z; float r=length(q);
    float glow=exp(-max(r-1.,0.)*2.6)*.55+exp(-max(r-1.,0.)*.8)*.16;
    vec3 s=vec3(1.,.55,.18)*glow;
    if(r>=1.){float ang=atan(q.y,q.x); float st=noise(vec2(ang*3.+uT*.05,1.7))*noise(vec2(ang*9.-uT*.03,5.2));
      s+=vec3(1.,.6,.25)*st*exp(-(r-1.)*1.6)*.9;}
    if(r<1.02){
      float mu=sqrt(max(0.,1.-r*r));
      vec2 sp=q*(1.+.35*(1.-mu));
      float g1=fbm(sp*7.+vec2(uT*.03*uBoil,0.));
      float g2=fbm(sp*19.+vec2(0.,-uT*.05*uBoil)+g1*1.5);
      vec3 surf=mix(vec3(.85,.22,.02),vec3(1.,.62,.14),g1);
      surf=mix(surf,vec3(1.,.9,.6),pow(g2,2.5)*.9);
      surf*=.45+.75*pow(mu,.55);
      if(uSpots>0.){
        float n=fbm(q*30.)*.03;
        float d1=length((q-vec2(.20,.30))*vec2(1.,1.25));
        float d2=length((q-vec2(.31,.24))*vec2(1.3,1.));
        float d3=length(q-vec2(.12,.36));
        float um=smoothstep(.060+n,.035+n,d1)+smoothstep(.045+n,.022+n,d2)+smoothstep(.030+n,.012+n,d3);
        float pen=smoothstep(.115+n,.070+n,d1)+smoothstep(.090+n,.055+n,d2)+smoothstep(.060+n,.035+n,d3);
        surf*=1.-clamp(pen,0.,1.)*.55*uSpots; surf*=1.-clamp(um,0.,1.)*.85*uSpots;
      }
      s=mix(s,surf*1.5,smoothstep(1.02,.985,r));
    }
    if(uFlare>0.){
      vec2 pa=vec2(.165,.335),pb=vec2(.27,.275);
      float ka=clamp(uFlare,0.,1.),kb=clamp(uFlare-.35,0.,1.);
      float fa=exp(-pow(length((q-pa)*vec2(1.,1.6))/.045,2.));
      float fb=exp(-pow(length((q-pb)*vec2(1.5,1.))/.040,2.));
      float bloom=exp(-length(q-pa)*5.)*ka+exp(-length(q-pb)*5.)*kb;
      s+=vec3(1.,.98,.95)*((fa*ka+fb*kb)*4.+bloom*1.3*uFlare);
    }
    col+=s*uSun.w;
  }
  col=1.-exp(-col*1.35);
  col+=(hash(fc+fract(uT)*91.7)-.5)*(1.8/255.);
  o=vec4(col,1.);
}`;
function mkShader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('shader: '+gl.getShaderInfoLog(s));return s;}
const prg=gl.createProgram();gl.attachShader(prg,mkShader(gl.VERTEX_SHADER,VS));gl.attachShader(prg,mkShader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(prg);
if(!gl.getProgramParameter(prg,gl.LINK_STATUS))throw new Error('link: '+gl.getProgramInfoLog(prg));
gl.useProgram(prg);
{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
 const l=gl.getAttribLocation(prg,'p');gl.enableVertexAttribArray(l);gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);}
const U={};for(const n of ['uRes','uT','uAur','uRed','uBase','uSpan','uStar','uGlow','uSun','uFlare','uSpots','uBoil'])U[n]=gl.getUniformLocation(prg,n);
function drawGL(t,p){
  gl.viewport(0,0,GLW,GLH);gl.uniform2f(U.uRes,GLW,GLH);gl.uniform1f(U.uT,t);
  gl.uniform1f(U.uAur,p.aur);gl.uniform1f(U.uRed,p.red);gl.uniform1f(U.uBase,p.base);gl.uniform1f(U.uSpan,p.span);gl.uniform1f(U.uStar,p.star);gl.uniform1f(U.uGlow,p.glow);
  gl.uniform4f(U.uSun,p.sun[0]*GS,(H-p.sun[1])*GS,p.sun[2]*GS,p.sun[3]);
  gl.uniform1f(U.uFlare,p.flare);gl.uniform1f(U.uSpots,p.spots);gl.uniform1f(U.uBoil,p.boil);
  gl.drawArrays(gl.TRIANGLES,0,3);gl.finish();
}

/* ================= 2D helpers ================= */
const cv=document.getElementById('c');const ctx=cv.getContext('2d');
let BA=1;                                   // base alpha of the scene being drawn
const A=v=>{ctx.globalAlpha=clamp(BA*v);};
const _svgp=document.createElementNS('http://www.w3.org/2000/svg','path');
function mkPath(d){_svgp.setAttribute('d',d);return {p:new Path2D(d),len:_svgp.getTotalLength(),d};}
function samplePath(d,n){_svgp.setAttribute('d',d);const L=_svgp.getTotalLength(),out=[];for(let i=0;i<=n;i++){const q=_svgp.getPointAtLength(L*i/n);out.push([q.x,q.y]);}return out;}
function ink(w=3.2,col=C.paper){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap='round';ctx.lineJoin='round';}
function drawOn(P,p){if(p<=0)return;if(p>=1){ctx.setLineDash([]);ctx.stroke(P.p);return;}ctx.setLineDash([P.len*p,P.len+20]);ctx.stroke(P.p);ctx.setLineDash([]);}
function strokeSet(list,p,stagger=.5){const n=list.length;for(let i=0;i<n;i++){const s=(n>1?i/(n-1):0)*stagger;drawOn(list[i],clamp((p-s)/(1-stagger)));}}
function seg(x1,y1,x2,y2,p=1){if(p<=0)return;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(lerp(x1,x2,p),lerp(y1,y2,p));ctx.stroke();}
function strokePts(pts,i0=0,i1=pts.length-1){if(i1<=i0)return;ctx.beginPath();ctx.moveTo(pts[i0][0],pts[i0][1]);for(let i=i0+1;i<=i1;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.stroke();}
function ptAt(pts,u){const f=clamp(u)*(pts.length-1),i=Math.min(pts.length-2,Math.floor(f)),k=f-i;return [lerp(pts[i][0],pts[i+1][0],k),lerp(pts[i][1],pts[i+1][1],k)];}
function strokeRange(pts,u0,u1){u0=clamp(u0);u1=clamp(u1);if(u1<=u0)return;const n=pts.length-1;const a=ptAt(pts,u0),b=ptAt(pts,u1);ctx.beginPath();ctx.moveTo(a[0],a[1]);for(let i=Math.floor(u0*n)+1;i<=Math.ceil(u1*n)-1;i++)ctx.lineTo(pts[i][0],pts[i][1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
function txt(s,x,y,o={}){ctx.font=o.font||F.rom(40);ctx.textAlign=o.align||'left';ctx.textBaseline=o.base||'alphabetic';ctx.letterSpacing=(o.ls||0)+'px';
  if(o.glow){ctx.shadowColor=o.glow;ctx.shadowBlur=o.blur||30;}else{ctx.shadowColor='transparent';ctx.shadowBlur=0;}
  ctx.fillStyle=o.fill||C.paper;ctx.fillText(s,x,y);ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.letterSpacing='0px';}
function glowLine(fn,col,w,blur,core){ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=col;ctx.lineWidth=w;ctx.shadowColor=col;ctx.shadowBlur=blur;fn();if(core){ctx.shadowBlur=0;ctx.strokeStyle=core;ctx.lineWidth=Math.max(1.5,w*.32);fn();}ctx.restore();}
function sparks(x,y,t0,t,o={}){const n=o.n||30,life=o.life||.6,g=o.g??900,sp=o.sp||500,seed=o.seed||1,dt=t-t0;if(dt<0||dt>life*1.3)return;
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';
  for(let i=0;i<n;i++){const li=life*(.5+.8*rnd(seed*31+i*7.1));if(dt>li)continue;
    const ang=(o.dir??-Math.PI/2)+(rnd(seed*17+i*3.3)-.5)*(o.spread??Math.PI*1.6),v=sp*(.3+.9*rnd(seed*5+i*1.7));
    const vx=Math.cos(ang)*v,vy=Math.sin(ang)*v+g*dt,px=x+Math.cos(ang)*v*dt,py=y+Math.sin(ang)*v*dt+.5*g*dt*dt,k=1-dt/li,L=.024;
    A(k);ctx.strokeStyle=o.color||C.amber;ctx.lineWidth=(o.size||4)*(.5+.5*k);ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-vx*L,py-vy*L);ctx.stroke();
    if(k>.45){ctx.strokeStyle=C.hot;ctx.lineWidth=(o.size||4)*.4;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-vx*L*.5,py-vy*L*.5);ctx.stroke();}}
  ctx.restore();}
function bolt(x1,y1,x2,y2,seed,amp=40,segs=9){const pts=[[x1,y1]],nx=-(y2-y1),ny=x2-x1,L=Math.hypot(nx,ny)||1;
  for(let i=1;i<segs;i++){const u=i/segs,off=(rnd(seed+i*13.7)-.5)*2*amp*Math.sin(Math.PI*u);pts.push([lerp(x1,x2,u)+nx/L*off,lerp(y1,y2,u)+ny/L*off]);}
  pts.push([x2,y2]);return pts;}
function morse(str,unit,t0){const out=[];let t=t0;for(const ch of str){if(ch==='.'){out.push([t,t+unit]);t+=unit*2;}else if(ch==='-'){out.push([t,t+unit*3]);t+=unit*4;}else if(ch===' ')t+=unit*2;else if(ch==='/')t+=unit*4;}return out;}
function keyDown(t,sch){for(const [a,b] of sch){if(t>=a-.02&&t<=b+.03)return clamp((t-a+.02)/.03)*clamp((b+.03-t)/.04);}return 0;}

/* ================= caption tape ================= */
const CAPY=1340,CAPROT=-1.1*Math.PI/180;let TAPE=null,GRAIN=null,GRAIN_A=0;
function buildTextures(){
  let c=document.createElement('canvas');c.width=400;c.height=112;let x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,112);g.addColorStop(0,'#F7F0DE');g.addColorStop(.5,'#EFE6D2');g.addColorStop(1,'#E0D4B8');x.fillStyle=g;x.fillRect(0,0,400,112);
  for(let i=0;i<300;i++){const px=rnd(i*3.1)*400,py=rnd(i*7.7)*112,l=6+rnd(i*1.3)*26,dy=(rnd(i*5.5)-.5)*3;
    x.strokeStyle=`rgba(${rnd(i)>.5?'120,96,60':'255,255,255'},${(.05+rnd(i*9.1)*.09).toFixed(3)})`;x.lineWidth=1;
    for(const sx of [0,-400]){x.beginPath();x.moveTo(px+sx,py);x.lineTo(px+sx+l,py+dy);x.stroke();}}
  x.fillStyle='rgba(90,70,40,.22)';x.fillRect(0,0,400,2);x.fillRect(0,110,400,2);
  TAPE=ctx.createPattern(c,'repeat');
  c=document.createElement('canvas');c.width=c.height=256;x=c.getContext('2d');const id=x.createImageData(256,256);
  for(let i=0;i<65536;i++){const v=rnd(i*1.37+3.1)>.5?255:0;id.data[i*4]=id.data[i*4+1]=id.data[i*4+2]=v;id.data[i*4+3]=Math.floor(rnd(i*2.71+9.3)*26);}
  x.putImageData(id,0,0);GRAIN=ctx.createPattern(c,'repeat');
}
function drawCaptions(t){
  const out=E.i(prog(t,DUR-1.3,DUR-.85));if(out>=1)return;
  ctx.save();ctx.globalAlpha=1;ctx.translate(W/2-out*1500,CAPY);ctx.rotate(CAPROT);
  ctx.shadowColor='rgba(0,0,0,.6)';ctx.shadowBlur=28;ctx.shadowOffsetY=10;ctx.fillStyle='#EFE6D2';ctx.fillRect(-760,-56,1520,112);
  ctx.shadowColor='transparent';ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const off=(t*26)%400;ctx.save();ctx.translate(-off,-56);ctx.fillStyle=TAPE;ctx.fillRect(-760+off,0,1520,112);ctx.restore();
  let ci=-1;for(let i=0;i<CH.length;i++){if(t>=WT[CH[i][0][1]][0]-.07)ci=i;else break;}
  if(ci>=0){const ch=CH[ci],cs=WT[ch[0][1]][0]-.07,ce=WT[ch[ch.length-1][1]][1];
    const nxt=ci+1<CH.length?WT[CH[ci+1][0][1]][0]-.07:1e9;
    const ain=E.o(prog(t,cs,cs+.12)),aout=(nxt-ce>.55)?1-prog(t,ce+.38,ce+.5):1,al0=ain*aout;
    if(al0>0){ctx.font=F.slab(58,800);ctx.letterSpacing='1.5px';ctx.textBaseline='middle';ctx.textAlign='left';
      const ws=ch.map(c=>ctx.measureText(c[0]).width),gap=20;const tot=ws.reduce((a,b)=>a+b,0)+gap*(ch.length-1);
      const sc=Math.min(1,840/tot);ctx.scale(sc,sc);let x=-tot/2+(1-ain)*50;
      for(let j=0;j<ch.length;j++){const s=ch[j][0],w0=WT[ch[j][1]][0],w1=WT[ch[j][1]][1],ns=j+1<ch.length?WT[ch[j+1][1]][0]:1e9;
        let col=C.ink,al=1,pop=1;
        if(t<w0-.03)al=.24;else if(t<Math.min(w1+.05,ns)){col=C.deep;pop=1+.10*(1-E.o(prog(t,w0-.03,w0+.12)));}
        ctx.globalAlpha=al0*al;ctx.fillStyle=col;ctx.save();ctx.translate(x+ws[j]/2,3);ctx.scale(pop,pop);ctx.fillText(s,-ws[j]/2,0);ctx.restore();
        x+=ws[j]+gap;}}}
  ctx.restore();ctx.letterSpacing='0px';
}

/* ================= header, flashes, shake, grain ================= */
const HEAD=[];   // rows [t0,t1,line1,line2,crimson?] - the film's scenes.js fills this with HEAD.push(...)
function drawHeader(t){
  ctx.save();ctx.globalAlpha=.38;ctx.fillStyle=C.paper;ctx.fillRect(70,188,940,2);
  ctx.shadowColor='rgba(0,0,0,.7)';ctx.shadowBlur=14;
  ctx.globalAlpha=.66;ctx.font=F.ital(36);ctx.textAlign='right';ctx.textBaseline='alphabetic';ctx.fillText('Midnight Files',1010,174);
  for(const h of HEAD){const a=env(t,h[0],h[1],.25,.2);if(a<=0)continue;const dy=(1-E.o(prog(t,h[0],h[0]+.3)))*14;
    ctx.textAlign='left';ctx.globalAlpha=a;ctx.font=F.romB(50);ctx.fillStyle=h[4]?C.crimson:C.paper;ctx.fillText(h[2],70,252+dy);
    if(h[3]){ctx.globalAlpha=a*.8;ctx.font=F.ital(38);ctx.fillStyle=C.paper;ctx.fillText(h[3],70,302+dy);}}
  ctx.restore();
}
const FLASH=[];   // rows [t0,rise,fall,'r,g,b',peak] - full-frame colour flashes
function drawFlashes(t){for(const [t0,r,fl,c,pk] of FLASH){if(t<t0-r||t>t0+fl)continue;const a=t<t0?E.i2((t-(t0-r))/r):Math.pow(1-(t-t0)/fl,2);
  ctx.save();ctx.globalAlpha=1;ctx.fillStyle=`rgba(${c},${(a*pk).toFixed(3)})`;ctx.fillRect(0,0,W,H);ctx.restore();}}
const SHAKE=[];   // rows [t0,duration,amplitude] - camera shake
function shakeAt(t){let x=0,y=0;for(const [t0,d,a] of SHAKE){if(t>=t0&&t<t0+d){const k=1-(t-t0)/d,f=Math.floor(t*FPS+.5);x+=(rnd(f*1.7+t0)-.5)*2*a*k;y+=(rnd(f*2.9+t0*3)-.5)*2*a*k;}}return [x,y];}
function drawFx(t){
  ctx.save();ctx.globalAlpha=1;const g=ctx.createRadialGradient(W/2,H*.47,H*.30,W/2,H*.5,H*.80);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.6)');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const f=Math.floor(t*FPS+.5),ox=Math.floor(rnd(f*1.3)*256),oy=Math.floor(rnd(f*2.1)*256);
  if(GRAIN_A>0){ctx.globalAlpha=GRAIN_A;ctx.translate(-ox,-oy);ctx.fillStyle=GRAIN;ctx.fillRect(ox,oy,W,H);}ctx.restore();
}
