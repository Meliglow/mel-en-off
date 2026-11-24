/* Compteur de visites maison : sans cookie, sans identifiant, rien n'est gardé sur le téléphone.
   Le serveur ne garde que des totaux par jour (voir lib/stats-store.ts). */
(() => {
  const qs = new URLSearchParams(location.search);
  const envoyer = (e) => {
    const data = JSON.stringify({ e, p: location.pathname, r: document.referrer, us: qs.get('utm_source') || '', uc: qs.get('utm_campaign') || '', ac: qs.get('acces') || '' });
    try { if (navigator.sendBeacon && navigator.sendBeacon('/api/stats', data)) return; } catch (x) {}
    try { fetch('/api/stats', { method: 'POST', body: data, keepalive: true }); } catch (x) {}
  };
  window.mnStat = envoyer;
  envoyer('vue');
  if (qs.get('paiement') === 'ok') envoyer('paiement_ok');
  document.addEventListener('click', (ev) => {
    const el = ev.target && ev.target.closest ? ev.target.closest('a,button') : null;
    if (el && /je prends ma place|je veux mon logiciel/i.test(el.textContent || '')) envoyer('clic_place');
  }, true);
})();
