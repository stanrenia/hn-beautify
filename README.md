# HN Beautify

Une relecture moderne et élégante de [Hacker News](https://news.ycombinator.com), sous forme de **Progressive Web App** installable sur le bureau et le mobile. Interface en français, données en direct via l'API publique [HN Search (Algolia)](https://hn.algolia.com/api).

## Fonctionnalités

- **Les six sections de HN** en onglets : À la une, Nouveautés, Meilleurs, Ask HN, Show HN, Emplois
- **Recherche instantanée** dans les titres (avec anti-rebond)
- **Filtre de période** : 24 heures, semaine, mois, toujours
- **Tri** par popularité ou par date
- **Vue commentaires intégrée** : fils imbriqués, repli des branches (`[–]` / `[+n]`), auteur de l'article mis en évidence, HTML assaini, liens partageables (`#item/12345`)
- **Barre de chaleur** sous chaque article, proportionnelle à son score
- **Hors ligne** : l'app et les dernières données consultées restent disponibles sans connexion ; un instantané intégré sert de secours si l'API est inaccessible
- **Installable** : mode standalone (fenêtre dédiée, sans barre d'adresse), icônes adaptatives, thème orange HN
- Responsive, navigation clavier, `prefers-reduced-motion` respecté

## Structure du projet

```
.
├── index.html              # L'application (HTML + CSS + JS, sans dépendance)
├── manifest.webmanifest    # Manifeste PWA (nom, icônes, couleurs, mode standalone)
├── sw.js                   # Service worker (cache app shell + API + polices)
├── icon-192.png            # Icône 192×192
├── icon-512.png            # Icône 512×512
└── icon-maskable-512.png   # Icône maskable (Android)
```

Aucun framework, aucune étape de build : du HTML, du CSS et du JavaScript vanilla.

## Lancer en local

Une PWA exige HTTPS ou `localhost` (le protocole `file://` ne permet ni service worker ni installation) :

```bash
python3 -m http.server 8080
# ou : npx serve
```

Puis ouvrez <http://localhost:8080>.

## Déployer sur GitHub Pages

1. Poussez les fichiers **à la racine** du dépôt (branche `main`).
2. Dans **Settings → Pages**, choisissez *Deploy from a branch*, branche `main`, dossier `/ (root)`.
3. Après une à deux minutes, le site est en ligne sur `https://<pseudo>.github.io/<dépôt>/`.

Tous les chemins sont relatifs (`./`) : l'app fonctionne dans un sous-chemin sans configuration.

## Installer l'application

Ouvrez l'URL dans Chrome ou Edge, puis cliquez sur l'icône d'installation à droite de la barre d'adresse (ou menu ⋮ → *Installer HN Beautify*). Sur mobile : *Ajouter à l'écran d'accueil*.

## Mettre à jour

Remplacez les fichiers modifiés dans le dépôt et **incrémentez la constante `VERSION` dans `sw.js`** (ex. `hn-moderne-v3`) : le service worker purgera alors les anciens caches chez les utilisateurs déjà installés.

## Données et API

| Usage | Point d'accès |
|---|---|
| Listes, recherche, filtres | `https://hn.algolia.com/api/v1/search` et `search_by_date` |
| Discussions (arbre complet) | `https://hn.algolia.com/api/v1/items/{id}` |

L'API HN Search est publique et fournie par Algolia ; les contenus appartiennent à leurs auteurs et à Y Combinator. Ce projet n'est pas affilié à Y Combinator.

## Licence

MIT — faites-en bon usage.
