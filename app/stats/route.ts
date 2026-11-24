// Page privée des statistiques de melnourdi.fr (24/11/2026), protégée par mot de passe.
// Le mot de passe n'est pas dans le code : seule son empreinte (scrypt + sel) l'est.
import { scryptSync, timingSafeEqual } from "node:crypto";
import { resumer, type Resume } from "@/lib/stats-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SEL = "3b995439226492092a182113b6bf7898";
const EMPREINTE = "93e5d6f73dde5f69bcba30021ea3d4f8e8107a3edb6129b1182f08fc960c18f1";

let echecs: number[] = [];
function motDePasseValide(request: Request) {
  const entete = request.headers.get("authorization") || "";
  if (!entete.startsWith("Basic ")) return false;
  const maintenant = Date.now();
  echecs = echecs.filter((t) => maintenant - t < 10 * 60 * 1000);
  if (echecs.length >= 30) return false; // trop d'essais ratés en 10 minutes
  let motDePasse = "";
  try {
    const decode = Buffer.from(entete.slice(6), "base64").toString("utf8");
    motDePasse = decode.slice(decode.indexOf(":") + 1);
  } catch {}
  const calcule = scryptSync(motDePasse.trim(), SEL, 32);
  const ok = timingSafeEqual(calcule, Buffer.from(EMPREINTE, "hex"));
  if (!ok) echecs.push(maintenant);
  return ok;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const nb = (n: number) => n.toLocaleString("fr-FR");
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)} %` : "–");
const dateFr = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { timeZone: "UTC", ...opts });
const NOMS_PAGES: Record<string, string> = {
  "/": "Accueil",
  "/logiciel-reservation": "Page du logiciel",
  "/guide-gratuit": "Guide gratuit",
  "/demo-reservation": "Démo du logiciel",
  "/mon-histoire": "Mon histoire",
};

function barres(lignes: [string, number][], total: number) {
  if (!lignes.length) return `<p class="vide">Rien pour l’instant.</p>`;
  const max = Math.max(...lignes.map((l) => l[1]), 1);
  return `<ul class="barres">${lignes
    .map(
      ([nom, n]) =>
        `<li><div class="l"><span>${esc(nom)}</span><b>${nb(n)}<small>${pct(n, total)}</small></b></div><i style="--w:${Math.max(2, (n / max) * 100)}%"></i></li>`,
    )
    .join("")}</ul>`;
}

function page(r: Resume, nbJours: number) {
  const ev = (k: string) => r.evenements[k] || 0;
  const vuesPage = (p: string) => r.pages.find(([k]) => k === p)?.[1] || 0;
  const etapes: [string, number, string?][] = [
    ["Visites sur le site", r.totaux.entrees],
    ["Vues de l’accueil", vuesPage("/")],
    ["Inscriptions au guide gratuit", ev("guide_inscrit")],
    ["Vues de la page du logiciel", vuesPage("/logiciel-reservation"), `dont ${nb(r.totaux.logicielDepuisGuide)} juste après le guide`],
    ["Clics « Je prends ma place »", ev("clic_place")],
    ["Paiements commencés", ev("paiement_lance")],
    ["Retours après paiement", ev("paiement_ok")],
  ];
  const maxJour = Math.max(...r.jours.map((j) => j.entrees), 1);
  const jours = [...r.jours].reverse();
  const onglet = (n: number, label: string) => `<a href="?j=${n}"${n === nbJours ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Tes statistiques · melnourdi</title>
<style>
@font-face{font-family:Manrope;src:url('/melnourdi/assets/manrope-latin.woff2') format('woff2');font-weight:200 800;font-display:swap}
:root{--ivoire:#F9F7F2;--blanc:#fff;--encre:#161616;--citron:#E8F06E;--trait:#ECE7DC;--doux:#5E5A52}
*{box-sizing:border-box}body{margin:0;background:var(--ivoire);color:var(--encre);font:500 16px/1.45 Manrope,system-ui,sans-serif}
main{max-width:640px;margin:0 auto;padding:24px 16px 56px}
.logo{font-weight:800;font-size:22px;letter-spacing:-.04em;text-decoration:none;color:inherit}.logo span{background:var(--citron);padding:0 2px}
h1{font-size:30px;line-height:1.1;letter-spacing:-.03em;margin:22px 0 6px}
h2{font-size:19px;letter-spacing:-.02em;margin:34px 0 12px}
.sous{color:var(--doux);margin:0}
.onglets{display:flex;gap:8px;margin:18px 0 6px}.onglets a{flex:1;text-align:center;padding:10px 0;border-radius:999px;border:1.5px solid var(--encre);color:var(--encre);text-decoration:none;font-weight:700;font-size:15px}
.onglets a[aria-current]{background:var(--encre);color:var(--citron)}
.alerte{background:var(--citron);border-radius:16px;padding:12px 14px;margin:16px 0 0;font-size:14px}
.cartes{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}
.carte{background:var(--blanc);border:1px solid var(--trait);border-radius:18px;padding:14px}.carte b{display:block;font-size:28px;letter-spacing:-.03em;line-height:1.1}.carte span{font-size:14px;color:var(--doux)}
.carte.noire{background:var(--encre);color:var(--ivoire);border-color:var(--encre)}.carte.noire b{color:var(--citron)}.carte.noire span{color:#CFCBC2}
.barres{list-style:none;margin:0;padding:0;display:grid;gap:10px}.barres li{background:var(--blanc);border:1px solid var(--trait);border-radius:14px;padding:10px 12px}
.barres .l{display:flex;justify-content:space-between;gap:12px;font-size:15px}.barres b small{font-weight:600;color:var(--doux);margin-left:8px;font-size:13px}
.barres i{display:block;height:6px;border-radius:6px;margin-top:8px;background:var(--citron);width:var(--w)}
.parcours{list-style:none;margin:0;padding:0;display:grid;gap:8px;counter-reset:e}
.parcours li{display:grid;grid-template-columns:28px 1fr auto;gap:10px;align-items:center;background:var(--blanc);border:1px solid var(--trait);border-radius:14px;padding:10px 12px;counter-increment:e}
.parcours li:before{content:counter(e);width:26px;height:26px;border-radius:50%;background:var(--encre);color:var(--citron);display:grid;place-items:center;font-weight:800;font-size:13px}
.parcours b{font-size:20px}.parcours small{display:block;color:var(--doux);font-size:13px}.parcours em{font-style:normal;color:var(--doux);font-size:13px;display:block;text-align:right}
.jours{list-style:none;margin:0;padding:0;display:grid;gap:4px}.jours li{display:grid;grid-template-columns:92px 1fr 44px;gap:10px;align-items:center;font-size:14px}
.jours i{display:block;height:10px;border-radius:6px;background:var(--encre);width:var(--w);min-width:2px}.jours b{text-align:right}
.vide{color:var(--doux);font-size:15px}
.note{margin-top:36px;font-size:13px;color:var(--doux)}code{background:var(--blanc);border:1px solid var(--trait);border-radius:6px;padding:1px 5px;font-size:13px}
</style></head><body><main>
<a class="logo" href="/">melnourdi<span>.</span></a>
<h1>Tes statistiques</h1>
<p class="sous">Compté depuis le ${esc(dateFr(r.debut, { day: "numeric", month: "long", year: "numeric" }))}.</p>
<nav class="onglets" aria-label="Période">${onglet(7, "7 jours")}${onglet(30, "30 jours")}${onglet(90, "90 jours")}</nav>
${r.durable ? "" : `<p class="alerte">Pour l’instant, les chiffres repartent à zéro à chaque mise à jour du site. Ils seront gardés dès que le stockage sera branché.</p>`}
<div class="cartes">
<div class="carte noire"><b>${nb(r.totaux.entrees)}</b><span>visites</span></div>
<div class="carte"><b>${nb(r.totaux.vues)}</b><span>pages vues</span></div>
<div class="carte"><b>${nb(ev("guide_inscrit"))}</b><span>inscriptions au guide</span></div>
<div class="carte"><b>${nb(ev("paiement_ok"))}</b><span>retours après paiement</span></div>
</div>
<h2>D’où viennent tes visiteurs</h2>
${barres(r.sources, r.totaux.entrees)}
<h2>Le parcours</h2>
<ol class="parcours">${etapes
    .map(([nom, n, detail], i) => `<li><div>${esc(nom)}${detail ? `<small>${esc(detail)}</small>` : ""}</div><div><b>${nb(n)}</b>${i > 0 ? `<em>${pct(n, etapes[0][1])} des visites</em>` : ""}</div></li>`)
    .join("")}</ol>
<h2>Visites par jour</h2>
<ul class="jours">${jours
    .map((j) => `<li><span>${esc(dateFr(j.date, { weekday: "short", day: "numeric", month: "short" }))}</span><i style="--w:${(j.entrees / maxJour) * 100}%"></i><b>${nb(j.entrees)}</b></li>`)
    .join("")}</ul>
<h2>Pages les plus vues</h2>
${barres(r.pages.map(([p, n]) => [NOMS_PAGES[p] || p, n] as [string, number]), r.totaux.vues)}
${r.campagnes.length ? `<h2>Liens étiquetés (campagnes)</h2>${barres(r.campagnes, r.totaux.entrees)}` : ""}
<p class="note">Sans cookie et sans donnée personnelle : le site ne garde que des totaux par jour. Une « visite » est une arrivée depuis l’extérieur du site. Pour reconnaître TikTok à coup sûr, mets ce lien dans ta bio : <code>melnourdi.fr/?utm_source=tiktok#gratuit</code>. Les ventes réelles restent à vérifier dans tes emails de commande.</p>
</main></body></html>`;
}

export async function GET(request: Request) {
  if (!motDePasseValide(request)) {
    return new Response("Mot de passe requis.", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Statistiques melnourdi", charset="UTF-8"', "Cache-Control": "no-store" },
    });
  }
  const demande = Number(new URL(request.url).searchParams.get("j"));
  const nbJours = [7, 30, 90].includes(demande) ? demande : 7;
  const html = page(await resumer(nbJours), nbJours);
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
