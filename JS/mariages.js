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

// ─── CTA flottant WhatsApp ────────────────────────────────────────────────────
const cta = document.getElementById('floatingCta');
const contactSection = document.querySelector('.contact-cta');
let contactVisible = false;

if (cta && contactSection) {
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
}

// ─── Formulaire mariage ───────────────────────────────────────────────────────
document.getElementById('formSubmit').addEventListener('click', async function () {
  if (document.getElementById('hpot').value !== '') return;

  const lastSent = localStorage.getItem('sc_last_submit_mariage');
  if (lastSent && Date.now() - Number(lastSent) < 60000) {
    const err = document.getElementById('formError');
    err.style.display = 'block';
    err.textContent = 'Veuillez patienter 1 minute entre deux envois.';
    return;
  }

  const prenom  = document.getElementById('prenom').value.trim();
  const email   = document.getElementById('email').value.trim();

  if (!prenom || !email) {
    const err = document.getElementById('formError');
    err.style.display = 'block';
    err.textContent = 'Merci de renseigner au minimum votre prénom et votre email.';
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
        website:  document.getElementById('hpot').value,
        form_type: 'mariage',
        prenom,
        nom:      document.getElementById('nom').value.trim(),
        prenom2:  document.getElementById('prenom2').value.trim(),
        nom2:     document.getElementById('nom2').value.trim(),
        email,
        date:     document.getElementById('date').value.trim(),
        lieu:     document.getElementById('lieu').value.trim(),
        formule:  document.getElementById('formule').value,
        message:  document.getElementById('message').value.trim(),
      })
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      localStorage.setItem('sc_last_submit_mariage', Date.now());
      document.getElementById('formSuccess').style.display = 'block';
      document.getElementById('formError').style.display = 'none';
      document.querySelector('.contact-form').reset();
      lbl.textContent = 'Demande envoyée'; arr.textContent = '✓';
    } else {
      throw new Error(data.error || 'Erreur inconnue');
    }
  } catch (e) {
    console.error(e);
    const err = document.getElementById('formError');
    err.style.display = 'block';
    err.textContent = e.message || "Une erreur s'est produite. Réessayez ou contactez-moi directement.";
    btn.disabled = false; lbl.textContent = 'Envoyer ma demande'; arr.textContent = '→';
  }
});
