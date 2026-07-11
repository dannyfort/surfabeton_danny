# Refonte design Surfabeton — mode designer

Refonte totale du site, approche cinématique centrée sur l'expérience visuelle.
Aucun code du site n'est touché dans ce dossier : uniquement direction
artistique et assets.

## Structure

- `01-direction-artistique/` — moodboard, palette, typographie, principes DA
- `02-videos-matrices/` — vidéos génératives Seedance 2.0 qui pilotent le design
  - `prompts/` — prompts finalisés, un fichier par vidéo
  - `sources/` — images de référence à uploader dans Jimeng (ordre = numéro @Image)
  - `outputs/` — vidéos générées, retenues et rejetées (garder les seeds/notes)
    - `hero-01-coulage-master-1080.mp4` — **master validé** (ASTRA 2 upscalé, 7.67 s, 1080p 30fps, 6.7 MB)
- `03-landing-claude-design/` — landing cinématique
  - `prompt-landing-cinematic.md` — brief/prompt envoyé à Claude Design
  - `build/index.html` (+ `build/assets/`) — **landing implémentée**, standalone
    vanilla (GSAP/ScrollTrigger/Lenis/Three en CDN), convertie depuis le
    `.dc.html` Claude Design
  - `IMPLEMENTATION.md` — détail de la conversion, assets, vérif, mise en prod
  - `imported/` — sources extraites + `build.cjs` (transformeur reproductible)

## Pipeline vidéo matrice

1. Déposer les images de référence dans `sources/`, nommées `image1-…`, `image2-…`
   (l'ordre d'upload dans Jimeng = numéro `@ImageN` du prompt).
2. Copier le prompt master depuis `prompts/`.
3. Générer en 720p — garder chaque essai noté dans `outputs/`.
4. La vidéo validée devient la matrice du hero, puis se décline (loop courte,
   9:16, plans secondaires).

## Vidéos

Même vidéo matrice (coulage → ciré → dézoom grue → révélation du pro),
déclinée sur trois modèles pour comparer les rendus.

| # | Modèle | Fichier | Statut |
|---|---|---|---|
| HERO 01 | Seedance 2.0 (15 s) | `02-videos-matrices/prompts/hero-01-coulage-timelapse.md` | Prompt prêt (ancrage first + last frame) |
| HERO 01 | Seedance 2.0 (10 s) | `02-videos-matrices/prompts/hero-01-coulage-timelapse-10s.md` | Prompt prêt (re-timé serré) |
| HERO 01 | Kling 3.0 Omni | `02-videos-matrices/prompts/hero-01-coulage-kling3.md` | Prompt prêt (`@img` elements) |
| HERO 01 | Grok Imagine 1.5 | `02-videos-matrices/prompts/hero-01-coulage-grok-imagine.md` | Prompt prêt |

Mêmes 3 visuels pour les trois modèles (béton brut fissuré · béton ciré reflets
dorés · plan large hangar + pro sur truelle). ⚠️ La numérotation des tags diffère
d'un fichier à l'autre — chaque fichier donne son mapping. La version Seedance est
ordonnée par timeline : `@Image1` = première frame (béton brut) → `@Image3` = **dernière
frame exacte** (plan large hangar).
