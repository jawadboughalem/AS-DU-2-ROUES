/**
 * Recette automatisée de la maquette.
 *
 * Lance le site puis : npm run recette
 * Contrôle : erreurs console, débordement horizontal de 320 à 1920 px,
 * onglets devis/rendez-vous, validation du formulaire, ancres et liens
 * d'appel, accessibilité de base, métadonnées et données structurées,
 * barre d'appel mobile.
 *
 * Sort en code 1 à la première anomalie : utilisable en CI.
 */
/* eslint-disable @typescript-eslint/no-unused-expressions --
   Les contrôles s'écrivent « condition ? ok(...) : fail(...) » : la forme
   ternaire garde une assertion par ligne, ce qui rend le fichier lisible
   comme une liste de vérifications. */
import { chromium } from "playwright";

const BASE = process.env.RECETTE_URL ?? "http://127.0.0.1:3000/";
const browser = await chromium.launch(
  // En local, Playwright trouve son propre Chromium ; CHROMIUM_PATH sert
  // aux environnements où le navigateur est déjà installé ailleurs.
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const L = { locale: "fr-FR", timezoneId: "Europe/Paris" };
const fails = [], warns = [], oks = [];
const ok = (m) => oks.push(m);
const warn = (m) => warns.push(m);
const fail = (m) => fails.push(m);

// ---------- 1. Erreurs console & réseau ----------
{
  const ctx = await browser.newContext({ ...L, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [], bad = [];
  p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
  p.on("pageerror", (e) => errs.push("pageerror: " + e.message));
  p.on("response", (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  errs.length ? fail(`Erreurs console : ${errs.join(" | ")}`) : ok("Aucune erreur console");
  bad.length ? fail(`Requêtes en échec : ${bad.join(" | ")}`) : ok("Aucune requête en échec");
  await ctx.close();
}

// ---------- 2. Débordement horizontal ----------
for (const w of [320, 360, 390, 430, 768, 1024, 1440, 1920]) {
  const ctx = await browser.newContext({ ...L, viewport: { width: w, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  const over = await p.evaluate(() => {
    const d = document.documentElement;
    const diff = d.scrollWidth - d.clientWidth;
    if (diff <= 1) return null;
    const guilty = [...document.querySelectorAll("*")]
      .filter((e) => e.getBoundingClientRect().right > d.clientWidth + 1)
      .slice(0, 3)
      .map((e) => e.tagName + "." + String(e.className).slice(0, 40));
    return { diff, guilty };
  });
  over ? fail(`Débordement horizontal à ${w}px (+${over.diff}px) : ${over.guilty.join(", ")}`)
       : ok(`Pas de débordement à ${w}px`);
  await ctx.close();
}

// ---------- 3. Onglets devis / RDV ----------
{
  const ctx = await browser.newContext({ ...L, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "networkidle" });
  const tabs = p.locator('[role="tab"]');
  (await tabs.count()) === 2 ? ok("Deux onglets présents") : fail("Nombre d'onglets inattendu");
  await tabs.nth(1).click();
  await p.waitForTimeout(300);
  const dateVisible = await p.locator("#date").isVisible().catch(() => false);
  dateVisible ? ok("Onglet RDV : champs date et créneau affichés") : fail("Onglet RDV : champ date absent");
  const sel = await tabs.nth(1).getAttribute("aria-selected");
  sel === "true" ? ok("aria-selected correct sur l'onglet actif") : fail("aria-selected non mis à jour");
  await tabs.nth(0).click();
  await p.waitForTimeout(300);
  const dateGone = !(await p.locator("#date").isVisible().catch(() => false));
  dateGone ? ok("Retour onglet devis : champ date masqué") : fail("Champ date toujours visible en mode devis");
  await ctx.close();
}

// ---------- 4. Formulaire : validation et envoi ----------
{
  const ctx = await browser.newContext({ ...L, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "networkidle" });
  await p.locator('button[type="submit"]').click();
  await p.waitForTimeout(400);
  const envoyé = await p.locator("text=Demande envoyée").isVisible().catch(() => false);
  envoyé ? fail("Le formulaire vide a été accepté") : ok("Formulaire vide bloqué par la validation");

  const piège = p.locator("#societe");
  (await piège.count()) === 1 ? ok("Piège à robots présent dans le formulaire") : fail("Piège à robots absent");
  // Le piège est déporté hors écran plutôt que masqué en display:none, que
  // les robots savent détecter. On vérifie donc sa position, pas sa visibilité.
  const boîte = await piège.boundingBox();
  boîte && boîte.x < 0
    ? ok(`Piège à robots hors écran (x = ${Math.round(boîte.x)})`)
    : fail("Le piège à robots est dans la zone visible");

  await p.fill("#marque", "Yamaha");
  await p.fill("#modele", "XMAX 125");
  await p.selectOption("#prestation", "freinage");
  await p.fill("#message", "Bruit au freinage à froid depuis une semaine");
  await p.fill("#nom", "Test Recette");
  await p.fill("#telephone", "0612345678");
  await p.check('input[name="consentement"]');

  const envoiAPI = p.waitForResponse((r) => r.url().includes("/api/demande"), { timeout: 15000 });
  await p.locator('button[type="submit"]').click();
  const réponse = await envoiAPI.catch(() => null);

  réponse ? ok(`Le formulaire appelle bien /api/demande (${réponse.status()})`)
          : fail("Le formulaire n'a envoyé aucune requête");

  await p.waitForTimeout(700);
  const succès = await p.locator("text=Demande envoyée").isVisible().catch(() => false);
  // Next.js pose son propre role="alert" (annonceur de route) : on cible le nôtre.
  const alerte = await p.locator('[data-erreur="globale"]').isVisible().catch(() => false);

  // Sans clé d'API, l'envoi doit échouer PROPREMENT : jamais de silence.
  if (succès) {
    ok("Envoi accepté : écran de confirmation affiché");
  } else if (alerte) {
    const texte = await p.locator('[data-erreur="globale"]').innerText();
    /appelez|indisponible|échou/i.test(texte)
      ? ok("Envoi indisponible : message clair, avec repli sur le téléphone")
      : fail(`Message d'erreur peu utile : « ${texte} »`);
  } else {
    fail("Ni confirmation ni message d'erreur — l'utilisateur reste sans réponse");
  }

  const bouton = await p.locator('button[type="submit"]').isEnabled();
  bouton ? ok("Le bouton redevient actif après un échec") : fail("Le bouton reste bloqué après un échec");
  await ctx.close();
}

// ---------- 4 bis. La route serveur, directement ----------
{
  const base = new URL(BASE).origin;

  const vide = await fetch(`${base}/api/demande`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  const corpsVide = await vide.json().catch(() => ({}));
  vide.status === 400 && corpsVide.champs
    ? ok("Requête incomplète : 400 avec le détail des champs fautifs")
    : fail(`Requête incomplète : ${vide.status} au lieu de 400`);

  const malFormée = await fetch(`${base}/api/demande`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "ceci n'est pas du json",
  });
  malFormée.status === 400
    ? ok("Corps illisible : 400, sans plantage du serveur")
    : fail(`Corps illisible : ${malFormée.status} au lieu de 400`);

  const valide = {
    mode: "devis", vehicule: "Scooter", marque: "Yamaha", modele: "XMAX 125",
    prestation: "freinage", message: "Bruit au freinage à froid",
    nom: "Test Recette", telephone: "0612345678", consentement: true,
  };

  const sansConsentement = await fetch(`${base}/api/demande`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...valide, consentement: false }),
  });
  sansConsentement.status === 400
    ? ok("Consentement refusé : la demande est rejetée")
    : fail(`Consentement non vérifié : ${sansConsentement.status}`);

  const robot = await fetch(`${base}/api/demande`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...valide, societe: "SpamCorp" }),
  });
  robot.status === 200
    ? ok("Robot piégé : réponse 200 sans qu'aucun e-mail ne parte")
    : fail(`Piège à robots : ${robot.status} au lieu de 200`);

  const complète = await fetch(`${base}/api/demande`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(valide),
  });
  const corps = await complète.json().catch(() => ({}));
  if (complète.status === 200) {
    ok("Demande valide acceptée et transmise");
  } else if (complète.status === 503 && /appelez/i.test(corps.erreur ?? "")) {
    ok("Sans clé d'API : 503 et message de repli vers le téléphone");
  } else {
    fail(`Demande valide : ${complète.status} — ${corps.erreur ?? "sans message"}`);
  }
}

// ---------- 5. Ancres de navigation ----------
{
  const ctx = await browser.newContext({ ...L, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "networkidle" });
  const broken = await p.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')]
      .map((a) => a.getAttribute("href"))
      .filter((h) => h !== "#" && !document.querySelector(h))
  );
  broken.length ? fail(`Ancres cassées : ${[...new Set(broken)].join(", ")}`) : ok("Toutes les ancres pointent vers une section existante");

  const tel = await p.evaluate(() => [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute("href")));
  tel.every((t) => t === "tel:+33186046505") && tel.length > 0
    ? ok(`${tel.length} liens d'appel, tous sur le bon numéro`)
    : fail(`Liens tel incohérents : ${[...new Set(tel)].join(", ")}`);
  await ctx.close();
}

