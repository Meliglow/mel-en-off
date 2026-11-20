// Guide offert : inscription par email (consentement obligatoire), puis accès au guide.
(() => {
  const GUIDE = '/guide-offert';
  const KEY = 'melnourdi-guide';
  const remember = () => { try { localStorage.setItem(KEY, '1'); } catch (e) {} };
  document.addEventListener('submit', async (event) => {
    const form = event.target.closest('[data-lead-form]');
    if (!form) return;
    event.preventDefault();
    const feedback = form.querySelector('.lead-feedback');
    const say = (text) => { feedback.textContent = text; feedback.hidden = false; };
    const email = form.elements.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { say('Vérifie ton adresse email.'); form.elements.email.focus(); return; }
    if (!form.elements.consentement.checked) { say('Coche la case pour recevoir le guide.'); form.elements.consentement.focus(); return; }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    say('Un instant…');
    try {
      const response = await fetch('/api/inscription', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, consentement: true, source: 'guide-7-choses-reseaux' }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.message || '');
      remember();
      say('C’est fait ! Ton guide s’ouvre…');
      window.location.href = GUIDE;
    } catch (error) {
      say((error && error.message) || 'L’inscription n’a pas pu aboutir. Réessaie dans un instant.');
      button.disabled = false;
    }
  });
  const gate = document.querySelector('[data-guide-gate]');
  const guide = document.querySelector('[data-guide]');
  if (gate && guide) {
    let open = false;
    try { open = localStorage.getItem(KEY) === '1'; } catch (e) {}
    gate.hidden = open;
    guide.hidden = !open;
  }
})();
