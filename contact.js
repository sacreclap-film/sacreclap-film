/**
 * Netlify Function — Sacréclap Film
 * Gère les soumissions des deux formulaires (contact + mariage)
 * Appelle l'API EmailJS côté serveur (credentials dans les env vars Netlify)
 */

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'https://www.sacreclap-film.fr';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Rate-limit simple en mémoire (par instance lambda)
// Pour un site vitrine avec peu de trafic, c'est suffisant
const rateLimitMap = new Map();
const RATE_LIMIT_MS = 60_000; // 1 minute entre deux envois par IP

function isRateLimited(ip) {
  const now = Date.now();
  const last = rateLimitMap.get(ip);
  if (last && now - last < RATE_LIMIT_MS) return true;
  rateLimitMap.set(ip, now);
  // Nettoyage mémoire (garder max 500 entrées)
  if (rateLimitMap.size > 500) {
    const oldest = [...rateLimitMap.entries()]
      .sort((a, b) => a[1] - b[1])
      .slice(0, 100)
      .map(([k]) => k);
    oldest.forEach(k => rateLimitMap.delete(k));
  }
  return false;
}

async function sendEmail(templateId, params) {
  const payload = {
    service_id:  process.env.EMAILJS_SERVICE_ID,
    template_id: templateId,
    user_id:     process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: params,
  };

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`EmailJS error ${res.status}: ${text}`);
  }
  return true;
}

exports.handler = async (event) => {
  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Vérification de l'origine (double protection)
  const origin = event.headers['origin'] || event.headers['referer'] || '';
  if (!origin.includes('sacreclap-film.fr') && process.env.NODE_ENV !== 'development') {
    return {
      statusCode: 403,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Forbidden' }),
    };
  }

  // Rate-limit par IP
  const ip = event.headers['x-forwarded-for']?.split(',')[0].trim()
    || event.headers['client-ip']
    || 'unknown';

  if (isRateLimited(ip)) {
    return {
      statusCode: 429,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Trop de tentatives. Attendez 1 minute.' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Corps de requête invalide' }),
    };
  }

  // Honeypot — si rempli, on fait semblant de réussir (ne pas alerter les bots)
  if (body.website) {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true }),
    };
  }

  // Validation des champs obligatoires
  const { prenom, nom, email, form_type } = body;

  if (!prenom || !email || !email.includes('@')) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Champs obligatoires manquants (prénom, email)' }),
    };
  }

  // Sanitisation basique (supprimer les balises HTML)
  const clean = (str = '') => String(str).replace(/<[^>]*>/g, '').trim().slice(0, 500);

  const params = {
    prenom:        clean(prenom),
    nom:           clean(nom),
    email:         clean(email),
    projet:        clean(body.projet),
    date_tournage: clean(body.date_tournage) || 'Non précisée',
    budget:        clean(body.budget)        || 'Non précisé',
    message:       clean(body.message)       || 'Aucune description.',
  };

  // Pour le formulaire mariage, enrichir le message avec le lieu
  if (form_type === 'mariage' && body.lieu) {
    const conjoint = [clean(body.prenom2), clean(body.nom2)].filter(Boolean).join(' ') || 'Non précisé';
    const supplements = clean(body.supplements) || 'Aucun';
    params.message = [
      `Conjoint·e : ${conjoint}`,
      `Lieu : ${clean(body.lieu)}`,
      `Suppléments souhaités :\n${supplements}`,
      `\n${params.message}`,
    ].join('\n');
    params.projet = `Film de mariage — ${clean(body.formule) || 'Formule non précisée'}`;
    params.date_tournage = clean(body.date) || 'Non précisée';
  }

  try {
    // Notification admin + confirmation utilisateur (deux templates EmailJS)
    await sendEmail(process.env.EMAILJS_TEMPLATE_ADMIN, params);
    await sendEmail(process.env.EMAILJS_TEMPLATE_CONFIRM, params);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error('EmailJS error:', err.message);
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Erreur lors de l\'envoi. Réessayez ou contactez-moi par WhatsApp.' }),
    };
  }
};
