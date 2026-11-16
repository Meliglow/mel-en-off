(() => {
  const stage=document.querySelector('.sales-demo');if(!stage)return;
  const panels=[...stage.querySelectorAll('[data-hero-panel]')],tabs=[...stage.querySelectorAll('[data-hero-tab]')],toggle=stage.querySelector('#hero-motion-toggle');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let index=0,paused=reduced.matches,timer;
  function show(next){index=next;panels.forEach((panel,i)=>panel.hidden=i!==index);tabs.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===index)));}
  function state(){clearInterval(timer);toggle.textContent=paused?'Animer ▶':'Pause ❚❚';toggle.setAttribute('aria-label',paused?'Démarrer le défilement automatique':'Mettre le défilement automatique en pause');if(!paused&&!document.hidden)timer=setInterval(()=>show((index+1)%panels.length),6500);}
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{paused=true;show(i);state();}));
  toggle.addEventListener('click',()=>{paused=!paused;state();});
  stage.addEventListener('focusin',e=>{if(e.target===toggle)return;paused=true;state();});
  document.addEventListener('visibilitychange',state);
  reduced.addEventListener('change',()=>{paused=reduced.matches;state();});
  const range=stage.querySelector('#hero-deposit-rate');
  range.min='1';range.step='1';
  range.addEventListener('input',()=>{paused=true;state();const percent=Number(range.value),deposit=60*percent/100,money=n=>n.toLocaleString('fr-FR',{maximumFractionDigits:2})+' €';stage.querySelector('#hero-deposit-percent').textContent=percent+' %';stage.querySelector('#hero-deposit-now').textContent=money(deposit);stage.querySelector('#hero-deposit-later').textContent=money(60-deposit);range.setAttribute('aria-valuetext',`${percent} %, soit ${money(deposit)} à la réservation`);});
  state();
})();
