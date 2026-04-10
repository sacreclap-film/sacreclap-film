// ─── Curseur custom (pointer:fine uniquement) ──────────────────────────────────
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let rx = 0, ry = 0, cx = 0, cy = 0;

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cur.style.left = cx + 'px'; cur.style.top = cy + 'px';
  });
  (function loop() {
    rx += (cx - rx) * .12; ry += (cy - ry) * .12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
}

// ─── Reveal au scroll ─────────────────────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      obs.unobserve(e.target);
    }
  });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ─── Menu burger ──────────────────────────────────────────────────────────────
const burger = document.getElementById('burger');
const nav = document.getElementById('navOverlay');

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  nav.classList.toggle('open');
  document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
});
document.querySelectorAll('.nav-overlay-link').forEach(l => {
  l.addEventListener('click', () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ─── Accordion services ───────────────────────────────────────────────────────
document.querySelectorAll('.accordion-trigger').forEach(t => {
  t.addEventListener('click', () => {
    const item = t.closest('.accordion-item');
    const was = item.classList.contains('active');
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
    if (!was) item.classList.add('active');
  });
});

// ─── CTA flottant WhatsApp ────────────────────────────────────────────────────
const cta = document.getElementById('floatingCta');
const contactSection = document.querySelector('.contact');
let contactVisible = false;

const contactObs = new IntersectionObserver(entries => {
  entries.forEach(e => { contactVisible = e.isIntersecting; updateCta(); });
}, { threshold: 0 });
contactObs.observe(contactSection);

function updateCta() {
  if (window.scrollY > 400 && !contactVisible) {
    cta.style.opacity = '1'; cta.style.transform = 'translateY(0)'; cta.style.pointerEvents = 'all';
  } else {
    cta.style.opacity = '0'; cta.style.transform = 'translateY(12px)'; cta.style.pointerEvents = 'none';
  }
}
window.addEventListener('scroll', updateCta);

// ─── Carousel témoignages ─────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "Ponctuel, à l'écoute, sensible et rigoureux. C'est un plaisir de travailler avec lui, car il est passionné !",
    name:  "LOUISE SOULIÉ",
    role:  "Compagnie l'Êttre-Louve · Captation de performance"
  },
  {
    quote: "Merci infiniment pour ton implication, ta rapidité, et toutes tes idées. C'est génial pour moi d'avoir quelqu'un comme toi dans mon entourage pour tous ces projets.",
    name:  "TOM D.",
    role:  "Seven et Tom"
  },
  {
    quote: "J'ai regardé la vidéo, c'est juste incroyable. Vous avez montré avec tellement de finesse tout ce que nous essayons de transmettre par la musique. L'image, le son, les transitions, la qualité... tout est vraiment très professionnel. Merci du fond du cœur, vous êtes formidables !",
    name:  "VITOL LIUBOV",
    role:  "L'Éloge du Silence · Concert franco-ukrainien"
  },
  {
    quote: "Une très bonne communication qui fluidifie les échanges, force de proposition pour les idées et su s'adapter au besoin du film.",
    name:  "MANON DA COSTA MALLET",
    role:  "Réalisatrice · 17H35"
  },
];

const tQuote = document.getElementById('testimonialQuote');
const tName  = document.getElementById('testimonialName');
const tRole  = document.getElementById('testimonialRole');
const tDots  = document.getElementById('testimonialDots');

if (tQuote && tDots) {
  let current = 0;
  let autoTimer;

  // Transition sur les éléments texte
  [tQuote, tName, tRole].forEach(el => { el.style.transition = 'opacity .35s ease'; });

  // Création des dots
  TESTIMONIALS.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Témoignage ' + (i + 1));
    d.addEventListener('click', () => { goTo(i); resetTimer(); });
    tDots.appendChild(d);
  });

  function goTo(index) {
    [tQuote, tName, tRole].forEach(el => { el.style.opacity = '0'; });
    setTimeout(() => {
      current = index;
      const t = TESTIMONIALS[current];
      tQuote.textContent = '\u201c' + t.quote + '\u201d';
      tName.textContent  = t.name;
      tRole.textContent  = t.role;
      [tQuote, tName, tRole].forEach(el => { el.style.opacity = '1'; });
      tDots.querySelectorAll('.testimonial-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }, 350);
  }

  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo((current + 1) % TESTIMONIALS.length), 6000);
  }

  resetTimer();
}

document.getElementById('formSubmit').addEventListener('click', async function () {
  // Honeypot
  if (document.getElementById('hpot').value !== '') return;

  // Rate-limit client : 1 envoi par minute
  const lastSent = localStorage.getItem('sc_last_submit');
  if (lastSent && Date.now() - Number(lastSent) < 60000) {
    const err = document.getElementById('formError');
    err.style.display = 'block';
    err.textContent = 'Veuillez patienter 1 minute entre deux envois.';
    return;
  }

  const prenom = document.getElementById('prenom').value.trim();
  const nom = document.getElementById('nom').value.trim();
  const email = document.getElementById('email').value.trim();
  const projet = document.getElementById('projet').value;
  const date_tournage = document.getElementById('date_tournage').value.trim();
  const budget = document.getElementById('budget').value;
  const message = document.getElementById('message').value.trim();

  if (!prenom || !nom || !email || !projet) {
    const err = document.getElementById('formError');
    err.style.display = 'block';
    err.textContent = 'Merci de remplir les champs obligatoires (prénom, nom, email, type de projet).';
    return;
  }

  const btn = document.getElementById('formSubmit');
  const lbl = document.getElementById('submitLabel');
  const arr = document.getElementById('submitArrow');
  btn.disabled = true; lbl.textContent = 'Envoi en cours...'; arr.textContent = '⟳';

  try {
    const res = await fetch('/.netlify/functions/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        website: document.getElementById('hpot').value,
        form_type: 'contact',
        prenom, nom, email, projet,
        date_tournage: date_tournage || 'Non précisée',
        budget: budget || 'Non précisé',
        message: message || 'Aucune description.'
      })
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      localStorage.setItem('sc_last_submit', Date.now());
      document.getElementById('formSuccess').style.display = 'block';
      document.getElementById('formError').style.display = 'none';
      document.getElementById('contactForm').reset();
      lbl.textContent = 'Message envoyé'; arr.textContent = '✓';
    } else {
      throw new Error(data.error || 'Erreur inconnue');
    }
  } catch (e) {
    console.error(e);
    const err = document.getElementById('formError');
    err.style.display = 'block';
    err.textContent = e.message || "Une erreur s'est produite. Réessayez ou contactez-moi directement.";
    btn.disabled = false; lbl.textContent = 'Envoyer le message'; arr.textContent = '→';
  }
});
