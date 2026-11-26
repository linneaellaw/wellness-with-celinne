/* Beaded diamond curtain: strands of glinting beads that sway when the pointer brushes through them. */
(function(){
addEventListener('DOMContentLoaded',function(){
  var host=document.querySelector('.curtain');if(!host)return;
  var cv=host.querySelector('canvas'),cx=cv.getContext('2d');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W=0,H=150,dpr=1,strands=[],garland=[],visible=true,mx=-999,my=-999,pmx=-999,last=0;
  var GAP=7,BEAD=5.2;
  // bead sprite
  function sprite(r,glow){var c=document.createElement('canvas'),s=Math.ceil((r+glow)*2*dpr)+2;c.width=c.height=s;var g=c.getContext('2d'),m=s/2;
    var gr=g.createRadialGradient(m-r*.35*dpr,m-r*.35*dpr,0,m,m,(r+glow)*dpr);
    gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(r/(r+glow)*.45,'rgba(250,246,238,.95)');gr.addColorStop(r/(r+glow),'rgba(225,216,200,.75)');gr.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle=gr;g.beginPath();g.arc(m,m,(r+glow)*dpr,0,Math.PI*2);g.fill();return c;}
  var spB,spS,spF;
  function build(){
    dpr=Math.min(2,devicePixelRatio||1);W=host.clientWidth;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';
    spB=sprite(1.5,1);spS=sprite(1.2,5);spF=sprite(1,0.6);
    strands=[];var n=Math.ceil(W/GAP)+1,wave=W<700?120:190;
    for(var i=0;i<n;i++){var x=i*GAP+((i%2)?1.5:0),ph=Math.cos(Math.PI*2*x/wave),
      L=54+40*(0.5+0.5*ph)+Math.random()*14+(i%3===0?8:0);
      strands.push({x:x,L:Math.min(L,H-12),a:0,v:0,beads:Math.floor(L/BEAD),tw:[]});}
    garland=[];for(var gx=0;gx<W+wave;gx+=4){var t=(gx%wave)/wave;garland.push({x:gx,y:6+16*Math.sin(Math.PI*t)});}
    draw(0);
  }
  function draw(t){
    cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,W,H);
    // fine silk threads
    cx.strokeStyle='rgba(243,234,220,.16)';cx.lineWidth=.6;cx.beginPath();
    for(var i=0;i<strands.length;i++){var s=strands[i],ex=s.x+Math.sin(s.a)*s.L,ey=Math.cos(s.a)*s.L;cx.moveTo(s.x,0);cx.quadraticCurveTo(s.x+Math.sin(s.a*.4)*s.L*.5,ey*.5,ex,ey);}
    cx.stroke();
    // beads
    for(i=0;i<strands.length;i++){s=strands[i];
      for(var k=1;k<=s.beads;k++){var f=k/s.beads,ang=s.a*(0.4+0.6*f),d=k*BEAD,bx=s.x+Math.sin(ang)*d,by=Math.cos(ang)*d,
        spark=(Math.sin(t*.0023+i*12.9898+k*78.233)*43758.5453)%1;spark=spark<0?-spark:spark;
        var img=spark>.985?spS:(k%3?spF:spB),sz=img.width/dpr;cx.globalAlpha=spark>.985?1:(0.55+0.45*(1-f*.4));
        cx.drawImage(img,bx-sz/2,by-sz/2,sz,sz);}
    }
    // scalloped beaded garland along the top
    cx.globalAlpha=.95;for(var g=0;g<garland.length;g++){var p=garland[g],sz2=spB.width/dpr;cx.drawImage(spB,p.x-sz2/2,p.y-sz2/2,sz2,sz2);cx.drawImage(spF,p.x-sz2/2,p.y+3-sz2/2,sz2,sz2);}
    cx.globalAlpha=1;
  }
  function step(t){
    if(!visible){last=0;return requestAnimationFrame(step);}
    var dt=Math.min(32,t-(last||t))/16.67;last=t;
    var r=host.getBoundingClientRect(),lx=mx-r.left,ly=my-r.top,dx=mx-pmx;pmx=mx;
    for(var i=0;i<strands.length;i++){var s=strands[i];
      if(ly>-10&&ly<s.L+20&&Math.abs(lx-s.x)<26&&dx){var push=(1-Math.abs(lx-s.x)/26)*dx*.0035*(0.5+ly/s.L);s.v+=Math.max(-.08,Math.min(.08,push));}
      s.v+=(-0.012*s.a-0.0)*dt;s.v*=Math.pow(0.94,dt);s.a+=s.v*dt;
      // neighbours tug a little
      if(i>0){var d=strands[i-1].a-s.a;s.v+=d*.02;strands[i-1].v-=d*.02;}
    }
    draw(t);requestAnimationFrame(step);
  }
  addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;},{passive:true});
  addEventListener('resize',function(){clearTimeout(build.t);build.t=setTimeout(build,150);});
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){visible=es[0].isIntersecting;}).observe(host);
  build();if(!reduce)requestAnimationFrame(step);
});
})();
