(() => {
  const stage=document.querySelector('.sales-demo');if(!stage)return;
  const panels=[...stage.querySelectorAll('[data-hero-panel]')],tabs=[...stage.querySelectorAll('[data-hero-tab]')];
  function show(next){panels.forEach((panel,i)=>panel.hidden=i!==next);tabs.forEach((tab,i)=>tab.setAttribute('aria-pressed',String(i===next)));}
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>show(i)));
  const range=stage.querySelector('#hero-deposit-rate');
  range.addEventListener('input',()=>{const percent=Number(range.value),deposit=60*percent/100,money=n=>n.toLocaleString('fr-FR',{maximumFractionDigits:2})+' €';stage.querySelector('#hero-deposit-percent').textContent=percent+' %';stage.querySelector('#hero-deposit-now').textContent=money(deposit);stage.querySelector('#hero-deposit-later').textContent=money(60-deposit);range.setAttribute('aria-valuetext',percent+' %, soit '+money(deposit)+' à la réservation');});
  // Play the short sequence when the illustration enters the viewport, including on mobile.
  const illustration=stage.querySelector('.calendar-preview');
  if(illustration && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    illustration.classList.add('calendar-awaiting');
    const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){illustration.classList.remove('calendar-awaiting');observer.disconnect();}},{threshold:.25});
    observer.observe(illustration);
  }
})();
