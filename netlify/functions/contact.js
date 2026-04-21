/**
 * Netlify Function — Sacréclap Film
 * Gère les soumissions des deux formulaires (contact + mariage)
 * Utilise l'API Brevo (transactional email)
 *
 * Variables d'environnement requises dans Netlify :
 *   BREVO_API_KEY   → clé API Brevo
 *   CONTACT_EMAIL   → adresse de réception (ex: votre@email.fr)
 */

const ALLOWED_ORIGINS = [
  'https://www.sacreclap-film.fr',
  'https://sacreclap-film.fr',
  'https://sacreclap-film.netlify.app',
];

function getCorsHeaders(requestOrigin) {
  const origin = ALLOWED_ORIGINS.includes(requestOrigin)
    ? requestOrigin
    : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// Rate-limit simple en mémoire (par instance lambda)
const rateLimitMap = new Map();
const RATE_LIMIT_MS = 60_000;

function isRateLimited(ip) {
  const now = Date.now();
  const last = rateLimitMap.get(ip);
  if (last && now - last < RATE_LIMIT_MS) return true;
  rateLimitMap.set(ip, now);
  if (rateLimitMap.size > 500) {
    const oldest = [...rateLimitMap.entries()]
      .sort((a, b) => a[1] - b[1])
      .slice(0, 100)
      .map(([k]) => k);
    oldest.forEach(k => rateLimitMap.delete(k));
  }
  return false;
}

// ─── Encodage HTML (prévient les injections dans les templates email) ────────
function h(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Envoi via Brevo ───────────────────────────────────────────────────────
async function sendViaBrevo({ to, replyTo, subject, htmlContent }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'Sacréclap Film', email: 'contact@sacreclap-film.fr' },
      to: [{ email: to }],
      replyTo: { email: replyTo },
      subject,
      htmlContent,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo error ${res.status}: ${text}`);
  }
  return true;
}

// ─── Templates email ───────────────────────────────────────────────────────
function buildAdminEmail(params, isMarriage) {
  const title = isMarriage ? '💍 Nouvelle demande mariage' : '🎬 Nouveau contact projet';
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#1a1610;">
      <div style="background:#1a1610;padding:24px 32px;">
        <span style="font-size:22px;color:#f5f2ec;letter-spacing:.08em;">
          SACRÉ<span style="color:#e07820;">CLAP</span> FILM
        </span>
      </div>
      <div style="padding:32px;background:#f5f2ec;">
        <h2 style="margin:0 0 24px;font-size:20px;">${title}</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#6a6058;width:140px;">Nom</td><td style="padding:8px 0;font-weight:500;">${h(params.prenom)} ${h(params.nom)}</td></tr>
          <tr><td style="padding:8px 0;color:#6a6058;">Email</td><td style="padding:8px 0;"><a href="mailto:${h(params.email)}" style="color:#e07820;">${h(params.email)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#6a6058;">Projet</td><td style="padding:8px 0;">${h(params.projet) || '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#6a6058;">Date</td><td style="padding:8px 0;">${h(params.date_tournage)}</td></tr>
          ${!isMarriage ? `<tr><td style="padding:8px 0;color:#6a6058;">Budget</td><td style="padding:8px 0;">${h(params.budget)}</td></tr>` : ''}
          <tr><td style="padding:8px 0;color:#6a6058;vertical-align:top;">Message</td><td style="padding:8px 0;white-space:pre-line;">${h(params.message)}</td></tr>
        </table>
        <div style="margin-top:24px;">
          <a href="mailto:${h(params.email)}" style="display:inline-block;background:#e07820;color:#fff;padding:12px 24px;text-decoration:none;font-size:13px;letter-spacing:.1em;text-transform:uppercase;">
            Répondre →
          </a>
        </div>
      </div>
    </div>`;
}

function buildConfirmEmail(params, isMarriage) {
  const intro = isMarriage
    ? `Votre demande de film de mariage a bien été reçue. Je vous réponds sous 24h pour qu'on puisse échanger sur votre projet.`
    : `Votre message a bien été reçu. Je vous réponds sous 24h.`;
  return `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#1a1610;">
      <div style="background:#1a1610;padding:24px 32px;">
        <span style="font-size:22px;color:#f5f2ec;letter-spacing:.08em;">
          SACRÉ<span style="color:#e07820;">CLAP</span> FILM
        </span>
      </div>
      <div style="padding:32px;background:#f5f2ec;">
        <h2 style="margin:0 0 16px;font-size:20px;">Bonjour ${h(params.prenom)},</h2>
        <p style="margin:0 0 24px;line-height:1.7;color:#4a4438;">${intro}</p>
        <p style="margin:0 0 24px;line-height:1.7;color:#4a4438;">En attendant, n'hésitez pas à me contacter directement sur WhatsApp si vous avez des questions urgentes.</p>
        <a href="https://wa.me/33679374391" style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;text-decoration:none;font-size:13px;letter-spacing:.1em;text-transform:uppercase;margin-bottom:32px;">
          WhatsApp →
        </a>
        <hr style="border:none;border-top:1px solid rgba(0,0,0,.1);margin:24px 0;"/>
        <p style="font-size:12px;color:#9a9080;margin:0;">Sacréclap Film · Val d'Oise, Île-de-France<br/>
        <a href="https://www.sacreclap-film.fr" style="color:#e07820;">www.sacreclap-film.fr</a></p>
      </div>
    </div>`;
}

// ─── Handler ───────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const requestOrigin = event.headers['origin'] || '';
  const CORS_HEADERS = getCorsHeaders(requestOrigin);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const isAllowed = ALLOWED_ORIGINS.some(o => requestOrigin.startsWith(o))
    || ['sacreclap-film.fr', 'sacreclap-film.netlify.app'].some(o => requestOrigin.includes(o));
  if (!isAllowed && process.env.NODE_ENV !== 'development') {
    return { statusCode: 403, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Forbidden' }) };
  }

  const ip = event.headers['x-forwarded-for']?.split(',')[0].trim()
    || event.headers['client-ip'] || 'unknown';
  if (isRateLimited(ip)) {
    return { statusCode: 429, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Trop de tentatives. Attendez 1 minute.' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Corps de requête invalide' }) };
  }

  if (body.website) {
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ ok: true }) };
  }

  const { prenom, nom, email, form_type } = body;
  if (!prenom || !email || !email.includes('@')) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Champs obligatoires manquants (prénom, email)' }) };
  }

  const clean = (str = '') => String(str).replace(/<[^>]*>/g, '').trim().slice(0, 500);
  const isMarriage = form_type === 'mariage';

  const params = {
    prenom:        clean(prenom),
    nom:           clean(nom),
    email:         clean(email),
    projet:        clean(body.projet),
    date_tournage: clean(body.date_tournage) || 'Non précisée',
    budget:        clean(body.budget) || 'Non précisé',
    message:       clean(body.message) || 'Aucune description.',
  };

  if (isMarriage && body.lieu) {
    const conjoint = [clean(body.prenom2), clean(body.nom2)].filter(Boolean).join(' ') || 'Non précisé';
    params.message = [
      `Conjoint·e : ${conjoint}`,
      `Lieu : ${clean(body.lieu)}`,
      '',
      clean(body.message) || 'Aucune description.',
    ].join('\n');
    params.projet = `Film de mariage — ${clean(body.formule) || 'Formule non précisée'}`;
    params.date_tournage = clean(body.date) || 'Non précisée';
  }

  const adminEmail     = process.env.CONTACT_EMAIL || 'contact@sacreclap-film.fr';
  const subjectAdmin   = isMarriage
    ? `💍 Demande mariage — ${params.prenom} ${params.nom}`
    : `🎬 Nouveau contact — ${params.prenom} ${params.nom}`;
  const subjectConfirm = isMarriage
    ? 'Votre demande a bien été reçue — Sacréclap Film'
    : 'Votre message a bien été reçu — Sacréclap Film';

  try {
    await sendViaBrevo({
      to: adminEmail,
      replyTo: params.email,
      subject: subjectAdmin,
      htmlContent: buildAdminEmail(params, isMarriage),
    });

    await sendViaBrevo({
      to: params.email,
      replyTo: adminEmail,
      subject: subjectConfirm,
      htmlContent: buildConfirmEmail(params, isMarriage),
    });

    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Brevo error:', err.message);
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Erreur lors de l'envoi. Réessayez ou contactez-moi par WhatsApp." }),
    };
  }
};
