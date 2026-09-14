import { LIBELLES, libelléPrestation, type Demande } from "./demande";
import { site } from "./site";

/**
 * Gabarits des deux e-mails déclenchés par une demande.
 *
 * Volontairement en HTML simple, avec des styles en ligne : les clients de
 * messagerie ignorent les feuilles de style externes et la moitié des
 * sélecteurs CSS modernes.
 */

const ROUGE = "#e11d26";
const ENCRE = "#14161a";

function échapper(valeur: string): string {
  return valeur
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ligne(intitulé: string, valeur?: string | null) {
  if (!valeur) return "";
  // Ni white-space:nowrap ni largeur fixe : sur un écran étroit, ils imposent
  // une largeur plancher au tableau et forcent un défilement horizontal.
  // word-break protège des valeurs longues et insécables, comme une adresse
  // e-mail ou un modèle à rallonge.
  return `<tr>
    <td style="padding:8px 12px;border-bottom:1px solid #eceae6;color:#6b6b6b;font-size:13px;vertical-align:top;width:38%">${intitulé}</td>
    <td style="padding:8px 12px;border-bottom:1px solid #eceae6;color:${ENCRE};font-size:14px;font-weight:600;word-break:break-word">${échapper(valeur)}</td>
  </tr>`;
}

function enveloppe(titre: string, contenu: string): string {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><title>${échapper(titre)}</title></head>
<body style="margin:0;padding:16px;background:#f6f5f2;word-break:break-word;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:560px;margin:0 auto;table-layout:fixed">
    <tr><td style="background:${ENCRE};padding:20px 24px;border-radius:12px 12px 0 0">
      <span style="color:#fff;font-size:17px;font-weight:800;letter-spacing:-0.3px">${site.name}</span>
      <span style="color:rgba(255,255,255,.45);font-size:12px;display:block;margin-top:2px">${site.address.district}</span>
    </td></tr>
    <tr><td style="background:#fff;padding:24px;border-radius:0 0 12px 12px">${contenu}</td></tr>
    <tr><td style="padding:16px 4px;color:#9a9a9a;font-size:11px;line-height:1.6">
      ${site.address.street}, ${site.address.zip} ${site.address.city} · ${site.phone}<br>
      Du mardi au samedi, 10h – 19h
    </td></tr>
  </table>
</body></html>`;
}

/** E-mail reçu par l'atelier. Conçu pour être lisible sur un téléphone. */
export function emailAtelier(d: Demande) {
  const rdv = d.mode === "rdv";
  const objet = rdv
    ? `RDV — ${d.vehicule} ${d.marque} ${d.modele} — ${d.nom}`
    : `Devis — ${d.vehicule} ${d.marque} ${d.modele} — ${d.nom}`;

  const contenu = `
    <p style="margin:0 0 4px;color:${ROUGE};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">
      ${rdv ? "Demande de rendez-vous" : "Demande de devis"}
    </p>
    <h1 style="margin:0 0 20px;font-size:22px;color:${ENCRE};letter-spacing:-0.4px">${échapper(d.nom)}</h1>

    <p style="margin:0 0 20px">
      <a href="tel:${échapper(d.telephone.replace(/\s/g, ""))}"
         style="display:inline-block;background:${ROUGE};color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-size:15px;font-weight:700;white-space:nowrap">
        Rappeler le ${échapper(d.telephone)}
      </a>
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;table-layout:fixed;border:1px solid #eceae6;border-radius:10px;overflow:hidden">
      ${ligne("Véhicule", `${d.vehicule} · ${d.marque} ${d.modele}`)}
      ${ligne("Année", d.annee)}
      ${ligne("Kilométrage", d.km)}
      ${ligne("Immatriculation", d.immatriculation?.toUpperCase())}
      ${ligne("Prestation", libelléPrestation(d.prestation))}
      ${rdv ? ligne("Date souhaitée", d.date) : ""}
      ${rdv && d.creneau ? ligne("Créneau", LIBELLES.creneau[d.creneau]) : ""}
      ${!rdv && d.disponibilite ? ligne("Disponibilité", LIBELLES.disponibilite[d.disponibilite]) : ""}
      ${ligne("Téléphone", d.telephone)}
      ${ligne("E-mail", d.email)}
    </table>

    ${
      d.message
        ? `<p style="margin:20px 0 6px;color:#6b6b6b;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">Ce qu'il décrit</p>
           <p style="margin:0;padding:14px 16px;background:#f6f5f2;border-radius:10px;color:${ENCRE};font-size:14px;line-height:1.6;white-space:pre-wrap">${échapper(d.message)}</p>`
        : ""
    }

    ${
      rdv
        ? `<p style="margin:22px 0 0;padding:12px 16px;background:#fdeced;border-radius:10px;color:${ROUGE};font-size:13px;line-height:1.6">
             Le client attend votre confirmation. Tant que vous ne l'avez pas rappelé, le rendez-vous n'est pas fixé.
           </p>`
        : ""
    }`;

  return { objet, html: enveloppe(objet, contenu) };
}

/** Accusé de réception envoyé au client, s'il a laissé une adresse. */
export function emailClient(d: Demande) {
  const rdv = d.mode === "rdv";
  const objet = rdv
    ? `Votre demande de rendez-vous — ${site.name}`
    : `Votre demande de devis — ${site.name}`;

  const contenu = `
    <h1 style="margin:0 0 16px;font-size:22px;color:${ENCRE};letter-spacing:-0.4px">Bonjour ${échapper(d.nom)},</h1>

    <p style="margin:0 0 16px;color:${ENCRE};font-size:15px;line-height:1.65">
      Nous avons bien reçu votre demande pour votre ${échapper(d.vehicule.toLowerCase())}
      ${échapper(`${d.marque} ${d.modele}`)}.
    </p>

    <p style="margin:0 0 20px;color:${ENCRE};font-size:15px;line-height:1.65">
      ${
        rdv
          ? "Nous vous rappelons sous 24 h ouvrées pour confirmer votre créneau. <strong>Tant que vous n'avez pas reçu cette confirmation, le rendez-vous n'est pas fixé</strong> — nous préférons un rendez-vous tenu à un rendez-vous annulé."
          : "Nous revenons vers vous sous 24 h ouvrées avec une estimation."
      }
    </p>

    <p style="margin:0 0 22px;padding:14px 16px;background:#f6f5f2;border-radius:10px;color:#6b6b6b;font-size:14px;line-height:1.6">
      <strong style="color:${ENCRE}">C'est urgent ?</strong> Appelez-nous directement au
      <a href="tel:${site.phoneHref.replace("tel:", "")}" style="color:${ROUGE};font-weight:700;text-decoration:none">${site.phone}</a>.
    </p>

    <p style="margin:0;color:#6b6b6b;font-size:14px;line-height:1.65">
      À bientôt,<br>
      <strong style="color:${ENCRE}">L'équipe de ${site.name}</strong>
    </p>`;

  return { objet, html: enveloppe(objet, contenu) };
}
