/* Background music player: plays a real recording (music/riviera.mp3). Visitors start it with the record button. */
(function(){
var SRC='music/riviera.mp3', TITLE='Riviera Nights';
var css=".vinyl{position:fixed;left:18px;bottom:18px;z-index:90;display:flex;align-items:center;gap:12px;padding:8px 20px 8px 8px;border-radius:999px;background:rgba(18,38,24,.86);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);color:#F3EADC;border:1px solid rgba(243,234,220,.25);font:400 10px/1.3 'Jost',sans-serif;letter-spacing:.24em;text-transform:uppercase;cursor:pointer;box-shadow:0 12px 30px rgba(0,0,0,.28);transition:transform .4s;text-align:left}"+
".vinyl:hover{transform:translateY(-3px)}"+
".vinyl .rec{position:relative;flex:0 0 44px;width:44px;height:44px;border-radius:50%;background:repeating-radial-gradient(circle,#0e0e0e 0 1px,#1d1d1d 1px 3px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.08)}"+
".vinyl .rec::before{content:'';position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 20deg,transparent 0 40deg,rgba(255,255,255,.14) 52deg,transparent 70deg 220deg,rgba(255,255,255,.08) 232deg,transparent 250deg)}"+
".vinyl .rec::after{content:'';position:absolute;inset:15px;border-radius:50%;background:radial-gradient(circle,#234F2E 0 2px,#EFE6D8 2.5px)}"+
".vinyl.on .rec{animation:vspin 1.8s linear infinite}@keyframes vspin{to{transform:rotate(360deg)}}"+
".vinyl b{display:block;font-family:'Pinyon Script',cursive;font-weight:400;font-size:21px;letter-spacing:0;text-transform:none;margin-bottom:1px}"+
"@media (max-width:600px){.vinyl .t{display:none}.vinyl{padding:6px}}"+
"@media (prefers-reduced-motion:reduce){.vinyl.on .rec{animation:none}}";
addEventListener('DOMContentLoaded',function(){
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  var au=new Audio();au.src=SRC;au.loop=true;au.preload='none';au.volume=0;
  var b=document.createElement('button');b.type='button';b.className='vinyl';b.setAttribute('aria-pressed','false');b.setAttribute('aria-label','Play background music');
  b.innerHTML='<span class="rec" aria-hidden="true"></span><span class="t"><b>'+TITLE+'</b><span class="lbl">Play music</span></span>';
  document.body.appendChild(b);
  var fade;function ramp(to,done){clearInterval(fade);fade=setInterval(function(){var v=au.volume+(to>au.volume?.05:-.05);au.volume=Math.max(0,Math.min(1,v));if(Math.abs(au.volume-to)<.05){au.volume=to;clearInterval(fade);if(done)done();}},60);}
  b.addEventListener('click',function(){var on=!b.classList.contains('on');b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on));
    b.setAttribute('aria-label',on?'Pause background music':'Play background music');b.querySelector('.lbl').textContent=on?'Now playing':'Play music';
    if(on){au.play().then(function(){ramp(.6);}).catch(function(){});}else ramp(0,function(){au.pause();});});
});
})();
