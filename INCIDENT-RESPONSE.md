# Plan de réponse à incident — Sacréclap Film

> Document de référence. À consulter immédiatement en cas de problème.
> Dernière mise à jour : avril 2026

---

## Contacts d'urgence

| Plateforme | Accès | Lien direct |
|---|---|---|
| Netlify | Dashboard site | https://app.netlify.com |
| GitHub | Repo sacreclap-film | https://github.com |
| EmailJS | Dashboard | https://dashboard.emailjs.com |
| CNIL (notification) | Formulaire officiel | https://notifications.cnil.fr |

---

## Scénario 1 — Formulaire de contact spammé

**Signes :** tu reçois des dizaines d'emails en peu de temps, contenu absurde ou publicitaire.

**Actions immédiates (< 15 min) :**
1. Netlify Dashboard → Site → Functions → Désactiver temporairement la function `contact`
2. Vérifier les logs Netlify Functions pour identifier les IPs sources
3. Si besoin : ajouter un bloc IP dans Netlify → Site settings → Access control

**Résolution :**
- Réactiver la Function une fois le pic passé (les bots ne persistent généralement pas)
- Le rate-limiting en mémoire (1 req/min par IP) reprend automatiquement

---

## Scénario 2 — Clé EmailJS compromise / exposée publiquement

**Signes :** emails non sollicités depuis tes templates, quota EmailJS épuisé anormalement.

**Actions immédiates (< 30 min) :**
1. **EmailJS Dashboard** → API Keys → Régénérer la clé publique ET la clé privée
2. **EmailJS Dashboard** → Services → Vérifier et restreindre les domaines autorisés à `sacreclap-film.fr`
3. **Netlify Dashboard** → Site → Environment variables → Mettre à jour :
   - `EMAILJS_PUBLIC_KEY` ← nouvelle valeur
   - `EMAILJS_PRIVATE_KEY` ← nouvelle valeur
4. Redéployer le site (Netlify → Deploys → Trigger deploy)
5. Vérifier que les anciens emails n'ont pas été interceptés

---

## Scénario 3 — Site défiguré ou contenu modifié

**Signes :** contenu altéré sur le site live, pages inconnues apparues.

**Actions immédiates (< 5 min) :**
1. **Netlify Dashboard** → Deploys → Cliquer sur le dernier deploy stable → "Publish deploy"
   → Le site est restauré immédiatement, sans toucher au code.
2. Vérifier les accès GitHub : Settings → Security → Active sessions → Révoquer les sessions suspectes
3. Changer le mot de passe GitHub + activer MFA si pas encore fait

---

## Scénario 4 — Violation de données personnelles (données clients exposées)

**Signes :** emails clients interceptés, fuite de données de formulaire.

**Délai légal : 72 heures pour notifier la CNIL (art. 33 RGPD)**

**Actions immédiates :**
1. Documenter l'incident : date, nature des données, nombre de personnes concernées, cause probable
2. Couper l'accès à la source de la fuite (désactiver Function, changer les clés)
3. **Notifier la CNIL** : https://notifications.cnil.fr/notifications/index
4. Si le risque est élevé pour les personnes : les contacter directement par email
5. Conserver une trace écrite de toutes les actions prises

**Données potentiellement exposées sur ce site :**
- Prénom, nom, email des personnes ayant soumis un formulaire de contact
- Date/lieu de mariage pour le formulaire mariages
- Aucun mot de passe, aucune donnée bancaire, aucun document sensible

---

## Scénario 5 — Compte Netlify ou GitHub piraté

**Actions immédiates :**
1. Réinitialiser le mot de passe depuis un autre appareil
2. Révoquer toutes les sessions actives (GitHub : Settings → Sessions)
3. Régénérer tous les tokens d'accès personnels (GitHub : Settings → Developer settings → Tokens)
4. Netlify : révoquer les deploy keys et les webhooks non reconnus
5. Activer MFA immédiatement si pas encore fait

---

## Checklist post-incident

- [ ] Cause identifiée et corrigée
- [ ] Accès non autorisés révoqués
- [ ] Clés/secrets compromis régénérés
- [ ] Site vérifié et opérationnel
- [ ] CNIL notifiée si données personnelles concernées (délai : 72h)
- [ ] Personnes concernées informées si risque élevé
- [ ] Incident documenté (date, cause, actions, durée)

---

## Variables d'environnement Netlify (liste de référence)

Ces variables doivent être présentes dans Netlify → Site → Environment variables :

```
EMAILJS_PUBLIC_KEY
EMAILJS_PRIVATE_KEY
EMAILJS_SERVICE_ID
EMAILJS_TEMPLATE_ADMIN
EMAILJS_TEMPLATE_CONFIRM
ALLOWED_ORIGIN
```

Valeur de référence pour `ALLOWED_ORIGIN` : `https://www.sacreclap-film.fr`
