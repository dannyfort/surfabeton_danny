# HERO 01 — « Le Coulage » — version KLING 3.0 OMNI

Même vidéo matrice, adaptée à **Kling 3.0 Omni** avec références `@img`.

## Pourquoi Omni et pas Standard (audit)

Ce besoin est **reference-guided + multi-shot + audio natif** → terrain d'Omni.
Le Kling 3.0 Standard n'excelle que sur du text-to-video générique sans références
critiques. Dès qu'on introduit tes vraies images avant/après, la cohérence de
scène et la logique multi-plan, Omni prend l'avantage. La syntaxe `@tag` elle-même
est propre à Omni (via les « elements ») — le Standard ne l'a pas.

## La syntaxe `@img` dans Omni : ce sont des « elements »

`@img1` n'est pas un upload direct : c'est un **element** créé au préalable.
Étape obligatoire avant de coller le prompt :

1. Ouvrir le panneau **Elements**.
2. Créer 3 elements, chacun depuis l'image correspondante (1 à 4 images
   multi-angles acceptées par element ; 1 suffit ici) + une courte description,
   puis les **nommer** `img1`, `img2`, `img3` :

| Tag | Image source | Description à saisir |
|---|---|---|
| `@img1` | Image 1 — béton brut fissuré, poussiéreux | « raw cracked dusty concrete floor, warm window light » |
| `@img2` | Image 2 — plan large hangar + pro sur truelle | « vast industrial hall, steel trusses, hi-vis worker on ride-on power trowel, seen from behind » |
| `@img3` | Image 3 — béton ciré, reflets dorés | « flawless mirror-polished concrete, warm liquid-gold window reflections » |

> Plafond Omni : jusqu'à **7** images/elements sans vidéo (max 4 si une vidéo de
> référence est fournie). On en utilise 3 → large marge.
> Astuce : tu peux nommer les elements `@RawFloor` / `@Hall` / `@Polished` si tu
> préfères des tags parlants — ici on garde `@img1/2/3` comme demandé.

---

## Réglages Kling 3.0 Omni

| Paramètre | Valeur |
|---|---|
| Modèle | **Kling 3.0 Omni** |
| Mode | Plan continu (prompt simple) — voir variante multi-shot |
| Durée | **15 s**, ratio **16:9** |
| Elements | `@img1`, `@img2`, `@img3` (voir tableau ci-dessus) |
| Audio | natif (généré avec la vidéo) |

---

## PROMPT MASTER — plan continu sans coupe (à coller)

```
Single continuous cinematic take, 15 seconds, 16:9, no cuts.

Open locked and static in extreme macro on the raw cracked concrete surface of
@img1, warm late-afternoon window light raking across the dust, fine particles
drifting in the light beams. The camera holds perfectly still.

From the left edge of frame, a thick flow of wet liquid concrete pours in and
self-levels across the floor, its glossy wet surface catching the golden window
light. A hyper-fast professional construction timelapse takes over: the fresh
concrete front advances over the humid surface, accelerated power-trowel passes
sweep through, and the surface smooths, cures and hardens within seconds into the
flawless mirror-polished floor of @img3, warm liquid-gold window-grid reflections
glowing on the finish. The camera stays perfectly locked and static through this
entire phase.

After a short beat on the mirror surface, one violent motorized crane pull-back
rockets the camera backward and upward in a single motion-blur crash-dezoom, no
cut, settling into the wide establishing shot of @img2: the vast industrial hall
with steel roof trusses and skylight sunbeams, the hi-vis worker of @img2 seen
from behind, riding the ride-on power trowel across the gleaming polished concrete,
long light reflections stretching toward the camera.

Camera: one continuous take, no cuts — locked static tripod for the first two
thirds, then one ultra-fast mechanical crane pull-back with heavy motion blur into
the wide reveal.

Audio: quiet dusty room tone, then the wet rumble and slap of flowing concrete,
accelerated time-lapse whooshes as the surface cures, one sharp cinematic
whoosh-impact on the crane pull-back, ending on the steady mechanical hum of the
ride-on power trowel echoing through the hall; a minimal ambient score swelling
from near-silence to a warm cinematic resolution.

Style: photorealistic cinematic pro shot, shot on 35mm, warm golden backlight,
high dynamic range, subtle film grain, shallow focus opening into deep focus on
the wide reveal — documentary-luxury aesthetic of professional concrete craft.
```

### Negative prompt (champ dédié)

```
camera drift during the locked phase, handheld shake, cuts, jump cuts, morphing,
warping floor, cartoonish, oversaturated, low resolution, blurry logo, text
artifacts, extra limbs, distorted machine, people facing camera, stock photo look
```

---

## Variante — Multi-shot natif Omni (2 plans, contrôle max)

Si le crash-dézoom continu part en vrille, on scinde en 2 plans avec la syntaxe
Omni `Shot N (durée): Cadrage. @tags action. Caméra.`

```
Shot 1 (9s): Locked-off static macro on the raw cracked concrete of @img1 in warm
window light. Wet liquid concrete pours in from the left and self-levels; a
hyper-fast timelapse cures and polishes it to the mirror finish of @img3. Camera
never moves.

Shot 2 (6s): Fast motorized crane pull-back with heavy motion blur out of the
polished surface into the wide industrial hall of @img2; the hi-vis worker of
@img2, seen from behind, rides the power trowel across the gleaming floor. Camera
settles into a locked wide shot.

Atmosphere: photorealistic cinematic, warm golden backlight, film grain,
documentary-luxury concrete craft.
Audio: wet concrete flow and time-lapse whooshes on Shot 1; a sharp whoosh-impact
then the steady power-trowel hum on Shot 2.
```

> Optionnel : pour verrouiller encore mieux le pro, créer un element séparé
> `@worker` (depuis un crop du pro sur la truelle) et l'ajouter au Shot 2 :
> « ...the @worker rides the power trowel across @img2's hall... ». Reste sous le
> plafond de 7 elements.

---

## Différences clés vs Seedance

- **`@img` = elements pré-créés** (pas un upload à la volée comme les `@Image` de
  Seedance). Étape Elements obligatoire, mais consistance bien supérieure.
- **Champ negative prompt dédié** pour tenir le plan verrouillé (Seedance exige de
  le répéter dans le corps du prompt).
- **Syntaxe multi-shot `Shot N (durée):`** native, avec réutilisation des mêmes
  `@tags` d'un plan à l'autre → identité stable du sol / hangar / pro.
- **Audio natif multi-couches** décrit segment par segment.
