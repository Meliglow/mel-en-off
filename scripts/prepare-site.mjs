/** Build the approved static landing pages, keeping the existing Next routes/API. */
import { mkdir, readFile, writeFile, copyFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { productMontage } from '../previews/melnourdi-v1/reservation-montage.mjs';
import { salesHero, salesBenefits } from '../previews/melnourdi-v1/reservation-sales.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'previews/melnourdi-v1');
const output = path.join(root, 'public/melnourdi');
await mkdir(path.join(output, 'assets'), { recursive: true });

function replaceRequired(html, pattern, replacement, label) {
  if (!html.match(pattern)) throw new Error(`Missing release replacement: ${label}`);
  return html.replace(pattern, replacement);
}

function common(html, canonical) {
  return html
    .replace(/  <meta name="robots"[^>]*>\r?\n/, '')
    .replace(/  <div class="preview-bar">.*?<\/div>\r?\n/, '')
    .replace('Aperçu de Melnourdi :', 'Melnourdi :')
    .replace('</head>', `  <link rel="canonical" href="https://melnourdi.fr${canonical}">\n</head>`)
    .replaceAll('href="styles.css"', 'href="/melnourdi/styles.css"')
    .replaceAll('href="liens.css"', 'href="/melnourdi/liens.css"')
    .replaceAll('src="app.js"', 'src="/melnourdi/app.js"')
    .replaceAll('src="liens.js"', 'src="/melnourdi/liens.js"')
    .replaceAll('href="lead.css"', 'href="/melnourdi/lead.css"')
    .replaceAll('src="lead.js"', 'src="/melnourdi/lead.js"')
    .replaceAll('href="signature.css"', 'href="/melnourdi/signature.css"')
    .replaceAll('src="signature.js"', 'src="/melnourdi/signature.js"')
    .replaceAll('src="assets/', 'src="/melnourdi/assets/')
    .replaceAll('href="index.html', 'href="/');
}

let home = common(await readFile(path.join(source, 'index.html'), 'utf8'), '/');
home = home.replace(/<form class="waitlist-form"[\s\S]*?<\/form>/, `<div class="waitlist-form">
  <label for="first-name">Ton prénom</label><input id="first-name" placeholder="Ton prénom" disabled>
  <label for="email">Ton adresse email</label><input id="email" type="email" placeholder="toi@exemple.fr" disabled>
  <button class="button button-lime" disabled>Inscriptions bientôt ouvertes</button>
  <p class="form-context">La liste d’attente ouvrira prochainement. Aucune inscription n’est collectée pour le moment.</p>
</div>`);
home = home.replace('En attendant, suis la préparation de ma première formation et reçois les nouvelles de son lancement.', 'Le guide gratuit est en préparation. Retrouve bientôt les étapes pour présenter et vendre ton offre.');
home = home.replace('href="#liste-attente">Être au courant', 'href="/liens">Découvrir mes liens');
home = home.replace('Inscris-toi pour découvrir l’avancement de la formation et être prévenu de l’ouverture des inscriptions.', 'La première formation est en préparation. Tu pourras bientôt t’inscrire pour suivre son avancement et recevoir les nouvelles de son lancement.');
home = replaceRequired(home, /<form class="contact-form"[\s\S]*?<\/form>/, `<p>Écris-moi en précisant ton activité, ce que tu aimerais créer et les difficultés que tu rencontres.</p><a class="button button-dark" href="mailto:contact@melnourdi.fr?subject=Mon%20projet%20sur%20mesure">M’écrire par email</a>`, 'contact email');
home = home.replace('Quelques lignes pour comprendre ton activité et ce dont tu as besoin.', 'Parlons de ton activité et de ce dont tu as besoin.');
home = home.replace('L’espace élève n’est pas encore connecté dans cet aperçu. Aucun compte n’est créé.', 'L’espace élève ouvrira avec les formations. Aucun compte ne peut être créé pour le moment.');
home = home.replace('<button data-dialog="legal">Mentions légales</button>', '<a href="/mentions-legales">Mentions légales</a>');
home = home.replace('<button data-dialog="privacy">Confidentialité</button>', '<a href="/confidentialite">Confidentialité</a>');
home = home.replace('<span>© 2026 Mel Nourdi</span>', '<span>© 2026 Mel Nourdi</span><a href="/liens">Tous mes liens</a>');
home = home.replace(/<noscript>[\s\S]*?<\/noscript>/, '<noscript><p class="noscript-note">Pour une demande de projet, écris à <a href="mailto:contact@melnourdi.fr">contact@melnourdi.fr</a>. Les formations et le guide sont en préparation.</p><style>button[data-dialog]{display:none}</style></noscript>');

let links = common(await readFile(path.join(source, 'liens.html'), 'utf8'), '/liens');
links = links.replace('En attendant, tu peux rejoindre ma communauté email.', 'L’inscription à ma communauté email sera également disponible prochainement.');
links = replaceRequired(links, /<form id="community-form"[\s\S]*?<\/form>/, '<p class="dialog-notice">Les inscriptions ouvriront prochainement. Aucune adresse email n’est collectée pour le moment.</p>', 'community unavailable');
links = links.replace('<button data-panel="privacy">Confidentialité</button>', '<a class="privacy-link" href="/confidentialite">Confidentialité</a>');
links = links.replace(/<template id="privacy-panel">[\s\S]*?<\/template>/, '');
links = links.replace(/<noscript>[\s\S]*?<\/noscript>/, '<noscript><p class="noscript-note">Le guide gratuit et les inscriptions email seront disponibles prochainement.</p><style>[data-panel]{display:none}</style></noscript>');

// Guide offert (20 novembre 2026) : accessible après inscription email, non indexé.
let guide = common(await readFile(path.join(source, 'guide.html'), 'utf8'), '/guide-offert');
guide = guide.replace('</head>', '  <meta name="robots" content="noindex">\n</head>');
for (const [name, html] of [['index.html', home], ['liens.html', links], ['guide.html', guide]]) {
  if (/Aperçu|démonstration|non publiée|formulaire de démonstration/i.test(html)) throw new Error(`Preview-only copy leaked into ${name}`);
  await writeFile(path.join(output, name), html);
}
for (const name of ['styles.css', 'liens.css', 'lead.css', 'lead.js', 'signature.css', 'signature.js']) await copyFile(path.join(source, name), path.join(output, name));
await writeFile(path.join(output, 'release.css'), 'button:disabled,input:disabled{cursor:not-allowed;opacity:.6}.footer-bottom a{display:inline-flex;align-items:center;min-height:44px}.links-footer .privacy-link{font-size:10px;font-weight:400;letter-spacing:normal;color:var(--muted)}');
for (const name of ['index.html','liens.html']) {
  const html = await readFile(path.join(output, name), 'utf8');
  await writeFile(path.join(output, name), html.replace('</head>', '<link rel="stylesheet" href="/melnourdi/release.css"></head>'));
}
let app = await readFile(path.join(source, 'app.js'), 'utf8');
app = app.slice(0, app.indexOf("document.addEventListener('submit'"));
app = app.replace('Aucun achat n’est possible dans cet aperçu.', 'Les ventes ne sont pas encore ouvertes.');
await writeFile(path.join(output, 'app.js'), app);
let linksScript = await readFile(path.join(source, 'liens.js'), 'utf8');
linksScript = linksScript.slice(0, linksScript.indexOf("document.addEventListener('submit'"));
await writeFile(path.join(output, 'liens.js'), linksScript);
for (const asset of await readdir(path.join(source, 'assets'))) {
  await copyFile(path.join(source, 'assets', asset), path.join(output, 'assets', asset));
}
// Refresh cached CSS/JS when a deployment changes their contents.
for (const name of ['index.html', 'liens.html', 'guide.html']) {
  let html = await readFile(path.join(output, name), 'utf8');
  for (const asset of ['styles.css', 'liens.css', 'release.css', 'app.js', 'liens.js', 'lead.css', 'lead.js', 'signature.css', 'signature.js']) {
    const version = createHash('sha256').update(await readFile(path.join(output, asset))).digest('hex').slice(0, 12);
    html = html.replaceAll(`/melnourdi/${asset}"`, `/melnourdi/${asset}?v=${version}"`);
  }
  await writeFile(path.join(output, name), html);
}
// The offer and demo pages are independent of the older preview-only forms.
// Page de vente v3 (18 novembre 2026) : page autonome, styles et scripts intégrés.
// Les chiffres de l'offre viennent de config/booking-offer.json. L'ancienne v2 reste dans previews/ pour revenir en arrière.
const offerConfig = JSON.parse(await readFile(path.join(root, 'config/booking-offer.json'), 'utf8'));
const publicOffer = { launchPrice: offerConfig.launchPrice, standardPrice: offerConfig.standardPrice, launchLimit: offerConfig.launchLimit, launchPlacesLeft: offerConfig.launchPlacesLeft, launchEndsAt: offerConfig.launchEndsAt, hostingMonthly: offerConfig.hostingMonthly, packPrice: offerConfig.packPrice, packOptions: offerConfig.packOptions, options: offerConfig.options.map(({ id, label, price, description }) => ({ id, label, price, description })) };
let offer = replaceRequired(common(await readFile(path.join(source, 'reservation-v3.html'), 'utf8'), '/logiciel-reservation'), '{{OFFER_JSON}}', JSON.stringify(publicOffer).replaceAll('<', '\\u003c'), 'offer data');
for (const asset of ['reservation.css', 'reservation.js', 'booking.css', 'booking.js','offer-v2.css','offer-v2.js','deposit.css','lodyva.css','lodyva.js','lodyva-schedule.mjs','configurer.css','configurer.js']) {
  await copyFile(path.join(source, asset), path.join(output, asset));
}
await copyFile(path.join(root,'lib/booking-validation.mjs'),path.join(output,'booking-validation.mjs'));
for (const name of ['administration.css','administration.js','mobile-polish.css','reservation-motion.css','reservation-motion.js','reservation-media.css','reservation-media.js','reservation-sales.css','reservation-sales.js','reservation-calendar.css']) await copyFile(path.join(source,name),path.join(output,name));
const extraFiles=['lodyva.html','configurer.html','administration.html'];
for (const name of extraFiles) await copyFile(path.join(source,name),path.join(output,name));
const models = JSON.parse(await readFile(path.join(source, 'booking-models.json'), 'utf8'));
const demoTemplate = await readFile(path.join(source, 'booking.html'), 'utf8');
const demoFiles = [];
const escapeHtml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
for (const [key, model] of Object.entries(models)) {
  const tokens = { KEY: key, LABEL: model.label, BRAND: model.brand, TAG: model.tag, HEADLINE: model.headline, INTRO: model.intro, PHOTO: model.photo, ALT: model.alt };
  let html = demoTemplate.replace(/\{\{([A-Z]+)\}\}/g, (match, token) => token === 'DATA' ? JSON.stringify(model).replaceAll('<', '\\u003c') : escapeHtml(tokens[token] ?? match));
  const name = `demo-${key}.html`;
  await writeFile(path.join(output, name), html);
  demoFiles.push(name);
}
await writeFile(path.join(output, 'reservation.html'), offer);
for (const name of ['reservation.html', ...demoFiles,...extraFiles]) {
  let html = await readFile(path.join(output, name), 'utf8');
  if(['lodyva.html','configurer.html'].includes(name))html=html.replace('</head>','<link rel="stylesheet" href="/melnourdi/mobile-polish.css"></head>');
  for (const asset of ['styles.css', 'reservation.css', 'reservation.js', 'booking.css', 'booking.js','offer-v2.css','offer-v2.js','deposit.css','lodyva.css','lodyva.js','configurer.css','configurer.js','administration.css','administration.js','mobile-polish.css','reservation-motion.css','reservation-motion.js','reservation-media.css','reservation-media.js','reservation-sales.css','reservation-sales.js','reservation-calendar.css']) {
    const version = createHash('sha256').update(await readFile(path.join(output, asset))).digest('hex').slice(0, 12);
    html = html.replaceAll(`/melnourdi/${asset}"`, `/melnourdi/${asset}?v=${version}"`);
  }
  await writeFile(path.join(output, name), html);
}
console.log('Melnourdi: landing, /liens, booking offer and three isolated demos prepared.');
