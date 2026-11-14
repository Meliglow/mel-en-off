const dialog = document.querySelector('#info-dialog');
const content = document.querySelector('#dialog-content');
let opener = null;

const notices = {
  legal: ['Mentions légales', 'Les informations de l’entreprise éditrice et de l’hébergement seront complétées avant publication. Cette page est un aperçu local non publié.'],
  terms: ['Conditions générales de vente', 'Les conditions de vente seront rédigées avec les offres : prix, modalités d’accès, assistance et conditions applicables. Aucun achat n’est possible dans cet aperçu.'],
  privacy: ['Confidentialité', 'Cet aperçu ne collecte ni ne transmet tes données. Les formulaires sont des démonstrations locales, sans stockage. La politique du futur site sera complétée avec les services effectivement utilisés.'],
};

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-dialog]');
  if (trigger) {
    opener = trigger;
    const key = trigger.dataset.dialog;
    const template = document.querySelector(`#${key}-template`);
    content.replaceChildren();
    if (template) content.append(template.content.cloneNode(true));
    else if (notices[key]) {
      const heading = document.createElement('h2');
      heading.id = 'dialog-title';
      heading.textContent = notices[key][0];
      const paragraph = document.createElement('p');
      paragraph.textContent = notices[key][1];
      content.append(heading, paragraph);
    }
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }
  if (event.target.closest('.dialog-close,[data-close-dialog]')) dialog.close();
});

dialog.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});

dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  if (opener) opener.focus({ preventScroll: true });
});

document.addEventListener('submit', (event) => {
  const form = event.target.closest('[data-demo-form]');
  if (!form) return;
  event.preventDefault();
  if (!form.reportValidity()) return;
  const feedback = form.querySelector('.form-feedback');
  feedback.textContent = form.dataset.demoForm === 'waitlist'
    ? 'Le parcours est prêt à être connecté. Dans cet aperçu, ton inscription n’a pas été enregistrée et aucun email ne sera envoyé.'
    : 'La démonstration du formulaire est terminée. Aucune demande n’a été envoyée et tes informations ne sont pas enregistrées.';
  feedback.hidden = false;
  form.reset();
  feedback.focus({ preventScroll: true });
});
