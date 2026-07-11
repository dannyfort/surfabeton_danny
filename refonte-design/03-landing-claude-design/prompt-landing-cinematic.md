# Prompt Claude Design — Landing cinématique SURFABETON

Asset vidéo à joindre : `refonte-design/02-videos-matrices/outputs/hero-01-coulage-master-1080.mp4`
(master ASTRA 2 upscalé · 1080p 30fps · 7.67 s · 6.7 MB — déjà quasi web-ready ;
réencodage GOP court recommandé pour le scrub, voir section 6 du prompt).

---

## PROMPT (à coller tel quel dans Claude Design)

```
Crée la landing page cinématique de SURFABETON — entreprise française de dallage
béton industriel haute planéité (coulage, lissage, béton ciré poli miroir).
Expérience très animée, pilotée par une vidéo hero scrubbing au scroll :
Three.js + GSAP ScrollTrigger + Lenis smooth scroll. Design sobre, luxueux,
documentaire — pas de gadget : chaque animation raconte le geste métier.

════════════════════════════════════════
1. ASSET VIDÉO HERO (fourni)
════════════════════════════════════════
Une seule vidéo maître de 7.67 s, 30 fps, 16:9, 1920×1080 (~6.7 MB, déjà
web-ready ; à réencoder GOP court + servir en H.264/H.265 + WebM VP9, muted,
playsinline, preload="auto", + poster JPEG de la frame 0). Contenu, en un seul
plan continu sans coupe :

- 0.0 → ~2.0s : macro caméra fixe sur béton brut, un couli de béton liquide
  entre par la gauche et nappe le sol en prenant la lumière dorée.
- ~2.0s : LE BÉTON SE STABILISE EN CLOSE-UP, surface cirée miroir. ← marker T1
- ~2.0 → ~4.5s : timelapse de polissage, reflets liquid-gold. ← T2 = début du move
- ~4.5 → ~5.6s : punch dolly-in puis CRASH-DÉZOOM FPV violent avec motion blur,
  la caméra recule à toute vitesse vers le plan large. 
- ~5.6 → 7.67s : caméra posée FIXE sur le plan large final ← marker T3 : hangar
  industriel, charpente métallique, verrières, un professionnel de dos sur sa
  truelle mécanique qui lisse lentement le béton brillant.

⚠️ Les timecodes T1/T2/T3 sont des constantes JS à caler finement à la main
(const MARKERS = { pourEnd: 2.0, crashStart: 4.5, wideLock: 5.6 }).

════════════════════════════════════════
2. CHORÉGRAPHIE DE LA PAGE (le cœur du brief)
════════════════════════════════════════
PHASE A — Ouverture (0 → 2s, automatique, sans scroll)
La vidéo occupe tout le viewport (object-fit: cover) et JOUE automatiquement
jusqu'à T1 (béton stable en close-up), puis PAUSE exacte sur T1.
PENDANT ces 2 secondes de coulage, les éléments UI apparaissent en parallèle :
- Le logo/wordmark SURFABETON se construit en haut à gauche (animation GSAP :
  tracé/masque des lettres, léger grain WebGL, stagger 60ms par lettre).
- Une catchphrase apparaît SUR LE CÔTÉ (droite), légère transparence (opacité
  ~0.92, blur-in subtil) : 
  « Le béton, poli comme un miroir. » 
  sous-ligne : « Dallage industriel haute planéité — coulé, lissé, ciré. »
- Une SEULE fenêtre flottante 3D élégante entre en scène (voir section 3) :
  la carte liquid glass avec le formulaire de devis.
- Nav minimale en haut : SURFABETON — Réalisations · Savoir-faire · Contact.
- Indicateur de scroll discret en bas : « scroll — découvrir le chantier ».

PHASE B — Hold interactif (scroll 0)
Vidéo en pause sur T1. La scène respire : reflets animés, la carte glass
flotte doucement (idle float ±6px, 4s ease sinusoïdal). L'utilisateur peut
remplir le formulaire directement.

PHASE C — Crash-dézoom au scroll
La section hero est PINNED (ScrollTrigger pin). Dès que l'utilisateur scrolle :
- la vidéo est scrubbée de T1 → T3 sur une distance de scroll COURTE
  (~120vh max) : le crash-dézoom doit rester RAPIDE et violent, fidèle au
  motion blur de la vidéo. Easing scrub: 0.5 (léger smoothing, pas de lag).
- pendant le dézoom : la catchphrase et la carte glass s'échappent en parallax
  opposé (la carte part vers le bas-droite avec une inertie de gravité
  réaliste — spring physics, overshoot léger — comme un panneau lâché).
- le logo nav se réduit (scale 0.85) et la nav devient sticky.

PHASE D — Plan large final (T3 → fin)
La vidéo se verrouille sur le plan large fixe (le pro lisse le béton, la machine
avance lentement — laisser la vidéo JOUER en boucle douce T3→7.67s en ping-pong).
Par-dessus, l'UI de la suite apparaît (stagger + fade-up) :
- H1 sur le plan large : « 25 ans de surfaces parfaites. »
- CTA primaire orange : « Demander un devis » (scrolle vers la carte glass,
  qui revient se poser avec le même spring).
Puis on dé-pin et la page continue en sections classiques (section 5).

════════════════════════════════════════
3. LA CARTE LIQUID GLASS (formulaire devis)
════════════════════════════════════════
Une seule fenêtre flottante, élégante, style liquid glass :
- fond rgba(237,232,222,0.10) + backdrop-filter: blur(22px) saturate(1.3),
  bord 1px rgba(255,255,255,0.35), ombre portée chaude très douce,
  highlight spéculaire qui glisse selon l'angle (WebGL ou gradient animé).
- COMPORTEMENT 3D : la carte est un panneau flottant qui SE PENCHE légèrement
  en 3D au scroll et au mousemove (rotateX/rotateY max 7°, perspective 1200px),
  avec inertie de gravité réaliste : GSAP spring/inertia, la carte « pèse »,
  overshoot puis stabilisation, jamais sèche. Idle : flottement lent.
- CONTENU (simple, 5 champs max) :
  titre : « Votre devis en 24h »
  Nom · Société · Email ou téléphone · Surface (m²) · Type de projet
  (select : Dallage industriel / Béton ciré décoratif / Rénovation de surface)
  bouton : « Demander un devis » (orange #D9531E, hover: léger lift 3D)
  micro-mention : « Réponse sous 24h ouvrées — sans engagement. »
- Mobile : la carte devient un bottom-sheet fixe déclenché par un CTA sticky.

════════════════════════════════════════
4. DIRECTION ARTISTIQUE — TOKENS SURFABETON
════════════════════════════════════════
Palette (extraite de la DA existante) :
- --sand-050: #EDE8DE (fond clair, sections hautes)
- --sand-200: #D6CCBC (fond sable texturé béton)
- --ink-900:  #17140F (titres, quasi-noir chaud)
- --ink-600:  #3F3A33 (texte courant)
- --orange-600: #D9531E (accent principal : chiffres, CTA, eyebrows)
- --orange-300: #E8A57C (soulignés, hairlines accent)
- hairlines : rgba(23,20,15,0.12)
Textures : grain béton subtil (noise overlay 2-3%), jamais de blanc pur.

Typographie (3 voix) :
- Display : serif haute-contraste bold, capitales serrées (type Libre Caslon /
  Playfair Display) — les grands titres : « LA PREUVE PAR LA PLANÉITÉ. »
- Data/chiffres : slab/mono très gras pour les stats (55 000, 155…),
  souligné orange-300 épais.
- Labels/eyebrows : IBM Plex Mono uppercase, letter-spacing 0.12em, orange-600,
  précédés d'un tiret : « — CHIFFRES CLÉS ».

Ton : documentaire-luxe, métier, précis. Pas d'emoji, pas de stock-photo feel.

════════════════════════════════════════
5. SECTIONS APRÈS LE HERO (contenu réel)
════════════════════════════════════════
Section CHIFFRES CLÉS (fond sable #D6CCBC, grille 2×2, hairlines) :
eyebrow « — CHIFFRES CLÉS » · H2 « LA PREUVE PAR LA PLANÉITÉ. »
- 55 000 m² — Plus grand chantier réalisé — usine Siemens Gamesa, Le Havre
- 155 m³/jour — De béton mis en œuvre — 311 m³ coulés en 2 jours
- +25 ans — D'expérience métier au service de vos surfaces
- QUALIBAT 2153 — Dallage à usage industriel — technicité supérieure
Chaque chiffre : count-up GSAP au scroll + souligné orange qui se trace.
Bandeau confiance : « ILS NOUS FONT CONFIANCE » — SIEMENS GAMESA · EIFFAGE ·
LA POSTE · GCA LOGISTICS (défilement très lent, mono).

Section SAVOIR-FAIRE : 3 cartes flottantes (même langage glass que le
formulaire, tilt 3D léger au hover) : Coulage & planéité laser / Lissage &
polissage mécanique / Béton ciré décoratif.

Footer : sombre #17140F, wordmark, coordonnées, mention Qualibat.

════════════════════════════════════════
6. TECH & PERFORMANCE
════════════════════════════════════════
- Stack : Three.js (scène hero : plan vidéo + carte glass en quad WebGL si
  possible, sinon DOM + CSS 3D), GSAP + ScrollTrigger (pin + scrub vidéo via
  video.currentTime), Lenis smooth scroll.
- Le scrub vidéo doit être fluide : vidéo encodée avec keyframes rapprochées
  (GOP court, -g 15), 1080p ≤ 8 MB, + fallback poster.
- prefers-reduced-motion : pas de scrub — vidéo remplacée par le poster du plan
  large, contenu accessible en scroll natif.
- Mobile : vidéo 720p dédiée, tilt désactivé, bottom-sheet formulaire.
- Lazy-load de tout le sous-hero. LCP = poster hero. Pas de layout shift.
```

---

## Notes internes (hors prompt)

- **Timecodes réels du master** (probés) : durée 7.67 s · 30 fps · 1920×1080
  (ASTRA 2 upscalé, 6.7 MB). Les markers T1≈2.0 / T2≈4.5 / T3≈5.6 sont à valider
  frame par frame (les valeurs exactes dépendent du montage).
- **Encodage web** : la vidéo est déjà en 1080p ≤ 7 MB → pas de downscale requis.
  Un réencodage GOP court reste conseillé pour un scrub `currentTime` fluide :
  `ffmpeg -i master.mp4 -c:v libx264 -crf 22 -g 15 -movflags +faststart -an hero-1080.mp4`
  (+ variante WebM VP9, + `-vf scale=1280:-2` pour la version mobile 720p, +
  poster JPEG frame 0 et frame T3).
- « logo fabeton » du brief = wordmark **SURFABETON** (confirmer la casse).
- La catchphrase est un placeholder validable : « Le béton, poli comme un miroir. »
