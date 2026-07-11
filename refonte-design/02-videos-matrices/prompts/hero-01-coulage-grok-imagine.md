# HERO 01 — « Le Coulage » — version GROK IMAGINE 1.5

Même vidéo matrice, adaptée à Grok Imagine 1.5 (moteur Aurora, image-first).

Deux règles Grok qui changent tout par rapport à Seedance :
1. **L'image porte la compo/lumière/style ; le prompt ne décrit QUE ce qui bouge.**
2. **Une seule action par clip.** Un plan multi-beat (coulage → ciré → dézoom →
   révélation) part en glitch si on le tasse en un seul clip. La méthode idiomatique
   Grok est le **chaînage par extension / clips appariés**.

Pas de syntaxe `@Image` : en image-to-video, l'image = la first frame. On enchaîne.
Grok **accepte les vrais visages** (pas la restriction Seedance) — le pro en hi-vis
passe sans souci ; éviter seulement marques/logos réels dans le champ.

---

## Réglages Grok Imagine 1.5

| Paramètre | Valeur |
|---|---|
| Mode | **Image-to-Video** + **Extension** (workflow apparié) |
| Résolution | **720p** |
| Ratio | 16:9 |
| FPS | 24 |
| Durée par clip | 1–15 s ; extension = 2–10 s **nouvelles** (pas le total) |

Sources (mêmes fichiers) :
- **Image 1** = béton brut fissuré → first frame du Clip 1
- **Image 2** = plan large hangar + pro sur truelle → first frame du Clip 2
- **Image 3** = gros plan ciré, reflets dorés → référence de rendu (décrite au prompt)

---

## PIPELINE RECOMMANDÉ — 2 clips appariés (fidélité maximale)

Chaque image sert de first frame de son clip → tes vrais visuels sont respectés.
On raccorde les deux au montage (hard-cut sur le whoosh, ou court crossfade).

### Clip 1 — Coulage → ciré (image-to-video, first frame = Image 1)

> First frame = Image 1 (béton fissuré). 720p, 16:9.

```
From the left edge of frame, a thick flow of wet liquid concrete pours in and
self-levels across the cracked floor, its glossy surface catching the warm window
light. A hyper-fast professional timelapse takes over: the wet front advances,
accelerated trowel passes sweep across, and the surface smooths, cures and
hardens into a flawless mirror-polished floor, warm window-grid reflections
glowing like liquid gold on the finish. The camera stays locked and static the
whole time.
Sound: a quiet dusty room tone, then the wet rumble and slap of flowing concrete,
fast time-lapse whooshes as the surface cures and tightens, settling into a soft
warm ambient swell. 8 seconds, 16:9.
```

### Clip 2 — Crash-dézoom + révélation (image-to-video, first frame = Image 2)

On part de l'image large : Grok fait « rentrer » la caméra en arrière depuis le
flou, puis stabilise sur le pro. Le raccord donne l'illusion du recul continu.

> First frame = Image 2 (plan large hangar + pro). 720p, 16:9.

```
The camera rockets backward and upward out of a heavy motion-blur crash-zoom and
settles into a locked wide shot of the vast industrial hall. The professional in
the hi-vis yellow jacket, seen from behind, rides the power trowel forward across
the gleaming polished concrete, long light reflections stretching toward the
camera as sunbeams pour through the skylights.
Sound: one sharp cinematic whoosh-impact as the camera settles, then the steady
mechanical hum and low grind of the ride-on power trowel echoing through the
empty hall, a warm ambient score resolving underneath. 6 seconds, 16:9.
```

> **Alternative au Clip 2 — extension pure** (si tu préfères ne pas raccorder) :
> lancer une **Extension** depuis la dernière frame du Clip 1 (+6 s). Grok
> inventera le hangar (fidélité moindre à ton vrai lieu), mais le mouvement reste
> continu, sans coupe :
> ```
> The camera pulls back fast and upward in one violent motion-blur crash-zoom,
> revealing a vast industrial hall around the polished floor: steel trusses,
> skylight sunbeams, and a hi-vis worker seen from behind riding a power trowel
> across the shining concrete.
> Sound: a sharp whoosh-impact, then the steady hum of the power trowel in the
> echoing hall. Extend forward 6 seconds.
> ```

---

## VARIANTE — Tentative one-shot 15 s (moins fiable)

Si tu veux tout en un seul clip depuis Image 1. Actions **front-loadées** dans
l'ordre du timeline (Aurora rend séquentiellement — l'action de fin doit être
écrite en dernier, jamais enterrée). ⚠️ Grok compresse le multi-beat et
**inventera le hangar** (il n'a que la first frame macro comme référence).

> First frame = Image 1. 720p, 16:9.

```
Wet liquid concrete pours in from the left and self-levels across the cracked
floor in warm window light. A hyper-fast timelapse cures and polishes it into a
mirror-finish floor with liquid-gold reflections, camera locked and static. Then
the camera pulls back fast and upward in one heavy motion-blur crash-zoom,
revealing a vast industrial hall — steel trusses, skylight sunbeams, a hi-vis
worker seen from behind riding a power trowel across the shining concrete.
Sound: quiet dust ambience, the wet slap of flowing concrete, time-lapse whooshes
as it cures, one sharp whoosh-impact on the pull-back, then the steady hum of the
power trowel in the echoing hall. 15 seconds, 16:9.
```

---

## Différences clés vs Seedance / Kling

- **Une action par clip** : le point de rupture Grok. Le pipeline 2 clips n'est pas
  un compromis, c'est la façon correcte d'utiliser le modèle — et ça garde ta vraie
  image de hangar comme first frame (fidélité > au one-shot).
- **Bloc `Sound:` obligatoire** : sans lui, clip muet ou audio aléatoire. Décrit
  matière + espace (« echoing hall », « wet slap »).
- **Front-loading** : ce qui doit apparaître en premier est écrit en premier ;
  jamais l'action clé en dernière phrase.
- **Pas de re-description de la compo** en image-to-video : l'image la porte déjà,
  on ne décrit que le mouvement (contraire de Seedance qui absorbe tout).
- **720p / 15 s max / 24 fps** : plafond Grok (Seedance monte à 1080p).
