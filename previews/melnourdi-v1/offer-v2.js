fetch('/api/booking/config').then(response=>response.ok?response.json():null).then(config=>{
  if(!config)return;
  const headline=document.querySelector('[data-offer-headline]');if(headline&&config.headline!==headline.dataset.initial)headline.textContent=config.headline;
  const intro=document.querySelector('[data-offer-intro]');if(intro&&config.intro)intro.textContent=config.intro;
  document.querySelectorAll('[data-current-price]').forEach(element=>{element.textContent=config.currentPrice;});
  document.querySelectorAll('[data-launch-comparison]').forEach(element=>{element.replaceChildren();if(config.launchAvailable){const crossed=document.createElement('del');crossed.textContent=`${config.standardPrice} € ${config.taxLabel}`;element.append('au lieu de ',crossed);}else element.textContent='Tarif standard de création';});
  document.querySelectorAll('[data-launch-label]').forEach(element=>{element.textContent=config.launchAvailable?`Pour les ${config.launchLimit} premières commandes validées`:'Configuration standard';});
  document.querySelectorAll('[data-launch-ribbon]').forEach(element=>{element.textContent=config.launchAvailable?`Lancement · ${config.launchLimit} premiers projets`:'Ton logiciel de réservation personnalisé';});
  document.querySelectorAll('.launch-invitation,.launch-hero-note').forEach(element=>{element.hidden=!config.launchAvailable;});
  const cents=Math.round(config.currentPrice*100), first=Math.ceil(cents/3), last=cents-2*first;
  const money=value=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(value/100);
  document.querySelectorAll('[data-installment-first]').forEach(el=>el.textContent=money(first));
  document.querySelectorAll('[data-installment-detail]').forEach(el=>el.textContent=`${money(first)} + ${money(first)} + ${money(last)} · total ${money(cents)} TTC.`);
  const container=document.querySelector('#offer-options');container.replaceChildren();
  config.options.forEach(option=>{const link=document.createElement('a');link.className='option-row';link.href='/configurer-reservation';const copy=document.createElement('span'),name=document.createElement('strong'),detail=document.createElement('small'),price=document.createElement('b');name.textContent=option.label;detail.textContent=option.scope;price.textContent=option.price===null?'Sur proposition':`+${option.price} € ${config.taxLabel}`;copy.append(name,detail);link.append(copy,price);container.append(link);});
}).catch(()=>{});
