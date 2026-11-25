/* Kit Motion design — Mel Nourdi (melnourdi.fr)
   Petit moteur maison, sans dépendance. À charger en bas de page :
   <script src="motion.js" defer></script>  */
(function(){
  var calme = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tactile = window.matchMedia && matchMedia('(hover: none)').matches;
  var $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};

  // 1. Préparer les effets qui ont besoin de découper le texte
  $$('[data-m="mots"]').forEach(function(el){
    if(el.dataset.mReady) return; el.dataset.mReady=1;
    var mots = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = mots.map(function(m,i){return '<span class="m-w" aria-hidden="true"><span style="--i:'+i+'">'+m+'</span></span>';}).join(' ');
  });
  $$('[data-m="cascade"]').forEach(function(el){
    Array.prototype.forEach.call(el.children,function(c,i){c.style.setProperty('--i',i);});
  });
  $$('[data-m="ecrit"]').forEach(function(el){
    el.dataset.mText = el.textContent; el.setAttribute('aria-label', el.textContent);
    if(!calme) el.textContent = '';
  });
  $$('[data-m="bandeau"]').forEach(function(el){
    if(el.querySelector('.m-track')) return;
    var t=document.createElement('div'); t.className='m-track';
    t.innerHTML = el.innerHTML + el.innerHTML; // doublé pour une boucle sans trou
    el.innerHTML=''; el.appendChild(t);
  });

  // 2. Lancer quand l'élément arrive à l'écran
  function lancer(el){
    el.classList.add('is-in');
    var type = el.dataset.m;
    if(type==='compte') compter(el);
    if(type==='ecrit' && !calme) ecrire(el);
  }
  if(!('IntersectionObserver' in window) || calme){
    $$('[data-m]').forEach(lancer);
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ lancer(e.target); io.unobserve(e.target);} });
    },{threshold:.18, rootMargin:'0px 0px -6% 0px'});
    $$('[data-m]').forEach(function(el){io.observe(el);});
  }

  function compter(el){
    var fin = parseFloat(el.dataset.to || el.textContent.replace(/[^\d.,-]/g,'').replace(',','.')) || 0;
    var dec = (String(el.dataset.to||'').split('.')[1]||'').length;
    var avant = el.dataset.before||'', apres = el.dataset.after||'';
    if(calme){ el.textContent = avant + fin.toLocaleString('fr-FR',{minimumFractionDigits:dec}) + apres; return; }
    var t0=null, d=1400;
    function pas(t){ if(!t0) t0=t; var p=Math.min((t-t0)/d,1); var v=fin*(1-Math.pow(1-p,3));
      el.textContent = avant + v.toLocaleString('fr-FR',{minimumFractionDigits:dec,maximumFractionDigits:dec}) + apres;
      if(p<1) requestAnimationFrame(pas); }
    requestAnimationFrame(pas);
  }
  function ecrire(el){
    var txt = el.dataset.mText, i=0;
    (function tape(){ el.textContent = txt.slice(0,++i); if(i<txt.length) setTimeout(tape, 38+Math.random()*40); })();
  }

  if(calme) return;

  // 3. Effets qui suivent la souris (désactivés sur téléphone : pas de souris)
  if(!tactile){
    $$('[data-m="aimant"]').forEach(function(el){
      el.addEventListener('mousemove',function(e){ var r=el.getBoundingClientRect();
        el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.25)+'px,'+((e.clientY-r.top-r.height/2)*.35)+'px)'; });
      el.addEventListener('mouseleave',function(){ el.style.transform=''; });
    });
    $$('[data-m="incline"]').forEach(function(el){
      el.addEventListener('mousemove',function(e){ var r=el.getBoundingClientRect();
        var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        el.style.transform='perspective(900px) rotateY('+(x*10)+'deg) rotateX('+(-y*10)+'deg)'; });
      el.addEventListener('mouseleave',function(){ el.style.transform=''; });
    });
  }
  $$('[data-m="halo"]').forEach(function(el){
    function bouge(x,y){ var r=el.getBoundingClientRect(); el.style.setProperty('--mx',(x-r.left)+'px'); el.style.setProperty('--my',(y-r.top)+'px'); }
    el.addEventListener('mousemove',function(e){bouge(e.clientX,e.clientY);});
    el.addEventListener('touchmove',function(e){var t=e.touches[0]; bouge(t.clientX,t.clientY);},{passive:true});
  });

  // 4. Effets liés au défilement
  var barre = document.querySelector('.m-progress');
  var prof = $$('[data-m="profondeur"]');
  if(barre || prof.length){
    var tic=false;
    window.addEventListener('scroll',function(){ if(tic) return; tic=true; requestAnimationFrame(function(){
      var h=document.documentElement; var p=h.scrollTop/((h.scrollHeight-h.clientHeight)||1);
      if(barre) barre.style.transform='scaleX('+p+')';
      prof.forEach(function(el){ var r=el.getBoundingClientRect(); var v=parseFloat(el.dataset.speed||.15);
        el.style.transform='translateY('+((r.top+r.height/2-innerHeight/2)*-v)+'px)'; });
      tic=false; }); },{passive:true});
  }
})();
