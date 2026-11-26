import { verifierAchat, livrer } from "@/lib/kits";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const esc = (v: string) => v.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const CSS = `:root{--ink:#161616;--mut:#6F6A62;--lime:#E8F06E;--ivo:#F9F7F2;--line:#E6E1D6}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--ivo);color:var(--ink);font:500 15px/1.5 Manrope,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.page{max-width:640px;margin:0 auto;padding:0 18px 60px}
.bar{display:flex;align-items:center;justify-content:space-between;padding:18px 0 0}
.bar a{color:var(--ink);text-decoration:none;font-weight:800;font-size:20px;letter-spacing:-.04em}.bar a span{color:#b9c22a}
.hero{margin-top:18px;background:var(--ink);color:#fff;border-radius:28px;padding:26px 22px;display:grid;gap:14px}
.ok{width:46px;height:46px;border-radius:50%;background:var(--lime);display:grid;place-items:center}
.ok svg{width:24px;height:24px;fill:none;stroke:var(--ink);stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
h1{font-size:clamp(28px,7vw,38px);line-height:1.1;letter-spacing:-.035em;font-weight:800}
.hero p{color:#d9d4c8;font-size:16px}
.btns{display:grid;gap:10px;margin-top:6px}
.btn{display:flex;align-items:center;justify-content:center;gap:10px;font-weight:800;font-size:16px;padding:16px 22px;border-radius:999px;text-decoration:none;text-align:center}
.btn.l{background:var(--lime);color:var(--ink)}.btn.w{background:transparent;color:#fff;border:1.5px solid #4a4a4a}
.btn svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;flex:none}
.note{font-size:13px;color:#a9a497}
h2{font-size:22px;letter-spacing:-.02em;font-weight:800;margin:36px 0 14px}
.et{display:grid;gap:10px}
.e{background:#fff;border:1.5px solid var(--line);border-radius:18px;padding:16px;display:flex;gap:12px;align-items:flex-start}
.e i{width:28px;height:28px;border-radius:50%;background:var(--ink);color:var(--lime);display:grid;place-items:center;font-style:normal;font-weight:800;font-size:13px;flex:none}
.e b{display:block;font-size:15.5px;margin-bottom:2px}.e p{font-size:14px;color:var(--mut)}
.e code{font:inherit;font-weight:800;color:var(--ink);background:var(--lime);border-radius:6px;padding:0 5px}
.aide{margin-top:26px;background:#fff;border:1.5px solid var(--ink);border-radius:18px;padding:16px;font-size:14.5px}
.aide a{color:var(--ink);font-weight:800}
.pied{margin-top:26px;display:flex;gap:18px;flex-wrap:wrap;font-size:12.5px;color:var(--mut)}.pied a{color:var(--mut)}`;

function page(title: string, body: string, status = 200) {
  return new Response(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)} — melnourdi.</title><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><meta name="theme-color" content="#F9F7F2">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet"><style>${CSS}</style></head>
<body><main class="page"><div class="bar"><a href="/">melnourdi<span>.</span></a></div>${body}
<footer class="pied"><a href="/">melnourdi.fr</a><a href="/mentions-legales">Mentions légales</a><a href="/confidentialite">Confidentialité</a></footer></main></body></html>`, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex", "Referrer-Policy": "no-referrer" },
  });
}

export async function GET(request: Request) {
  const session = new URL(request.url).searchParams.get("session") || "";
  const achat = await verifierAchat(session).catch(() => null);
  if (!achat) {
    return page("Lien introuvable", `<section class="hero"><h1>On ne retrouve pas cet achat.</h1>
<p>Si tu viens de payer, attends quelques secondes et recharge la page. Sinon, ouvre le lien reçu par mail.</p>
<div class="btns"><a class="btn l" href="">Recharger la page</a></div></section>
<div class="aide">Toujours bloqué ? Écris-moi à <a href="mailto:contact@melnourdi.fr">contact@melnourdi.fr</a> avec l'email utilisé pour payer. Je t'envoie ton kit.</div>`, 404);
  }
  await livrer(achat).catch(e => console.error("Livraison kit", e));
  const k = achat.kit;
  const s = encodeURIComponent(achat.session);
  const prenom = achat.prenom ? ` ${esc(achat.prenom)}` : "";
  return page(k.nom, `<section class="hero">
<div class="ok"><svg viewBox="0 0 24 24"><path d="m5 12 5 5L20 7"/></svg></div>
<h1>Merci${prenom} ! Ton ${esc(k.nom.replace(/^Kit/, "kit"))} est à toi.</h1>
<p>Télécharge le fichier du kit, puis suis les 4 étapes en dessous. Compte ${esc(k.duree)} en tout.</p>
<div class="btns">
<a class="btn l" href="/api/kit-fichier?session=${s}&f=kit" download><svg viewBox="0 0 24 24"><path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>Télécharger mon kit</a>
<a class="btn w" href="/api/kit-fichier?session=${s}&f=guide" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/></svg>Ouvrir le guide</a>
</div>
<p class="note">${achat.email ? `Ce lien t'a aussi été envoyé par mail à ${esc(achat.email)}. ` : ""}Il marche à chaque fois que tu en as besoin. Il est personnel : ne le partage pas.</p>
</section>
<h2>Installer ton kit</h2>
<div class="et">
<div class="e"><i>1</i><div><b>Télécharge le kit, sans l'ouvrir</b><p>Tu obtiens le fichier <code>${esc(k.zip)}</code>. Laisse-le tel quel, Claude le lit directement.</p></div></div>
<div class="e"><i>2</i><div><b>Active la création de fichiers dans Claude</b><p>Sur claude.ai, de préférence sur ordinateur : Paramètres &gt; Capacités &gt; active <code>Créer et modifier des fichiers</code>. Le compte gratuit suffit.</p></div></div>
<div class="e"><i>3</i><div><b>Importe le kit</b><p>Personnaliser &gt; Compétences &gt; bouton + &gt; Créer une compétence &gt; Télécharger une compétence, puis choisis <code>${esc(k.zip)}</code>.</p></div></div>
<div class="e"><i>4</i><div><b>Lance l'installation</b><p>Ouvre une nouvelle conversation et écris <code>${esc(k.phrase)}</code>. Claude te pose ses questions, tu cliques tes réponses.</p></div></div>
</div>
<div class="aide">Tu bloques à une étape ? Réponds au mail reçu ou écris à <a href="mailto:contact@melnourdi.fr">contact@melnourdi.fr</a>. Je te réponds.</div>`);
}
