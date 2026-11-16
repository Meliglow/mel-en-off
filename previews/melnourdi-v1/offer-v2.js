fetch('/api/booking/config').then(response=>response.ok?response.json():null).then(config=>{
  if(!config)return;
  const headline=document.querySelector('[data-offer-headline]');if(headline&&config.headline!==headline.dataset.initial)headline.textContent=config.headline;
  const intro=document.querySelector('[data-offer-intro]');if(intro&&config.intro)intro.textContent=config.intro;
  document.querySelectorAll('[data-current-price]').forEach(element=>{element.textContent=config.currentPrice;});
  document.querySelectorAll('[data-launch-comparison]').forEach(element=>{element.textContent=config.launchAvailable?`Au lieu de ${config.standardPrice} € ${config.taxLabel} · tarif standard`:'Tarif standard de création';});
  document.querySelectorAll('[data-launch-label]').forEach(element=>{element.textContent=config.launchAvailable?`Pour les ${config.launchLimit} premières commandes validées`:'Configuration standard';});
  const container=document.querySelector('#offer-options');container.replaceChildren();
  config.options.forEach(option=>{const link=document.createElement('a');link.className='option-row';link.href='/configurer-reservation';const copy=document.createElement('span'),name=document.createElement('strong'),detail=document.createElement('small'),price=document.createElement('b');name.textContent=option.label;detail.textContent=option.scope;price.textContent=option.price===null?'Sur proposition':`+${option.price} € ${config.taxLabel}`;copy.append(name,detail);link.append(copy,price);container.append(link);});
}).catch(()=>{});
