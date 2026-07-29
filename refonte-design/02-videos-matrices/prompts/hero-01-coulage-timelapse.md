# HERO 01 — « Le Coulage » (vidéo matrice du site) — SEEDANCE 2.0

Vidéo signature de la refonte : **un seul plan continu, SANS coupe**.
Gros plan verrouillé sur le béton → couli → timelapse ciré → **punch dolly-in FPV
agressif puis crash pull-back FPV en motion blur extrême** → precision reframing
sur le plan large, **puis caméra fixe 3 s** pendant que le pro lisse lentement le
béton. La dernière image est verrouillée sur `@Image3` (la DA finale exacte).

---

## Réglages Seedance 2.0 (Jimeng)

| Paramètre | Valeur |
|---|---|
| Durée | **15 s** (prompt découpé sur 15 s — ne pas réduire) |
| Résolution | 720p, ratio **16:9** (hero web plein écran) |

### Références — ordonnées par timeline (upload dans cet ordre)

| Tag | Image | Rôle | Moment |
|---|---|---|---|
| `@Image1` | béton brut fissuré, poussiéreux | **FIRST FRAME exacte** | t = 0 s |
| `@Image2` | gros plan béton ciré, reflets dorés des fenêtres | cible du timelapse (état ciré) | milieu |
| `@Image3` | **plan large hangar + pro sur truelle mécanique** (l'image fournie) | **LAST FRAME exacte** | t = 15 s |

> Changement clé vs version précédente : le plan large devient `@Image3` et sert de
> **dernière frame verrouillée**. On ancre **première ET dernière frame** — le levier
> Seedance le plus fiable pour finir précisément sur une image donnée.
> ⚠️ Pas de visage réaliste dans les uploads : le pro de `@Image3` est de dos → OK.

---

## PROMPT MASTER (à coller tel quel)

```
@Image1 as the exact first frame. @Image3 as the exact last frame.
Photorealistic cinematic film, 15 seconds, 16:9. ONE continuous crane-mounted
take — absolutely NO cuts, no edits, a single unbroken shot from first to last
frame.

0–2s: The crane holds a locked macro framing on the raw cracked concrete floor of
@Image1, warm late-afternoon window light raking across the dusty surface, fine
dust drifting in the light beams. The crane stays perfectly still, no drift.

2–7s: The camera keeps the macro locked and static. From the left edge of frame, a
thick flow of wet liquid concrete pours in and self-levels across the floor, its
glossy wet surface catching the golden window light. Hyper-fast professional
construction timelapse: the fresh concrete front advances over the humid surface,
air bubbles rise and vanish, accelerated trowel passes sweep through, and the
surface smooths, cures and hardens within seconds into a flawless mirror-polished
concrete floor — sheen, texture and warm window-light reflections exactly matching
@Image2.

7–8s: A single beat on the mirror finish, then an aggressive fast dolly-in punches
toward the glowing liquid-gold reflection — a snap push with FPV energy and heavy
motion blur.

8–12s: Without any cut, the camera whips straight out of that punch-in into a
violent FPV pull-back — drone-velocity rocketing backward and upward, extreme
motion blur, the whole hall smearing past in streaks of light. Aggressive, kinetic,
crash-dezoom energy, one unbroken high-speed move.

12–15s: Precision reframing — the FPV pull-back rapidly decelerates with surgical
control and settles onto the wide establishing shot of @Image3; the camera then
locks off completely fixed and static, no further movement, holding this final
composition for the full last three seconds. Within the locked frame, the
professional in the hi-vis yellow jacket, seen from behind, slowly rides the
ride-on power trowel forward across the gleaming concrete, its rotating blades
smoothing and polishing the surface to an even sheen as he navigates the floor,
long light reflections stretching toward the camera. The final frame must match
@Image3 exactly in composition, framing and lighting.

Camera: one continuous crane/FPV-mounted shot, NO CUT — locked and static on the
macro for the first 7 seconds, then a very fast aggressive dolly-in punch, whipping
straight into an FPV pull-back with extreme motion blur, and finally settling into a
completely fixed, locked-off wide shot that holds static on @Image3 for the last
three seconds while the machine moves slowly. Fast aggressive moves in the middle,
a calm static hold at the end — but a single unbroken take.

Sound design: quiet room tone with soft dust ambience; then the wet rumble and
slap of flowing concrete; accelerated time-lapse whooshes as the surface cures;
a sharp snap-whoosh on the aggressive dolly-in, then a deep whoosh-impact as the
FPV pull-back rockets out; settling into the steady mechanical hum and the low
grind of the rotating power-trowel blades smoothing the concrete, echoing through
the hall. Minimal elegant ambient score building from near-silence to a warm
cinematic swell.

Style: photorealistic, cinematic pro shot, high dynamic range, warm golden
backlight, subtle film grain, shallow focus opening into deep focus on the wide
last frame — documentary-luxury aesthetic of professional concrete craftsmanship.
```

---

## Pourquoi ces choix (itération)

- **`@Image1 as the exact first frame` + `@Image3 as the exact last frame`** :
  double ancrage début/fin. C'est ce qui garantit que la vidéo *finit* exactement
  sur ta DA (le plan large). Sans ancrage de dernière frame, Seedance improvise la
  fin.
- **« ONE continuous crane-mounted take — absolutely NO cuts »** répété (intro +
  bloc Camera) : verrouille le plan-séquence. Seedance a tendance à insérer une
  coupe sur un gros changement d'échelle — la double mention l'empêche.
- **Le couli reste sur macro verrouillé** (la caméra *tient* la position, pas de
  drift) : on garde l'idée fondatrice « caméra lock pendant que le couli arrive ».
  Toute l'énergie cinétique est concentrée sur les 7–15 s.
- **Enchaînement cinétique 7–15 s** — le cœur de cette itération :
  *aggressive dolly-in* (punch FPV sur le reflet ciré) → *FPV pull-back* whip en
  motion blur extrême → *precision reframing* qui verrouille pile sur `@Image3`. Le
  punch-in bref **avant** le pull-back crée le « changement très rapide de caméra »
  (in → out) tout en restant un plan unique sans coupe.
- **Motion blur + vélocité FPV explicites** : ce vocabulaire pousse Seedance à
  rendre un vrai flou de mouvement rapide et une trajectoire agressive, pas un
  travelling mou. Le beat d'1 s (7–8 s) évite que punch-in et pull-back fusionnent.
- **Fin en caméra fixe, 12–15 s (3 s)** : après le crash FPV, la caméra se
  **verrouille complètement** sur `@Image3` et tient 3 s sans bouger, pendant que le
  pro fait avancer lentement sa truelle mécanique en lissant le béton (lames qui
  polissent la surface). Le contraste move violent → hold statique donne la
  respiration finale et met en valeur le geste métier. Bien préciser
  « camera locked/fixed, no further movement » sinon Seedance garde une dérive
  résiduelle après le pull-back.

### Vocabulaire caméra — curseurs d'intensité (à doser)

Termes injectés dans le prompt, du plus doux au plus violent — remplace/renforce
selon le rendu voulu :

- **Punch avant** : `fast dolly-in` → `aggressive dolly-in punch` → `whip-in snap`
- **Recul** : `crane pull-back` → `FPV pull-back` → `drone-velocity crash pull-back`
- **Flou** : `motion blur` → `heavy motion blur` → `extreme motion blur streaks`
- **Atterrissage** : `settle on` → `precision reframing` → `surgical lock onto @Image3`

⚠️ Garder **un seul** gros mouvement + le punch : empiler trop d'accents rapides
sur 15 s casse la lisibilité et risque de provoquer une coupe parasite.
- **`@Image2` comme cible du timelapse** (et non plus comme frame finale) : l'état
  ciré sert de référence de rendu au milieu du plan, la fin est réservée à `@Image3`.

---

## Run 2026-07-26 — Seedance 2.0 Mini (Higgsfield, nouveau compte)

Régénération avec les refs **DEF** (`Desktop/PROJETS/WEBSITE DESIGN /surfabeton /DEF/`) :
`dmaged def.png` (first frame) → `magnific_base-image-img1-.png` (cible timelapse) →
`def windows.png` (last frame, nouveau hangar : ponts roulants jaunes, racks orange).
Modèle `seedance_2_0_mini`, 15 s, 720p, 16:9, audio natif, 37.5 crédits/vidéo.
Prompt = PROMPT MASTER ci-dessus, description du plan large adaptée au nouveau hangar.

- Take 1 : job `4809da25-9e1d-4cb8-b8ab-79b58e89f00d` → `outputs/hero-01-coulage-v2-take1.mp4`
- Take 2 : job `3ccb7a46-101f-48f6-a393-3c81b0763286` → `outputs/hero-01-coulage-v2-take2.mp4`

QA frames : first/last frames fidèles aux refs sur les deux takes ; take 1 pull-back
plus haut/plus large à 10 s, take 2 reste plus près du sol.

### v3 — format court 8 s + construction CGI (validé coût : 20 crédits)

Itération demandée : 8 s max (15 s trop cher), et pendant le pull-back le hangar
**se construit en fast-forward CGI** (colonnes, parpaings rangée par rangée, fermes
de toit, ponts roulants, racks) pour finir verrouillé sur le plan large
`def windows.png`. Timeline : macro fissuré 0–1 s → couli + cure 1–3 s →
pull-back FPV + auto-construction 3–7 s → lock final 7–8 s.

- Job `8a8c7855-17d2-4407-a0e9-83696a5e778d` → `outputs/hero-01-coulage-v3-8s.mp4`
- Re-roll (même prompt) : job `dbeb8072-b6a1-4f71-9556-0fe7309272b6` →
  `outputs/hero-01-coulage-v3-8s-take2.mp4` — coulée visible en jet avec ondulations
  concentriques à 2,5 s (plus littérale), construction du hangar plus progressive
  (structure nue à 5 s, ponts/racks arrivent en fin de pull-back).

### ✅ Master EN LIGNE (2026-07-27) — `hf_20260727_180836_e3ad068c….mp4`

Take v4 final validé par Daniel (généré côté UI Higgsfield, 8.04 s / 24 fps / 1280×720,
sans piste audio) → installé tel quel (remux `-c copy +faststart`) dans
`public/assets/hero-master.mp4` + posters régénérés (`poster-start.jpg` = frame 0,
`poster-wide.jpg` = frame 7.5 s).

Beats mesurés sur la matrice (grille de frames) et reportés dans `index.html` :

| Marqueur | Ancienne master (7.67 s) | Nouvelle (8.04 s) | Rôle dans le site |
|---|---|---|---|
| `pourEnd` | 1.8 | **2.2** | fin de la coulée : les particules se calment, le zoom d'ouverture est fini |
| `holdEnd` | — | **3.72** | fin d'intro auto-jouée ; 1re image où la caméra bouge vraiment |
| `crashStart` | 3.1 | **4.05** | le pull-back devient violent → crash UI, seuil déclencheur du travelling |
| `wideLock` | 5.0 | **6.9** | lock plan large ; boucle ping-pong 6.9 → 8.04 (truelle) |

### 2026-07-28 — suppression du temps mort au premier scroll

Mesure image par image (énergie de différence inter-frames) : **entre 2,2 s et 3,7 s la
caméra ne bouge pas du tout** (≈ 0,2, soit le grain seul ; le mouvement démarre à 3,72 s
et explose à 4,05 s). Or le scrub mappait `pourEnd → wideLock` linéairement : **les 32
premiers % de la course hero (≈ 380 px) tombaient donc dans ce plan figé**, pendant que
les particules Three.js, elles, reculaient dès le premier pixel. D'où la sensation de
latence signalée par Daniel.

Correctifs dans `index.html` :

- `holdEnd = 3.72` : l'intro auto-jouée absorbe le segment figé et repose la vidéo pile
  sur la première image du recul. Le scroll ne part plus jamais dans le vide.
- `HERO_AMORCE = 0.16` : les 16 premiers % de la course (≈ 190 px) sont en **seek
  direct**, sans lissage — la vidéo recule en synchro avec le doigt, de `holdEnd` à
  `crashStart`. Au-delà du seuil, tout le travelling arrière part jusqu'à `wideLock`,
  lissé (τ = 0,14 s ≈ l'ancien `scrub: 0.5`).
- Le tween proxy GSAP est remplacé par un suivi maison dans `_tickVideo` : la bascule
  amorce → travelling est continue, sans rattrapage à la couture.
- Le crash UI (`c` de `_initExit`) tombe désormais **pile au seuil**, donc exactement au
  beat `crashStart` de la vidéo.
- Les particules reculent sur le **timecode vidéo** (`_proxy.t`) et non plus sur le
  scroll brut : elles ne peuvent plus repartir en avance sur l'image de fond.
- Le fluidificateur `_tickAssist` ne démarre qu'après le seuil (pendant l'amorce,
  l'image appartient au doigt).

### 2026-07-28 — ⚠️ le master n'avait JAMAIS été réencodé pour le scrub

Audit de la latence signalée sur le dézoom. Cause dominante trouvée : le master avait été
installé en **`-c copy` (remux seul)**, donc avec le GOP de Higgsfield —
**2 keyframes en tout** (0 s et 4,25 s), soit un GOP de ~102 images. Chaque seek forçait
le décodeur à repartir d'une keyframe et à décoder jusqu'à 100 images. Mesure : **~0,05 s
de décodage par seek contre ~0,01 s sur `normandy-scrub.mp4`**, qui, lui, avait bien reçu
la recette de scrub (GOP 6, documentée dans `04-normandy-3d/prompts/`).

Réencodage appliqué — **même recette que Normandy** :

```
ffmpeg -i src.mp4 -an -c:v libx264 -profile:v high -preset slow -crf 19 \
       -g 6 -keyint_min 6 -sc_threshold 0 -pix_fmt yuv420p -movflags +faststart out.mp4
```

Résultat : **33 keyframes** (une toutes les 0,25 s), 4,77 → 5,70 Mo (+20 %), PSNR 45,5 dB
(transparent), **193 images / 8,0417 s inchangés → tous les marqueurs restent valides**.
Source d'origine archivée : `outputs/hero-01-coulage-v4-8s.mp4`.

> **Règle à retenir pour toute vidéo scrubbée au scroll** : un fichier destiné au seek se
> réencode toujours en GOP court (6 images). Le remux `-c copy` suffit pour une vidéo
> jouée linéairement, jamais pour une vidéo scrubbée. À vérifier systématiquement avec :
> `ffprobe -select_streams v:0 -skip_frame nokey -show_entries frame=pts_time -of csv=p=0 fichier.mp4`

Effet de bord corrigé au passage : la boucle ping-pong de fin (`_pp.dir === -1`) fait des
**seeks arrière image par image** ; un seek arrière redécode toujours depuis la keyframe,
donc il coûtait ~64 images par frame de rAF. Avec GOP 6 il en coûte ≤ 6.

Pistes secondaires identifiées, NON appliquées (choix chorégraphiques à trancher) :
`_tickAssist` qui scrolle la page tout seul à 500 px/s dès que la vélocité tombe sous 40 ;
`lenis.stop()` de 900 ms en sortie de hero ; les deux vidéos en `preload="auto"` (12 Mo
concurrents au premier chargement).

---

## Déclinaisons à générer ensuite (même matrice)

1. **Loop hero courte (4–5 s)** : segment couli → ciré seul, sans crash-grue
   (boucle de fond pour le header), toujours `@Image1` first / `@Image2` last.
2. **Version verticale 9:16** : mobile / réseaux, même double ancrage.
3. **Plan « craft »** : macro orbitale lente sur la truelle mécanique en action.
