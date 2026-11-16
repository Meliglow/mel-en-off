(() => {
  'use strict';
  const model = JSON.parse(document.querySelector('#model-data').textContent);
  const $ = (selector) => document.querySelector(selector);
  const money = (value) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  const formatDate = (date, options) => new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', ...options }).format(date);
  const parisToday = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const baseDate = new Date(`${parisToday}T12:00:00Z`);
  baseDate.setUTCDate(baseDate.getUTCDate() + 1);
  const state = { step: 0, selected: [], day: null, time: null, week: 0, finished: false };
  let photoUrl = null;
  let photoGeneration = 0;
  const originalPhoto = $('#brand-photo').src;
  const selectedServices = () => model.services.filter((service) => state.selected.includes(service.id));
  const duration = () => selectedServices().reduce((total, service) => total + service.minutes, 0);
  const total = () => selectedServices().reduce((sum, service) => sum + service.price, 0);
  const longDate = (date) => formatDate(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const node = (tag, text, className) => { const element = document.createElement(tag); if (text !== undefined) element.textContent = text; if (className) element.className = className; return element; };

  function updateSummary() {
    const services = selectedServices();
    $('#summary-services').replaceChildren();
    if (!services.length) $('#summary-services').append(node('p', 'Ta prestation apparaîtra ici.'));
    services.forEach((service) => { const row = node('div', undefined, 'summary-service'); row.append(node('strong', service.name), node('span', `${service.minutes} min · ${money(service.price)}`)); $('#summary-services').append(row); });
    $('#summary-price').textContent = services.length ? money(total()) : '—';
    $('#summary-duration').textContent = services.length ? `Durée totale : ${duration()} min` : '';
    $('#summary-date').textContent = state.day ? longDate(state.day) : 'À choisir';
    $('#summary-time').textContent = state.time ? `${state.time} · heure de Paris` : '';
    $('#to-date').disabled = !services.length;
    $('#to-details').disabled = !state.day || !state.time;
    $('#service-status').textContent = services.length ? `${services.length} prestation${services.length > 1 ? 's' : ''} · ${duration()} min · ${money(total())}` : 'Choisis une prestation pour continuer.';
  }

  function setStep(step) {
    if ((step > 0 && !state.selected.length) || (step > 1 && !state.time) || (step === 3 && !state.finished)) return;
    state.step = step;
    document.querySelectorAll('[data-panel]').forEach((panel) => { panel.hidden = Number(panel.dataset.panel) !== step; });
    document.querySelectorAll('[data-step]').forEach((button) => {
      const index = Number(button.dataset.step);
      button.disabled = index > step;
      if (index === step) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
      button.classList.toggle('completed', index < step);
    });
    if (step === 1) renderDays();
    const panel = $(`[data-panel="${step}"]`);
    panel.querySelector('h3').focus({ preventScroll: true });
    $('#booking').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
  }

  $('#service-hint').textContent = model.multiple ? 'Tu peux sélectionner plusieurs prestations. La durée et le prix s’additionnent automatiquement.' : 'Sélectionne la prestation qui te correspond. Tu verras le prix avant de continuer.';
  model.services.forEach((service) => {
    const label = node('label', undefined, 'service-option');
    const input = document.createElement('input'); input.type = model.multiple ? 'checkbox' : 'radio'; input.name = 'service'; input.value = service.id;
    const copy = node('span', undefined, 'service-copy'); copy.append(node('small', service.category), node('strong', service.name), node('span', service.description));
    const price = node('span', undefined, 'service-price'); price.append(node('strong', money(service.price)), node('small', `${service.minutes} min`));
    label.append(input, copy, price); $('#service-list').append(label);
    input.addEventListener('change', () => {
      state.selected = [...document.querySelectorAll('input[name="service"]:checked')].map((item) => item.value);
      state.day = null; state.time = null; state.finished = false;
      $('#demo-consent').checked = false;
      updateSummary();
    });
  });

  function renderDays() {
    const first = new Date(baseDate); first.setUTCDate(first.getUTCDate() + state.week * 7);
    const last = new Date(first); last.setUTCDate(last.getUTCDate() + 6);
    $('#week-label').textContent = `${formatDate(first, { day: 'numeric', month: 'short' })} — ${formatDate(last, { day: 'numeric', month: 'short', year: 'numeric' })}`;
    $('#previous-week').disabled = state.week === 0; $('#next-week').disabled = state.week === 3;
    $('#date-list').replaceChildren();
    for (let index = 0; index < 7; index++) {
      const date = new Date(first); date.setUTCDate(date.getUTCDate() + index);
      const button = node('button', undefined, 'day-button'); button.type = 'button'; button.setAttribute('aria-label', longDate(date)); button.setAttribute('aria-pressed', String(state.day?.getTime() === date.getTime()));
      button.append(node('span', formatDate(date, { weekday: 'short' })), node('strong', formatDate(date, { day: 'numeric' })), node('small', formatDate(date, { month: 'short' })));
      button.addEventListener('click', () => { state.day = date; state.time = null; state.finished = false; $('#demo-consent').checked = false; updateSummary(); renderDays(); });
      $('#date-list').append(button);
    }
    renderSlots();
  }

  function renderSlots() {
    $('#slot-list').replaceChildren();
    $('#slots-title').textContent = state.day ? formatDate(state.day, { weekday: 'long', day: 'numeric', month: 'long' }) : 'Choisis un jour.';
    $('#duration-note').textContent = `${duration()} min`;
    $('#slot-empty').hidden = true;
    if (!state.day) return;
    if (state.day.getUTCDay() === 0) { $('#slot-empty').hidden = false; return; }
    // Illustrative availability: never read or write a real calendar.
    const slots = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
    const busyIndex = state.day.getUTCDate() % slots.length;
    slots.forEach((time, index) => {
      const [hours, minutes] = time.split(':').map(Number);
      const end = hours * 60 + minutes + duration();
      if (end > 18 * 60) return;
      const button = node('button', time, 'slot-button'); button.type = 'button'; button.disabled = index === busyIndex;
      button.setAttribute('aria-pressed', String(state.time === time));
      button.setAttribute('aria-label', button.disabled ? `${time}, indisponible` : time);
      if (button.disabled) button.title = 'Créneau indisponible dans la démonstration';
      button.addEventListener('click', () => { state.time = time; state.finished = false; $('#demo-consent').checked = false; updateSummary(); renderSlots(); });
      $('#slot-list').append(button);
    });
  }

  $('#to-date').addEventListener('click', () => setStep(1));
  $('#to-details').addEventListener('click', () => setStep(2));
  document.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', () => setStep(Number(button.dataset.back))));
  document.querySelectorAll('[data-step]').forEach((button) => button.addEventListener('click', () => setStep(Number(button.dataset.step))));
  function changeWeek(delta) { state.week = Math.max(0, Math.min(3, state.week + delta)); state.day = null; state.time = null; state.finished = false; $('#demo-consent').checked = false; renderDays(); updateSummary(); }
  $('#previous-week').addEventListener('click', () => changeWeek(-1));
  $('#next-week').addEventListener('click', () => changeWeek(1));
  $('#details-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $('#first-name'); name.setCustomValidity(name.value.trim() ? '' : 'Indique un prénom pour essayer.');
    if (!event.currentTarget.reportValidity() || !state.selected.length || !state.day || !state.time) return;
    state.finished = true;
    $('#confirmation-copy').textContent = `${name.value.trim()}, voilà à quoi ressemblerait le récapitulatif de ton rendez-vous.`;
    $('#confirmation-summary').replaceChildren(node('strong', selectedServices().map((service) => service.name).join(' + ')), node('p', `${longDate(state.day)} à ${state.time}`), node('p', `${duration()} min · ${money(total())} · tarif fictif`));
    setStep(3);
  });
  $('#first-name').addEventListener('input', () => $('#first-name').setCustomValidity(''));
  $('#restart-demo').addEventListener('click', () => {
    Object.assign(state, { step: 0, selected: [], day: null, time: null, week: 0, finished: false });
    document.querySelectorAll('input[name="service"]').forEach((input) => { input.checked = false; });
    $('#details-form').reset(); $('#first-name').setCustomValidity('');
    $('#confirmation-copy').textContent = ''; $('#confirmation-summary').replaceChildren();
    updateSummary(); setStep(0);
  });

  $('#brand-name').addEventListener('input', (event) => { document.querySelectorAll('[data-brand]').forEach((element) => { element.textContent = event.target.value.trim() || model.brand; }); });
  $('#brand-color').value = model.color;
  $('#brand-color').addEventListener('change', (event) => { document.body.style.setProperty('--accent', event.target.value); });
  $('#brand-image').addEventListener('change', async (event) => {
    const generation = ++photoGeneration;
    const file = event.target.files?.[0]; if (!file) return;
    const error = $('#image-error'); error.hidden = true;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { error.textContent = 'Choisis une image JPG, PNG ou WebP de moins de 5 Mo.'; error.hidden = false; event.target.value = ''; return; }
    const url = URL.createObjectURL(file); const image = new Image(); image.src = url;
    try { await image.decode(); } catch { URL.revokeObjectURL(url); if (generation !== photoGeneration) return; error.textContent = 'Cette image ne peut pas être lue. Essaie un autre fichier.'; error.hidden = false; event.target.value = ''; return; }
    if (generation !== photoGeneration) { URL.revokeObjectURL(url); return; }
    if (photoUrl) URL.revokeObjectURL(photoUrl); photoUrl = url;
    $('#brand-photo').src = url; $('#brand-photo').alt = 'Ta photo d’ambiance, chargée uniquement dans cette page';
  });
  $('#reset-brand').addEventListener('click', () => {
    photoGeneration++;
    $('#brand-name').value = model.brand; document.querySelectorAll('[data-brand]').forEach((element) => { element.textContent = model.brand; });
    $('#brand-color').value = model.color; document.body.style.removeProperty('--accent');
    $('#brand-image').value = ''; $('#brand-photo').src = originalPhoto; $('#brand-photo').alt = model.alt; $('#image-error').hidden = true;
    if (photoUrl) { URL.revokeObjectURL(photoUrl); photoUrl = null; }
  });
  updateSummary();
})();
