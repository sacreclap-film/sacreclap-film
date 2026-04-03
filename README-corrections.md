# ✅ Sacréclap Film — Corrections appliquées

## Ce qui a été corrigé automatiquement

### 🔐 Sécurité
- **Honeypot anti-spam** ajouté sur les deux formulaires (index.html + mariages.html)
- **Rate-limit client** : 1 envoi par minute par formulaire (stocké en localStorage)
- **Validation HTML5 native** : `required`, `type`, `minlength`, `maxlength` sur tous les champs
- **Attributs `autocomplete`** sur tous les inputs (prénom, nom, email)
- **Labels `for`** correctement associés à tous les inputs (accessibilité + remplissage auto)

### 🎨 Performance & Accessibilité
- **Façades YouTube** : les iframes ne chargent plus au démarrage — elles se chargent au clic (LCP ×2 sur mobile)
- **`cursor: none` corrigé** : désactivé sur mobile/touch (`pointer: coarse`), actif uniquement sur desktop (`pointer: fine`)
- **`prefers-reduced-motion`** : toutes les animations sont désactivées si l'utilisateur le demande dans ses préférences OS
- **Filtre "Captation"** ajouté dans la barre de portfolio (était référencé dans les données mais absent de l'UI)

### 🌐 En-têtes HTTP (fichier netlify.toml)
- `X-Frame-Options: SAMEORIGIN` → anti-clickjacking
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security` avec preload
- `Content-Security-Policy` adapté aux ressources du site
- `Permissions-Policy` → désactive caméra/micro/géo

---

## ⚠️ 1 action manuelle restante (5 min)

### Restreindre EmailJS à ton domaine

C'est la correction la plus importante que le code ne peut pas faire à ta place.

1. Connecte-toi sur [dashboard.emailjs.com](https://dashboard.emailjs.com)
2. Va dans **Account → Security**
3. Active **"Limit connections from browser"**
4. Ajoute `https://www.sacreclap-film.fr` dans la liste des origines autorisées
5. Sauvegarde

Sans ça, n'importe qui peut récupérer tes IDs depuis le HTML et envoyer des emails depuis son propre script.

---

## Déploiement

Si tu es sur **Netlify** : place `netlify.toml` à la racine de ton dépôt.  
Si tu es sur **Vercel** : convertis en `vercel.json` (structure fournie dans l'audit).  
Si tu es sur **OVH/Apache** : crée un `.htaccess` à la racine.
