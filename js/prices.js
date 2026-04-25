/**
 * prices.js — Source unique de vérité pour les tarifs Sacréclap Film
 * Modifier ici → mis à jour automatiquement sur index.html et mariages.html
 */
const SACRECLAP_PRICES = {
  mariages: {
    essentielle: {
      label: "L'Essentielle",
      prix: 1890,
      valeur: 2100,
      heures: 10,
    },
    cinema: {
      label: "Le Cinéma",
      prix: 2390,
      valeur: 2650,
      heures: 14,
    },
    lancement: {
      texte: "à partir de",
      prix: 1890, // ← changer ce chiffre suffit
      note: "Offre valable pour les 5 premiers mariages",
    }
  }
};

// Injection automatique au chargement
document.addEventListener('DOMContentLoaded', () => {
  const p = SACRECLAP_PRICES.mariages;

  // Encart mariage index.html
  const bandSub = document.getElementById('mariage-band-prix');
  if (bandSub) {
    bandSub.textContent = `${p.lancement.texte} ${p.lancement.prix.toLocaleString('fr-FR')} €`;
  }

  // Option formulaire mariages.html
  const optEss = document.getElementById('formule-essentielle-option');
  if (optEss) {
    optEss.textContent = `${p.essentielle.label} — ${p.essentielle.prix.toLocaleString('fr-FR')} €`;
  }
  const optCin = document.getElementById('formule-cinema-option');
  if (optCin) {
    optCin.textContent = `${p.cinema.label} — ${p.cinema.prix.toLocaleString('fr-FR')} €`;
  }
});
