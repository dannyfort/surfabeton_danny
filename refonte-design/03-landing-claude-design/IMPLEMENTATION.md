# Landing cinématique — implémentation (depuis Claude Design)

Source : projet Claude Design « Surfabeton landing cinématique »
(`2d0193a9-8101-4e1d-83ab-1a177c766afd`), fichier `Surfabeton Landing v2.dc.html`,
importé via le MCP DesignSync.

## Livrable

**`build/index.html`** — landing autonome (77 KB) + **`build/assets/`**.
Aucune dépendance de build : GSAP + ScrollTrigger + Lenis + Three.js en CDN,
fonts Google (Playfair Display / IBM Plex Mono / Hanken Grotesk). Ouvrable sur
n'importe quel serveur statique.

## Ce qui a été fait

Le `.dc.html` d'origine est un **composant React** (template `<x-dc>` +
`<sc-if>`/`{{ }}` + une classe `Component` de 33 KB) rendu par le runtime de
preview `support.js` (`dc-runtime`, « do not edit », dépend de React/ReactDOM).
Je l'ai **converti en HTML/CSS/JS vanilla standalone** pour ne pas embarquer
React + un runtime de preview en production :

- `<helmet>` → `<head>` (fonts + CDN + CSS de base).
- `<sc-if>` → visibilité gérée par media-queries CSS (`.sb-mobile-only`,
  `.sb-desktop-card`, breakpoint 820 px) + JS (reduced-motion, bottom-sheet).
- `{{ handlers }}` → hooks `data-sb-*` câblés en vanilla (form, CTA, sheet).
- `style-hover` / `style-focus` → classes CSS générées (`:hover` / `:focus`).
- La classe `Component` (toute la choré GSAP/Three/Lenis) est réutilisée telle
  quelle sur un mini-shim `DCLogic` (`setState` → reflète formNote + sheet au DOM).
- Transformeur reproductible : `imported/build.cjs` (relit `imported/template.html`
  + `imported/component-logic.js` → régénère `build/index.html`).

**Fix apporté** : le split lettre-par-lettre du titre détruisait le `<br>` et
cassait les mots en plein milieu (« POLI C / OMME »). Corrigé dans
`component-logic.js` : lettres regroupées en spans-mots `white-space:nowrap`,
`<br>` préservé → « LE BÉTON, POLI / COMME UN MIROIR. ».

## Assets (`build/assets/`)

| Fichier | Source |
|---|---|
| `hero-master.mp4` | master ASTRA 2 ré-encodé **GOP court (`-g 15`)** pour un scrub `currentTime` fluide, 1080p, 6.5 MB, sans audio |
| `poster-start.jpg` / `poster-wide.jpg` | frames extraites (t=0 / t=5.0 s) |
| `exp-cire.jpg` · `exp-sols.jpg` · `exp-dallage.jpg` | pulls du projet Claude Design (get_file base64) |

Markers timeline (dans la classe) : `pourEnd:1.8 · crashStart:3.1 · wideLock:5.0`.

## Lancer / prévisualiser

Servir le dossier `build/` en statique, p.ex. via le serveur Vite déjà présent :
`http://localhost:5173/refonte-design/03-landing-claude-design/build/index.html`

## Vérification (2026-07-11)

Hero validé **visuellement** (vidéo, particules dorées WebGL, nav, titre corrigé,
carte glass « Votre devis en 24h »). Sections suivantes validées **au DOM** (le
capteur de screenshot du pane rend un cadre vide en état scrollé+animé, mais les
diagnostics sont cohérents, zéro erreur console) :
- Plan large : H1 « 25 ans de surfaces parfaites. » + CTA.
- Chiffres clés : count-up **55 000 / 155 / 25**, QUALIBAT 2153, cartes glass.
- Expertises : « Nos expertises » + 3 images (1280×720) chargées.
- Libs OK (GSAP/ScrollTrigger/Lenis/Three), 26 ScrollTriggers, 0 erreur console.

## Promotion en site racine — FAIT (2026-07-11)

La nouvelle landing est désormais le site servi à la racine (`/`) :

- Ancien site sauvegardé intégralement → **`index.legacy.html`** (préloader
  « COFFRAGE », WebGL `#gl`, scroll-vidéo `#scrollvid` + `public/seq/` 121 frames :
  tout est conservé, rien supprimé).
- **`index.html`** (racine) = `build/index.html` + **SEO reporté** de l'ancien
  (title « …Spécialiste du dallage industriel en Normandie », meta description
  riche, bloc `application/ld+json` `LocalBusiness`), via `imported/promote.cjs`
  (extrait les blocs de `index.legacy.html`, pas de recopie manuelle).
- Assets copiés dans **`public/assets/`** → servis par Vite à `/assets/` (chemins
  relatifs `assets/…` dans le HTML, compatibles `base: './'` en dev et en build).
- Vérifié live sur `http://localhost:5173/` : hero OK, `hero-master.mp4` en 206
  Partial Content, **0 erreur console**, titre SEO dans l'onglet.

### Revenir en arrière
```
cd /Users/danielfortunato/Documents/surfabeton-site
cp index.legacy.html index.html        # restaure l'ancien site
# (optionnel) rm -rf public/assets       # retire les assets de la landing
```
Re-promouvoir après un rebuild : `node refonte-design/03-landing-claude-design/imported/promote.cjs`

## Reconstruire

```
node imported/build.cjs   # régénère build/index.html depuis template + logic
```
