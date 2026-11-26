/* Beaded crystal curtain: draped swags with pearl fringe and crystal drops, softly twinkling, swaying when the pointer brushes through. */
(function(){
addEventListener('DOMContentLoaded',function(){
  var host=document.querySelector('.curtain');if(!host)return;
  var cv=host.querySelector('canvas'),cx=cv.getContext('2d');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W=0,H=140,dpr=1,strands=[],swag=[],visible=true,mx=-999,my=-999,pmx=-999,last=0,wave=220;
  function rnd(i){var x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
  function sprite(r,glow,hi){var s=Math.ceil((r+glow)*2*dpr)+2,c=document.createElement('canvas');c.width=c.height=s;var g=c.getContext('2d'),m=s/2,R=(r+glow)*dpr;
    var gr=g.createRadialGradient(m-r*.4*dpr,m-r*.4*dpr,0,m,m,R);
    gr.addColorStop(0,'rgba(255,255,255,'+hi+')');gr.addColorStop(r/(r+glow)*.5,'rgba(248,240,226,.95)');gr.addColorStop(r/(r+glow)*.95,'rgba(214,196,168,.85)');gr.addColorStop(1,'rgba(240,228,206,0)');
    g.fillStyle=gr;g.beginPath();g.arc(m,m,R,0,Math.PI*2);g.fill();return c;}
  function dropSprite(){var w=5*dpr,h=10*dpr,c=document.createElement('canvas');c.width=w+4;c.height=h+4;var g=c.getContext('2d');g.translate(2,2);
    var gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'rgba(255,255,255,.95)');gr.addColorStop(.45,'rgba(236,224,204,.7)');gr.addColorStop(.55,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(200,182,152,.6)');
    g.fillStyle=gr;g.beginPath();g.moveTo(w/2,0);g.lineTo(w,h*.62);g.lineTo(w/2,h);g.lineTo(0,h*.62);g.closePath();g.fill();
    g.strokeStyle='rgba(255,255,255,.55)';g.lineWidth=.6*dpr;g.beginPath();g.moveTo(w/2,0);g.lineTo(w/2,h);g.moveTo(0,h*.62);g.lineTo(w,h*.62);g.stroke();return c;}
  var spSeed,spPearl,spDrop;
  function swagY(x){var t=((x%wave)+wave)%wave/wave;return 3+20*Math.sin(Math.PI*t);}
  function build(){
    dpr=Math.min(2,devicePixelRatio||1);W=host.clientWidth;cv.width=W*dpr;cv.height=H*dpr;cv.style.height=H+'px';
    var nav=document.querySelector('.nav'),cols=nav?getComputedStyle(nav).gridTemplateColumns.split(' ').length:0;wave=(nav&&getComputedStyle(nav).display==='grid'&&cols>1)?W/cols:W/3;spSeed=sprite(1.05,.5,.9);spPearl=sprite(1.6,.7,1);spDrop=dropSprite();
    strands=[];var x=2,i=0;
    while(x<W+6){var t=((x%wave)+wave)%wave/wave,drape=Math.pow(Math.sin(Math.PI*t),1.4),
      L=22+64*drape+rnd(i)*16-(i%4===1?8:0);
      strands.push({x:x,y0:swagY(x),L:Math.min(L,H-26),a:0,v:0,ph:rnd(i+7)*6.283,seed:i});
      x+=8.5+rnd(i+3)*3;i++;}
    swag=[];for(var gx=-4;gx<W+8;gx+=3.2)swag.push(gx);
    draw(performance.now());
  }
  function draw(t){
    cx.setTransform(dpr,0,0,dpr,0,0);cx.clearRect(0,0,W,H);
    cx.lineWidth=.5;cx.strokeStyle='rgba(240,228,206,.13)';cx.beginPath();
    for(var i=0;i<strands.length;i++){var s=strands[i],ex=s.x+Math.sin(s.a)*s.L,ey=s.y0+Math.cos(s.a)*s.L;cx.moveTo(s.x,s.y0);cx.quadraticCurveTo(s.x+Math.sin(s.a*.35)*s.L*.5,s.y0+s.L*.5,ex,ey);}
    cx.stroke();
    var glints=[];
    for(i=0;i<strands.length;i++){s=strands[i];var n=Math.floor(s.L/5.2);
      for(var k=1;k<=n;k++){var f=k/n,ang=s.a*(0.3+0.7*f),d=k*5.2,bx=s.x+Math.sin(ang)*d,by=s.y0+Math.cos(ang)*d,
        pearl=(k%4===0),img=pearl?spPearl:spSeed,sz=img.width/dpr,
        tw=Math.pow(Math.max(0,Math.sin(t*.0007+s.ph*3+k*2.9)),400);
        cx.globalAlpha=Math.min(1,(0.85-0.55*f)*(pearl?.95:.8)+tw*.3);cx.drawImage(img,bx-sz/2,by-sz/2,sz,sz);
        if(tw>.5)glints.push([bx,by,tw*.7]);}
      if(s.seed%5===0){var ex2=s.x+Math.sin(s.a)*(n+1)*5.2,ey2=s.y0+Math.cos(s.a)*(n+1)*5.2,dw=spDrop.width/dpr,dh=spDrop.height/dpr;
        cx.save();cx.translate(ex2,ey2);cx.rotate(-s.a);cx.globalAlpha=.85;cx.drawImage(spDrop,-dw/2,-dh*.15,dw,dh);cx.restore();
        var dtw=Math.pow(Math.max(0,Math.sin(t*.0006+s.ph*2.3)),200);if(dtw>.4)glints.push([ex2,ey2+3,dtw]);}
    }
    for(var g=0;g<swag.length;g++){var gx2=swag[g],gy=swagY(gx2),im=(g%3===0)?spPearl:spSeed,sz2=im.width/dpr;cx.globalAlpha=.95;cx.drawImage(im,gx2-sz2/2,gy-sz2/2,sz2,sz2);}
    cx.globalCompositeOperation='lighter';
    for(g=0;g<glints.length;g++){var p=glints[g],r=3+6*p[2];cx.globalAlpha=Math.min(1,p[2]);
      var gr=cx.createRadialGradient(p[0],p[1],0,p[0],p[1],r);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,248,235,0)');
      cx.fillStyle=gr;cx.beginPath();cx.arc(p[0],p[1],r*.45,0,6.283);cx.fill();
      cx.strokeStyle='rgba(255,255,255,.6)';cx.lineWidth=.5;cx.beginPath();cx.moveTo(p[0]-r,p[1]);cx.lineTo(p[0]+r,p[1]);cx.moveTo(p[0],p[1]-r);cx.lineTo(p[0],p[1]+r);cx.stroke();}
    cx.globalCompositeOperation='source-over';cx.globalAlpha=1;
  }
  function step(t){
    if(!visible){last=0;return requestAnimationFrame(step);}
    var dt=Math.min(32,t-(last||t))/16.67;last=t;
    var r=host.getBoundingClientRect(),lx=mx-r.left,ly=my-r.top,dx=mx-pmx;pmx=mx;
    for(var i=0;i<strands.length;i++){var s=strands[i];
      if(dx&&ly>s.y0-12&&ly<s.y0+s.L+24&&Math.abs(lx-s.x)<30){var push=(1-Math.abs(lx-s.x)/30)*dx*.0028*(0.4+(ly-s.y0)/s.L);s.v+=Math.max(-.06,Math.min(.06,push));}
      s.v+=(-0.010*s.a+0.00025*Math.sin(t*.0006+s.x*.012))*dt;s.v*=Math.pow(0.955,dt);s.a+=s.v*dt;
      if(i>0){var d=strands[i-1].a-s.a;s.v+=d*.018;strands[i-1].v-=d*.018;}
    }
    draw(t);requestAnimationFrame(step);
  }
  addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;},{passive:true});
  addEventListener('resize',function(){clearTimeout(build.t);build.t=setTimeout(build,150);});
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){visible=es[0].isIntersecting;}).observe(host);
  build();if(!reduce)requestAnimationFrame(step);
});
})();
