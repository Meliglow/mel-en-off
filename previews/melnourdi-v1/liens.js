const panel = document.querySelector('#links-dialog');
const panelContent = document.querySelector('#panel-content');
let panelTrigger;

function showPanel(name) {
  const template = document.querySelector(`#${name}-panel`);
  if (!template) return;
  panelContent.replaceChildren(template.content.cloneNode(true));
  if (!panel.open) panel.showModal();
  panel.scrollTop = 0;
  document.body.style.overflow = 'hidden';
  panel.querySelector('.dialog-close').focus();
}

document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-panel]');
  if (trigger) {
    panelTrigger = trigger;
    showPanel(trigger.dataset.panel);
  }
  const switcher = event.target.closest('[data-switch]');
  if (switcher) showPanel(switcher.dataset.switch);
  if (event.target.closest('.dialog-close')) panel.close();
});

panel.addEventListener('click', event => {
  if (event.target !== panel) return;
  const box = panel.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) panel.close();
});

panel.addEventListener('close', () => {
  document.body.style.overflow = '';
  panelTrigger?.focus({preventScroll:true});
});

document.addEventListener('submit', event => {
  if (event.target.id !== 'community-form') return;
  event.preventDefault();
  const form = event.target;
  if (!form.reportValidity()) return;
  const feedback = form.querySelector('.form-feedback');
  feedback.textContent = 'Tu viens de tester le parcours d’inscription. Cet aperçu ne conserve pas ton email et ne t’inscrit à aucune liste.';
  feedback.hidden = false;
  form.reset();
  feedback.focus({preventScroll:true});
});
