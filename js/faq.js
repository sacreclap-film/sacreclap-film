// ─── FAQ Accordéon — mariages.html ───────────────────────────────────────
(function initFaq() {
  document.querySelectorAll('.faq-trigger').forEach(function(trigger) {
    trigger.addEventListener('click', function() {
      var item = trigger.closest('.faq-item');
      var isActive = item.classList.contains('active');
      // Fermer tous les items ouverts
      document.querySelectorAll('.faq-item.active').forEach(function(open) {
        open.classList.remove('active');
      });
      // Ouvrir le cliqué si ce n'était pas déjà ouvert
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}());