// ---------- 6. Accessibilité de base ----------
{
  const ctx = await browser.newContext({ ...L, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "networkidle" });
  const a11y = await p.evaluate(() => {
    const r = {};
    r.h1 = document.querySelectorAll("h1").length;
    r.imgNoAlt = [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length;
    r.inputsNoLabel = [...document.querySelectorAll("input:not([type=hidden]):not([type=radio]):not([type=checkbox]), select, textarea")]
      .filter((el) => !el.id || !document.querySelector(`label[for="${el.id}"]`)).length;
    r.btnNoName = [...document.querySelectorAll("button")]
      .filter((b) => !b.textContent.trim() && !b.getAttribute("aria-label")).length;
    r.lang = document.documentElement.lang;
    return r;
  });
  a11y.h1 === 1 ? ok("Un seul h1") : fail(`${a11y.h1} balises h1`);
  a11y.imgNoAlt === 0 ? ok("Toutes les images ont un alt") : fail(`${a11y.imgNoAlt} images sans alt`);
  a11y.inputsNoLabel === 0 ? ok("Tous les champs ont un label associé") : fail(`${a11y.inputsNoLabel} champs sans label`);
  a11y.btnNoName === 0 ? ok("Tous les boutons ont un nom accessible") : fail(`${a11y.btnNoName} boutons sans nom`);
  a11y.lang === "fr" ? ok('lang="fr" présent') : fail(`lang = "${a11y.lang}"`);

  const focus = await p.evaluate(() => {
    const el = document.querySelector('a[href="/#devis"], a[href="#devis"]');
    if (!el) return false;
    el.focus();
    return document.activeElement === el;
  });
  focus ? ok("Navigation clavier : les liens prennent le focus") : warn("Focus clavier à vérifier manuellement");
  await ctx.close();
}

// ---------- 7. SEO & données structurées ----------
{
  const ctx = await browser.newContext({ ...L, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "networkidle" });
  const seo = await p.evaluate(() => {
    const ld = document.querySelector('script[type="application/ld+json"]');
    let parsed = null;
    try { parsed = JSON.parse(ld.textContent); } catch {}
    return {
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content ?? "",
      robots: document.querySelector('meta[name="robots"]')?.content ?? "",
      ldType: parsed?.["@type"],
      ldPhone: parsed?.telephone,
      ldStreet: parsed?.address?.streetAddress,
      offers: parsed?.makesOffer?.length ?? 0,
    };
  });
  seo.title.length > 20 && seo.title.length <= 65 ? ok(`Title correct (${seo.title.length} car.)`) : warn(`Title de ${seo.title.length} caractères : "${seo.title}"`);
  seo.desc.length >= 120 && seo.desc.length <= 165 ? ok(`Meta description correcte (${seo.desc.length} car.)`) : warn(`Meta description de ${seo.desc.length} caractères (cible 120-165)`);
  seo.robots.includes("noindex") ? ok("noindex actif (maquette)") : fail("La maquette est indexable !");
  seo.ldType === "AutoRepair" ? ok("Données structurées AutoRepair valides") : fail("Schema.org absent ou incorrect");
  seo.ldPhone === "01 86 04 65 05" ? ok("Téléphone correct dans les données structurées") : fail(`Téléphone schema : ${seo.ldPhone}`);
  seo.ldStreet?.includes("Château des Rentiers") ? ok("Adresse correcte dans les données structurées") : fail(`Adresse schema : ${seo.ldStreet}`);
  seo.offers >= 8 ? ok(`${seo.offers} prestations déclarées en schema.org`) : warn(`${seo.offers} prestations en schema`);
  await ctx.close();
}

// ---------- 8. Barre d'appel mobile ----------
{
  const ctx = await browser.newContext({ ...L, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "networkidle" });
  const bar = p.locator('a[data-cta="sticky-call"]');
  (await bar.isVisible()) ? ok("Barre d'appel visible sur mobile") : fail("Barre d'appel absente sur mobile");
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(400);
  (await bar.isVisible()) ? ok("Barre d'appel toujours visible en bas de page") : fail("Barre d'appel perdue au scroll");
  const box = await bar.boundingBox();
  box && box.height >= 44 ? ok(`Cible tactile suffisante (${Math.round(box.height)}px)`) : warn(`Cible tactile de ${box?.height}px (cible ≥ 44px)`);
  await ctx.close();
}

// ---------- 9. Desktop : pas de barre d'appel ----------
{
  const ctx = await browser.newContext({ ...L, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "networkidle" });
  const vis = await p.locator('a[data-cta="sticky-call"]').isVisible().catch(() => false);
  !vis ? ok("Barre d'appel masquée sur ordinateur") : warn("Barre d'appel visible sur ordinateur");
  await ctx.close();
}

// ---------- 10. Parcours de toutes les pages internes ----------
{
  const ctx = await browser.newContext({ ...L, viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(BASE, { waitUntil: "networkidle" });

  const links = await p.evaluate(() =>
    [...new Set(
      [...document.querySelectorAll('a[href^="/"]')]
        .map((a) => a.getAttribute("href"))
        .filter((h) => h && !h.startsWith("//") && !h.includes("#")),
    )],
  );
  links.length >= 10
    ? ok(`${links.length} pages internes liées depuis l'accueil`)
    : warn(`Seulement ${links.length} pages internes liées`);

  for (const href of links) {
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    const res = await p.goto(new URL(href, BASE).toString(), { waitUntil: "networkidle" });
    const status = res?.status() ?? 0;
    if (status !== 200) {
      fail(`${href} répond ${status}`);
      continue;
    }
    const info = await p.evaluate(() => ({
      h1: document.querySelectorAll("h1").length,
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content ?? "",
      dead: [...document.querySelectorAll('a[href^="#"]')]
        .map((a) => a.getAttribute("href"))
        .filter((h) => h !== "#" && !document.querySelector(h)).length,
    }));
    const problems = [];
    if (info.h1 !== 1) problems.push(`${info.h1} h1`);
    if (!info.title || info.title.length > 70) problems.push(`title de ${info.title.length} car.`);
    if (info.desc.length > 165) problems.push(`description de ${info.desc.length} car.`);
    if (info.dead) problems.push(`${info.dead} ancre(s) morte(s)`);
    if (errs.length) problems.push(`erreur JS : ${errs[0]}`);
    problems.length ? fail(`${href} — ${problems.join(", ")}`) : ok(`${href} — page saine`);
  }
  await ctx.close();
}

// ---------- 11. Les e-mails, sur écran étroit ----------
// L'e-mail reçu par l'atelier est un écran consulté plusieurs fois par jour,
// sur un téléphone. Il est donc recetté comme une page.
// Nécessite APERCU_EMAIL=1 côté serveur ; ignoré sinon.
{
  const base = new URL(BASE).origin;
  const sonde = await fetch(`${base}/api/apercu-email`);
  if (sonde.status === 404) {
    warn("Aperçu des e-mails désactivé (APERCU_EMAIL=1 pour l'activer)");
  } else {
    for (const [type, mode] of [["atelier", "devis"], ["atelier", "rdv"], ["client", "devis"]]) {
      const soucis = [];
      for (const largeur of [320, 360, 390, 412]) {
        const ctx = await browser.newContext({ ...L, viewport: { width: largeur, height: 800 }, isMobile: true, hasTouch: true });
        const p = await ctx.newPage();
        await p.goto(`${base}/api/apercu-email?type=${type}&mode=${mode}`, { waitUntil: "networkidle" });
        const m = await p.evaluate(() => ({
          client: document.documentElement.clientWidth,
          scroll: document.documentElement.scrollWidth,
        }));
        // Comparer scrollWidth à clientWidth ne suffit pas : sans balise
        // viewport, les deux valent 980 et le test passe au vert alors que
        // l'utilisateur doit faire défiler. On vérifie donc d'abord que la
        // mise en page adopte bien la largeur de l'appareil.
        if (m.client > largeur + 1) soucis.push(`${largeur}px → mise en page à ${m.client}px (balise viewport absente ou ignorée)`);
        else if (m.scroll > m.client + 1) soucis.push(`${largeur}px → débordement de ${m.scroll - m.client}px`);
        await ctx.close();
      }
      soucis.length
        ? fail(`E-mail ${type}/${mode} : ${soucis[0]}`)
        : ok(`E-mail ${type}/${mode} : à la largeur de l'appareil, de 320 à 412px`);
    }
  }
}

// ---------- 12. Espace d'administration ----------
// Nécessite ADMIN_MOT_DE_PASSE côté serveur et RECETTE_ADMIN_MDP ici.
{
  const mdp = process.env.RECETTE_ADMIN_MDP;
  if (!mdp) {
    warn("Espace d'administration non recetté (RECETTE_ADMIN_MDP absent)");
  } else {
    const base = new URL(BASE).origin;
    const ctx = await browser.newContext({ ...L, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const p = await ctx.newPage();

    await p.goto(`${base}/admin`, { waitUntil: "networkidle" });
    new URL(p.url()).pathname === "/admin/connexion"
      ? ok("Sans session, l'espace redirige vers la connexion")
      : fail(`Sans session, /admin reste accessible (${new URL(p.url()).pathname})`);

    await p.fill("#motdepasse", "mauvais-mot-de-passe");
    await p.click('button[type="submit"]');
    await p.waitForTimeout(1200);
    const refus = await p.locator('[data-erreur="connexion"]').isVisible().catch(() => false);
    const resté = new URL(p.url()).pathname === "/admin/connexion";
    refus && resté
      ? ok("Mauvais mot de passe : refusé, avec un message")
      : fail("Un mauvais mot de passe n'est pas correctement refusé");

    await p.fill("#motdepasse", mdp);
    await p.click('button[type="submit"]');
    await p.waitForURL("**/admin**", { timeout: 15000 }).catch(() => {});
    await p.waitForTimeout(800);
    new URL(p.url()).pathname === "/admin"
      ? ok("Bon mot de passe : session ouverte")
      : fail("La connexion échoue avec le bon mot de passe");

    const cartes = await p.locator('a[href^="/admin/"]').count();
    cartes > 0
      ? ok(`${cartes} demande(s) listée(s) dans l'espace`)
      : warn("Aucune demande à lister — envoyez-en une avant de recetter");

    if (cartes > 0) {
      await p.locator('a[href^="/admin/"]').first().click();
      await p.waitForTimeout(900);
      const titre = await p.locator("h1").count();
      const rappel = await p.locator('a[href^="tel:"]').count();
      titre === 1 && rappel > 0
        ? ok("Fiche détaillée : un titre, un bouton de rappel")
        : fail("La fiche détaillée est incomplète");
    }

    // La déconnexion doit réellement fermer l'accès, pas seulement l'interface.
    await p.goto(`${base}/admin`, { waitUntil: "networkidle" });
    await p.click('button:has-text("Déconnexion")');
    await p.waitForTimeout(1200);
    await p.goto(`${base}/admin`, { waitUntil: "networkidle" });
    new URL(p.url()).pathname === "/admin/connexion"
      ? ok("Après déconnexion, l'espace est de nouveau fermé")
      : fail("La déconnexion ne ferme pas réellement la session");

    await ctx.close();
  }
}

await browser.close();

console.log("\n================ RECETTE ================\n");
console.log(`✅ ${oks.length} contrôles passés`);
oks.forEach((m) => console.log("   ✓ " + m));
if (warns.length) { console.log(`\n⚠️  ${warns.length} points d'attention`); warns.forEach((m) => console.log("   ! " + m)); }
if (fails.length) { console.log(`\n❌ ${fails.length} ANOMALIES`); fails.forEach((m) => console.log("   ✗ " + m)); }
console.log("\n=========================================");
process.exit(fails.length ? 1 : 0);
