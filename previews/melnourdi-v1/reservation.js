const monthly = document.querySelector('#monthly-cost');
const annual = document.querySelector('#annual-cost');
const euros = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
monthly.addEventListener('input', () => {
  const amount = monthly.valueAsNumber;
  annual.replaceChildren(document.createTextNode(monthly.validity.valid && Number.isFinite(amount) ? euros.format(amount * 12) : '—'));
  const label = document.createElement('small');
  label.textContent = 'sur 12 mois';
  annual.append(label);
});
