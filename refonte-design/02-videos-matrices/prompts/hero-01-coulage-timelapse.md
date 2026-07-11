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

## Déclinaisons à générer ensuite (même matrice)

1. **Loop hero courte (4–5 s)** : segment couli → ciré seul, sans crash-grue
   (boucle de fond pour le header), toujours `@Image1` first / `@Image2` last.
2. **Version verticale 9:16** : mobile / réseaux, même double ancrage.
3. **Plan « craft »** : macro orbitale lente sur la truelle mécanique en action.
