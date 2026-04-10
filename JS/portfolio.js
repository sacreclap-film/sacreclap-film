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
}, { threshold: .08 });
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

// ─── Filtres portfolio ────────────────────────────────────────────────────────
const cards = document.querySelectorAll('.portfolio-card');
const countEl = document.getElementById('visibleCount');

function applyFilter(filter) {
  // Reset featured
  cards.forEach(card => {
    card.classList.remove('featured');
    card.style.gridColumn = '';
    card.style.order = '';
  });

  // Show/hide cards
  let visible = 0;
  cards.forEach(card => {
    const cats = card.dataset.cats || '';
    const show = filter === 'all' || cats.split(' ').includes(filter);
    if (show) { card.classList.remove('hidden'); visible++; }
    else { card.classList.add('hidden'); }
  });
  countEl.textContent = visible;

  // Carte featured : celle qui a data-featured-for correspondant au filtre actif
  let featuredCard = null;
  cards.forEach(card => {
    if (card.classList.contains('hidden')) return;
    const featuredFor = card.dataset.featuredFor || '';
    if (featuredFor.split(' ').includes(filter) && !featuredCard) {
      featuredCard = card;
    }
  });

  // Fallback : première carte visible
  if (!featuredCard) {
    cards.forEach(card => {
      if (!card.classList.contains('hidden') && !featuredCard) featuredCard = card;
    });
  }

  if (featuredCard) {
    featuredCard.classList.add('featured');
    featuredCard.style.gridColumn = '1 / -1';
    featuredCard.style.order = '-1';
  }
}

// Filtre initial
applyFilter('evenement');

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const isActive = btn.classList.contains('active');
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if (isActive) {
      applyFilter('all');
    } else {
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    }
  });
});

// ─── CTA flottant WhatsApp ────────────────────────────────────────────────────
const cta = document.getElementById('floatingCta');
const ctaBand = document.querySelector('.cta-band');
let ctaBandVisible = false;

if (cta && ctaBand) {
  const ctaBandObs = new IntersectionObserver(entries => {
    entries.forEach(e => { ctaBandVisible = e.isIntersecting; updateCta(); });
  }, { threshold: 0 });
  ctaBandObs.observe(ctaBand);

  function updateCta() {
    if (window.scrollY > 400 && !ctaBandVisible) {
      cta.style.opacity = '1'; cta.style.transform = 'translateY(0)'; cta.style.pointerEvents = 'all';
    } else {
      cta.style.opacity = '0'; cta.style.transform = 'translateY(12px)'; cta.style.pointerEvents = 'none';
    }
  }
  window.addEventListener('scroll', updateCta);
}
