// ─── Google Fonts — chargement non-bloquant (LCP fix) ──────────────────────
// Chargé avec defer : le rendu initial n'est pas bloqué.
// font-display: swap (paramètre API) assure la lisibilité avant le swap.
(function() {
  var l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600&family=Playfair+Display:ital@1&display=swap';
  document.head.appendChild(l);
}());
