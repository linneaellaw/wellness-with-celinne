/* Riviera Nights: an original after-hours jazz loop, generated live in the browser (no recording, no licence needed). */
(function(){
var css=".vinyl{position:fixed;left:18px;bottom:18px;z-index:90;display:flex;align-items:center;gap:12px;padding:8px 20px 8px 8px;border-radius:999px;background:rgba(18,38,24,.86);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#F3EADC;border:1px solid rgba(243,234,220,.25);font:400 10px/1.3 'Jost',sans-serif;letter-spacing:.24em;text-transform:uppercase;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,.28);transition:transform .4s;text-align:left}"+
".vinyl:hover{transform:translateY(-3px)}"+
".vinyl .rec{position:relative;flex:0 0 44px;width:44px;height:44px;border-radius:50%;background:repeating-radial-gradient(circle,#0e0e0e 0 1px,#1d1d1d 1px 3px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}"+
".vinyl .rec::before{content:'';position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 20deg,transparent 0 40deg,rgba(255,255,255,.14) 52deg,transparent 70deg 220deg,rgba(255,255,255,.08) 232deg,transparent 250deg)}"+
".vinyl .rec::after{content:'';position:absolute;inset:15px;border-radius:50%;background:radial-gradient(circle,#234F2E 0 2px,#EFE6D8 2.5px)}"+
".vinyl.on .rec{animation:vspin 1.8s linear infinite}@keyframes vspin{to{transform:rotate(360deg)}}"+
".vinyl b{display:block;font-family:'Pinyon Script',cursive;font-weight:400;font-size:21px;letter-spacing:0;text-transform:none;margin-bottom:1px}"+
".vinyl .eq{display:inline-flex;gap:2px;align-items:flex-end;height:9px;margin-left:8px}.vinyl .eq i{width:2px;height:3px;background:currentColor;opacity:.8}"+
".vinyl.on .eq i{animation:veq .8s ease-in-out infinite alternate}.vinyl.on .eq i:nth-child(2){animation-delay:.25s}.vinyl.on .eq i:nth-child(3){animation-delay:.5s}@keyframes veq{to{height:9px}}"+
"@media (max-width:600px){.vinyl .t{display:none}.vinyl{padding:6px}}"+
"@media (prefers-reduced-motion:reduce){.vinyl.on .rec,.vinyl.on .eq i{animation:none}}";
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

var ctx,master,send,noise,playing=false,timer,next=0,beat=0;
var BPM=74,SPB=60/BPM;
// [bass root, voicing] : Cmaj9 | A7b9 | Dm9 | G13 | Em7 | A13 | Dm9 | G7b9
var prog=[[36,[52,55,59,62]],[33,[49,55,58,61]],[38,[53,57,60,64]],[31,[53,57,59,64]],
          [40,[55,59,62,64]],[33,[55,59,61,66]],[38,[53,57,60,64]],[31,[53,56,59,62]]];
function hz(m){return 440*Math.pow(2,(m-69)/12);}
function env(g,t,a,peak,d,len){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(peak*d,t+a+.5);g.gain.exponentialRampToValueAtTime(0.0001,t+len);}
function out(node,wet){node.connect(master);var s=ctx.createGain();s.gain.value=wet;node.connect(s);s.connect(send);}
function piano(t,m,v,len){
  var g=ctx.createGain(),f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=2000;
  [[1,'sine',1],[1,'triangle',.22],[2,'sine',.07]].forEach(function(p){var o=ctx.createOscillator(),og=ctx.createGain();o.type=p[1];o.frequency.value=hz(m)*p[0];o.detune.value=(Math.random()-.5)*6;og.gain.value=p[2];o.connect(og);og.connect(g);o.start(t);o.stop(t+len+.1);});
  env(g,t,.012,v,.35,len);g.connect(f);out(f,.35);
}
function vibe(t,m,v){
  var o=ctx.createOscillator(),g=ctx.createGain(),l=ctx.createOscillator(),lg=ctx.createGain();
  o.type='sine';o.frequency.value=hz(m);l.frequency.value=5.2;lg.gain.value=3;l.connect(lg);lg.connect(o.detune);
  o.connect(g);env(g,t,.008,v,.4,1.6);out(g,.5);o.start(t);o.stop(t+1.7);l.start(t);l.stop(t+1.7);
}
function bass(t,m){
  var g=ctx.createGain(),f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=650;
  ['sine','triangle'].forEach(function(ty,i){var o=ctx.createOscillator(),og=ctx.createGain();o.type=ty;o.frequency.value=hz(m);og.gain.value=i?.35:1;o.connect(og);og.connect(g);o.start(t);o.stop(t+SPB);});
  env(g,t,.01,.32,.45,SPB*.95);g.connect(f);out(f,.1);
}
function hiss(t,v,len,type,freq,q){
  var s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=noise;f.type=type;f.frequency.value=freq;f.Q.value=q||.7;
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+Math.min(.03,len/3));g.gain.exponentialRampToValueAtTime(0.0001,t+len);
  s.connect(f);f.connect(g);out(g,.15);s.start(t,Math.random()*.5);s.stop(t+len+.05);
}
function playBeat(t,b){
  var bar=Math.floor(b/4)%8,bi=b%4,ch=prog[bar],nx=prog[(bar+1)%8],sw=SPB*2/3,r=ch[0];
  if(bi===0)ch[1].forEach(function(m,i){piano(t+i*.012,m,.05,SPB*3.6);});
  if(bi===2&&Math.random()<.4)ch[1].forEach(function(m){piano(t+sw,m,.03,SPB*.8);});
  var walk=[r,r+7,Math.random()<.5?r+12:r+9,nx[0]+(Math.random()<.5?1:-1)];bass(t,walk[bi]);
  hiss(t,.018,.16,'highpass',7500);if(bi%2)hiss(t+sw,.012,.12,'highpass',7500);
  hiss(t,bi%2?.03:.014,SPB*.85,'bandpass',2400,.6);
  if(bi===0&&Math.random()<.6){var pool=ch[1].map(function(m){return m+12;}).concat([ch[1][3]+14]),n=2+Math.floor(Math.random()*3),pos=0;
    for(var k=0;k<n;k++){pos+=(Math.random()<.5?1:2)*(Math.random()<.5?sw:SPB-sw);vibe(t+pos,pool[Math.floor(Math.random()*pool.length)],.06);}}
  if(Math.random()<.5)hiss(t+Math.random()*SPB,.02,.004,'highpass',2500);
}
function tick(){while(next<ctx.currentTime+.25){playBeat(next,beat);next+=SPB;beat++;}}
function init(){
  ctx=new(window.AudioContext||window.webkitAudioContext)();
  var comp=ctx.createDynamicsCompressor();comp.connect(ctx.destination);
  master=ctx.createGain();master.gain.value=0.0001;master.connect(comp);
  var len=ctx.sampleRate*2.6,ir=ctx.createBuffer(2,len,ctx.sampleRate);
  for(var c=0;c<2;c++){var d=ir.getChannelData(c);for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6);}
  var conv=ctx.createConvolver();conv.buffer=ir;send=ctx.createGain();send.gain.value=.6;send.connect(conv);conv.connect(master);
  noise=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);var nd=noise.getChannelData(0);for(var j=0;j<nd.length;j++)nd[j]=Math.random()*2-1;
}
function start(){if(!ctx)init();ctx.resume();next=ctx.currentTime+.08;timer=setInterval(tick,25);master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(Math.max(master.gain.value,.0001),ctx.currentTime);master.gain.exponentialRampToValueAtTime(.55,ctx.currentTime+2);}
function stop(){clearInterval(timer);master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setValueAtTime(master.gain.value,ctx.currentTime);master.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.6);setTimeout(function(){if(!playing)ctx.suspend();},700);}

addEventListener('DOMContentLoaded',function(){
  var b=document.createElement('button');b.type='button';b.className='vinyl';b.setAttribute('aria-pressed','false');b.setAttribute('aria-label','Play background music');
  b.innerHTML='<span class="rec" aria-hidden="true"></span><span class="t"><b>Riviera Nights</b><span class="lbl">Play music</span><span class="eq" aria-hidden="true"><i></i><i></i><i></i></span></span>';
  document.body.appendChild(b);
  b.addEventListener('click',function(){playing=!playing;b.classList.toggle('on',playing);b.setAttribute('aria-pressed',String(playing));
    b.setAttribute('aria-label',playing?'Pause background music':'Play background music');b.querySelector('.lbl').textContent=playing?'Now playing':'Play music';
    if(playing)start();else stop();});
});
})();
