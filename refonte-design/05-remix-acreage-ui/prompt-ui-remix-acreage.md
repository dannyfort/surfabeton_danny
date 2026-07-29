# Prompt Claude Design — Remix UI « Acreage » × SURFABETON

Refonte **UI uniquement** du site de production (`index.html` racine) : plus
premium, plus cinématique, plus éditorial. Le moteur vidéo-au-scroll validé en
prod ne change pas — on transpose le langage visuel du template de référence
« Acreage » (landing agricole Barlow/Instrument Serif, code copié dans
`ref-acreage/`) sur nos contenus, nos hooks DOM et la gamme de couleurs
Surfabéton.

Assets à joindre dans Claude Design :
- **le code du site actuel** : `index.html` (racine du repo, standalone) —
  la page que le prompt demande de ré-imaginer
- `assets/hero-master.mp4` + `assets/poster-start.jpg` + `assets/poster-wide.jpg`
- `assets/normandy-scrub.mp4` + `assets/normandy-poster.jpg`
- `assets/exp-cire.jpg` · `assets/exp-sols.jpg` · `assets/exp-dallage.jpg`
- `assets/logos/` (eiffage, legendre, serapid, lhotellier, siemens-gamesa, la-poste)

---

## PROMPT (à coller tel quel dans Claude Design)

```
RE-IMAGINE entièrement la couche UI de la landing cinématique SURFABETON —
entreprise française de dallage béton industriel haute planéité (coulage,
lissage mécanique, béton ciré poli miroir). LE CODE COMPLET DU SITE ACTUEL
EST JOINT (`index.html`, standalone) : c'est ta base de travail, pas une
simple référence. Son moteur d'animation est validé en production — vidéos
SCRUBBÉES au scroll (pas des boucles autoplay), GSAP ScrollTrigger + Lenis
+ Three.js — et doit survivre À L'IDENTIQUE. Tout le reste (layout,
typographie, composants, mise en scène des textes, micro-interactions) doit
être RE-IMAGINÉ, pas retouché à la marge : ne garde aucun parti pris visuel
de la page jointe par simple inertie. Ta grille de lecture : transposer le
langage UI d'un template de référence (section 2) sur notre structure, nos
contenus réels et notre palette — rendu plus premium, plus cinématique,
plus éditorial. Ton documentaire-luxe, métier, précis. Pas d'emoji, pas de
stock-photo feel, pas de gadget.

════════════════════════════════════════
1. CARTE DU CODE JOINT — LE MOTEUR À PRÉSERVER TEL QUEL
════════════════════════════════════════
Le fichier joint est un standalone vanilla (GSAP 3.12 + ScrollTrigger +
Lenis 1.1 lerp 0.11 + Three.js r152 en CDN), tout passe par le ticker GSAP
(jamais de rAF direct). Sa logique JS (la classe Component en fin de
fichier) est le fruit d'un long réglage frame par frame : REPRENDS-LA TELLE
QUELLE, ne réécris que ce que le nouveau design impose (sélecteurs,
timelines d'apparition). Carte des deux blocs vidéo scrubbés :

A) HERO (#hero-video, section pinnée 250vh) — vidéo maître 8.04 s / 24 fps
encodée GOP court, scrub par video.currentTime. Timecodes constants :
MARKERS = { pourEnd: 2.2, holdEnd: 3.72, crashStart: 4.05, wideLock: 6.9 }
· PHASE A (auto, sans scroll) : la vidéo joue 0 → holdEnd (coulage du béton
  puis cure, close-up ciré miroir) pendant que l'UI d'ouverture apparaît,
  puis pause exacte sur holdEnd.
· PHASE B (hold) : scène immobile qui respire ; le formulaire est utilisable.
· PHASE C (scrub) : AMORCE = les premiers 16 % de la course de scroll
  pilotent la vidéo en 1:1 doigt→frame (holdEnd → crashStart), puis le
  crash-dézoom FPV (crashStart → wideLock) suit le scroll avec lissage
  exponentiel ~0.14 s. Un « assist » avance doucement si le scroll stagne.
· PHASE D (plan large : hangar, pro de dos sur truelle mécanique) :
  ping-pong wideLock → fin dès p ≥ 0.97 ; à p ≥ 0.995 micro-verrou
  (Lenis stoppé 900 ms) pour poser le plan final.
· Parallaxe souris sur la vidéo en début/fin de course, particules WebGL
  « poussière dorée » (desktop uniquement).

B) LE NORMANDY (#bp-video, section pinnée 280vh) — vidéo photoréelle
scrubbée : montée dans le ciel au-dessus du théâtre Le Normandy (Le Havre).
Étalonnage CSS par-dessus la vidéo : dégradé bleu nuit ancré à gauche
rgba(9,20,34,α) + vignette radiale + grain 6 %. Typographie « écrite dans
le ciel », AUCUNE carte. Rouleau de phases typographique à 3 états (bascules
à u = 0.40 et 0.68) + barre de progression terracotta + fiche méta mono.

Systèmes d'apparition existants, à garder comme hooks DOM :
data-reveal (fade-up à l'entrée viewport) · data-count (count-up format fr)
· data-underline (trait qui se trace, scaleX origin left) · data-marquee
(défilement infini, durée en attribut) · data-tilt-card (tilt 3D au hover).
prefers-reduced-motion : posters à la place des vidéos, scroll natif.
Mobile ≤ 820 px : formulaire en bottom-sheet, pas de particules ni tilt.

════════════════════════════════════════
2. L'ADN DE LA RÉFÉRENCE — 10 SIGNATURES À TRANSPOSER (jamais copier)
════════════════════════════════════════
La référence est une landing agricole premium noir/blanc (sans-serif Barlow
+ Instrument Serif italique pour les accents). Ses signatures :

R1 · HERO ÉDITORIAL BAS DE CADRE — tout le contenu ancré en bas du
  viewport : H1 géant à gauche (2 lignes), colonne droite ~420 px avec deux
  courts paragraphes + bouton pilule, hairline horizontale, puis rangée méta
  (tagline à gauche, © à droite). Le centre de l'écran reste VIDE : la vidéo
  respire.
R2 · NAV PILULE CENTRÉE — capsule flottante top-center, backdrop-blur,
  liens de part et d'autre du wordmark central, hover = inversion
  (fond clair / texte sombre), la pilule change de peau au-dessus des
  sections claires.
R3 · MOT-CLÉ SERIF ITALIQUE — titres en sans-serif medium tracking serré ;
  UN groupe de mots par titre passe en serif italique, même corps. C'est LA
  signature typographique de toute la page.
R4 · TYPEWRITER UNIVERSEL — chaque texte apparaît caractère par caractère
  (opacité seule, ~12 ms/caractère, une seule fois, à l'entrée viewport) ;
  titres compris (stagger ~25 ms).
R5 · STATS SERIF — grands chiffres serif ~56 px avec count-up, label
  10-11 px mono uppercase tracking large en dessous, grille 2 colonnes,
  SANS boîtes ni cartes.
R6 · MARQUEE FISHEYE — logos défilants dont l'échelle dépend de la distance
  au centre (1.0 au centre → 0.6 aux bords, courbe quadratique), fondus
  latéraux en dégradé du fond.
R7 · VIDÉO DANS LE LOGO — une vidéo en boucle visible uniquement à travers
  un mask-image SVG du monogramme, posée en vis-à-vis des stats.
R8 · SECTION IMAGE FULL-BLEED — photo métier pleine largeur assombrie,
  titre + 3 colonnes (icône · hairline · h3 · paragraphe), bouton pilule
  inversé.
R9 · CITATION GÉANTE — section claire : kicker, hairline pleine largeur,
  citation serif light ~44 px alignée À DROITE, hairline, rangée basse avec
  source à gauche et 2 flèches rondes de navigation à droite. Carrousel à
  transition spring.
R10 · FORMULAIRE UNDERLINE — champs réduits à leur ligne de base (aucune
  boîte), label discret au-dessus, placeholder conversationnel, ✓/✗ de
  validation à droite du champ, bouton pilule.

════════════════════════════════════════
3. TOKENS SURFABETON (remplacent le noir/blanc de la référence)
════════════════════════════════════════
Jamais de blanc pur ni de noir pur. Grain béton 2-3 % sur les fonds pleins.
--ink-950  #17140F      fonds sombres (remplace le noir du template)
--ink-900  #1A1712      variante fond hero
--ink-600  #3F3A33      texte courant sur fonds clairs
--cream-100 #F6F1E7     texte sur sombre · fond de la section citation
--cream-200 #EDE8DE     fond clair (expertises)
--sand-300  #D6CCBC     fond sable (chiffres clés)
--terracotta-600 #D9503F  accent unique : CTA, barres de progression, règles
--salmon-300 #E89E8E      kickers sur sombre, soulignés de chiffres, numéros
--night-grade rgba(9,20,34,α)  étalonnage du bloc Normandy (inchangé)
Hairlines : rgba(23,20,15,0.12) sur clair · rgba(246,241,231,0.14) sur sombre.
Texte sur sombre : 3 niveaux d'opacité 0.92 / 0.72 / 0.55.

Typographie — 3 voix remixées (fontes déjà chargées) :
· TITRES : Hanken Grotesk 500, tracking -0.01em, leading 1.05 — la voix
  sans-serif du template — avec le mot-clé en Playfair Display italique 500
  même corps (R3). Ex : « Le béton, poli comme un ‹miroir›. »
· DATA : Playfair Display 600 pour les grands chiffres (55 000 · 155 · 25),
  souligné salmon 6 px qui se trace ; labels IBM Plex Mono 10-11 px
  uppercase tracking 0.14-0.2em.
· KICKERS/MÉTA : IBM Plex Mono, tiret initial « — CHIFFRES CLÉS »,
  terracotta sur fond clair, salmon sur fond sombre (voix conservée).
Boutons : pilule rounded-full partout. Primaire terracotta plein, hover
lift léger + ombre chaude ; secondaire bord hairline, hover inversion.

════════════════════════════════════════
4. REMIX SECTION PAR SECTION (ordre et contenus réels inchangés)
════════════════════════════════════════
S0 · NAV (R2) — pilule flottante top-center, backdrop-blur(22px) :
Réalisations · Chantier Normandy | SURFABÉTON (Playfair : « SURFA » 500,
« BÉTON » 800) | Nos expertises · Contact. Fond rgba crème 0.06 + bord
hairline sur vidéo sombre ; au-dessus des sections claires : fond ink-950,
texte crème. Mobile : logo + « Menu » → drawer bottom-sheet ink, liens
18 px séparés par hairlines.

S1 · HERO (R1+R3+R4+R10) — pendant PHASES A/B, mise en scène bas de cadre :
· H1 gauche (clamp 2rem→4.2rem) : « Le béton, poli comme un ‹miroir›. »
  — typewriter pendant le coulage (PHASE A).
· Colonne droite ~420 px, 2 paragraphes courts : « Dallage industriel haute
  planéité — coulé, lissé mécaniquement, ciré poli miroir. » puis « De
  l'atelier au chantier de 55 000 m², pour l'industrie, la logistique et
  l'architecture. Normandie & national. » + CTA pilule secondaire
  « Demander un devis ».
· Hairline, puis rangée méta mono 10 px : « L'EXIGENCE SE MESURE AU LASER »
  à gauche · « SURFABÉTON ©2026 » à droite.
· Indicateur scroll centré bas : « SCROLL — ENTRER DANS LE CHANTIER ».
· LA CARTE GLASS DEVIS (conservée, restylée R10) : fond
  rgba(237,232,222,0.10) + backdrop blur(22px) saturate(1.3), bord
  rgba(255,255,255,0.35), flottement idle ±6 px, tilt 3D max 7° au
  mousemove, spring de gravité quand elle s'échappe pendant le dézoom.
  DEDANS, champs underline-only : NOM · SOCIÉTÉ · EMAIL OU TÉLÉPHONE ·
  SURFACE (M²) · TYPE DE PROJET (select : Dallage industriel / Béton ciré
  décoratif / Rénovation de surface), ✓/✗ discrets à droite, bouton pilule
  terracotta « Demander un devis », mention « Réponse sous 24h ouvrées —
  sans engagement. »
· PHASE C : le bloc bas de cadre s'échappe en parallax opposé au dézoom ;
  la carte part en bas-droite avec inertie de gravité (overshoot léger).
· PHASE D (plan large) : H1 centré « 25 ans de sols industriels ‹sans
  défaut›. » + CTA pilule terracotta « Demander un devis » (fait revenir la
  carte avec le même spring).

S2 · LE NORMANDY (conservé, harmonisé) — même scène : ciel, typo lumineuse
sans carte, étalonnage bleu nuit. Harmoniser sur le nouveau langage :
kicker « 003 — CHANTIER RÉFÉRENCE SURFABÉTON » ; titre « Restauration du
théâtre » (italique serif) / « Le Normandy » (grand corps) ; règle
terracotta 64 px + « LE HAVRE » tracking 0.32em ; corps : « Joyau Art Déco
de 1934, rendu à la scène en novembre 2025 après cinq ans de chantier.
Surfabéton a participé à cette renaissance. » ; rouleau de phases :
01 — LE SOL : COULÉ, TIRÉ, LISSÉ · 02 — LA SALLE SE REMET EN PLACE ·
03 — LE NORMANDY ROUVRE SES PORTES ; barre de progression terracotta ;
méta : « LE NORMANDY — THÉÂTRE ART DÉCO, 1934 / RÉOUVERTURE NOVEMBRE 2025
· 789 PLACES ».

S3 · LA PRESSE EN PARLE (R9, nouvelle mise en scène du bloc presse) — fond
cream-100 : kicker « — LA RÉOUVERTURE DU NORMANDY, VUE PAR LA PRESSE »,
hairline pleine largeur, carrousel de 3 citations Playfair light alignées à
droite (extraits des titres d'articles réels, à valider mot à mot) :
· « C'est une belle aventure humaine — le mythique Normandy rouvre ses
  portes. » — France 3 Normandie
· « Le Normandy inauguré après 5 ans de travaux, plus de 55 spectacles au
  programme. » — Tendance Ouest
· « Du mythe à la scène : le Normandy renaît. » — Ville du Havre
Hairline, rangée basse : wordmark du média à gauche · 2 flèches rondes à
droite. En dessous, compact : marquee presse fisheye (R6) avec les 8
wordmarks SVG existants (France 3 · ici Normandie · Le Moniteur · Tendance
Ouest · Le Havre · La Gazette · Creapills · Wikipédia ·
theatrelenormandy.com), liens conservés.

S4 · CHIFFRES CLÉS (R5+R7) — fond sand-300, 2 colonnes :
· Gauche : kicker « — CHIFFRES CLÉS », H2 « La preuve par la ‹planéité›. »,
  intro d'une phrase, puis grille 2×2 SANS cartes (on abandonne les boîtes
  glass actuelles) : 55 000 m² / « Notre plus grand chantier — usine
  Siemens Gamesa, Le Havre » · 155 m³/jour / « De béton mis en œuvre —
  311 m³ coulés en deux jours » · +25 ans / « D'expérience sur le béton,
  chantier après chantier » · QUALIBAT 2153 / « Dallage à usage industriel
  — technicité supérieure ». Chiffres Playfair ~56 px count-up, souligné
  salmon 6 px tracé, labels mono uppercase.
· Droite : monogramme « S » Playfair (ou wordmark SURFABÉTON empilé) en
  mask-image SVG rempli par la vidéo du béton ciré en boucle (R7) —
  l'objet premium de la section.
· Dessous, hairline puis « ILS NOUS CONFIENT LEURS SOLS » + marquee
  clients fisheye (R6) : Eiffage · Legendre · Serapid · Lhotellier ·
  Siemens Gamesa · La Poste (SVG fournis, mix-blend multiply sur sable).

S5 · NOS EXPERTISES (R8) — full-bleed photo chantier (exp-dallage.jpg)
assombrie par dégradé ink 0.08→0.68 : kicker « — CŒUR DE MÉTIER », H2
« Nos ‹expertises›. », baseline « Du dallage de 55 000 m² au béton ciré
poli miroir — la même exigence de planéité. » ; 3 colonnes hairline
(numéro mono salmon · hairline · h3 · paragraphe court) :
01 — DÉCORATIF / Bétons décoratifs / « Béton ciré poli miroir, teintes
minérales, finitions sur mesure. » · 02 — INDUSTRIEL / Sols industriels /
« Dallage haute planéité laser pour la logistique et l'industrie. » ·
03 — GRANDES SURFACES / Dallage béton / « Coulage et lissage mécanique,
jusqu'à 55 000 m² d'un seul tenant. » (paragraphes = placeholders à
valider). Dessous, ligne mono : TRAITEMENT DE SURFACE · RENFORCEMENT DE
PLANCHERS · RÉPARATIONS DE DALLAGE · BÉTON DRAINANT + CTA pilule inversé.

S6 · FOOTER — ink-950, 4 colonnes : wordmark + « Dallage béton industriel
haute planéité — coulage, lissage mécanique, béton ciré poli miroir.
Normandie & national. » / — CONTACT : 02 32 56 09 92 ·
surfabeton@gmail.com · Pl. Caillemare, 27310 Saint-Ouen-de-Thouberville /
— EXPLORER : Chiffres clés · Nos expertises · Demander un devis /
— CERTIFICATION : QUALIBAT 2153. Barre légale sous hairline :
« © 2026 Surfabéton » · mentions.

════════════════════════════════════════
5. SYSTÈME D'APPARITION DES TEXTES ET ÉLÉMENTS (unifié)
════════════════════════════════════════
· Tous les textes : typewriter R4 branché sur les hooks data-reveal
  (déclenchement once à l'entrée viewport, marge -10 px). Corps 12 ms/car ;
  titres 25 ms/car ; délais en cascade au sein d'un même bloc.
· Ordre d'apparition d'un bloc : kicker → hairline (scaleX) → titre →
  corps → data/CTA.
· Chiffres : data-count, count-up 1.5 s easeOut, format fr (espaces fines).
· Soulignés : data-underline, scaleX 0→1 origin left.
· Médias et gros objets (monogramme vidéo, photo full-bleed) :
  fade + scale 0.92→1, stagger 60 ms.
· prefers-reduced-motion : tout visible sans animation, vidéos → posters.

════════════════════════════════════════
6. TECH & PERFORMANCE (contraintes dures)
════════════════════════════════════════
· Sortie : la MÊME page standalone ré-imaginée — pars du fichier joint,
  réécris librement le HTML/CSS de la couche UI, conserve la logique du
  moteur. Libs CDN identiques (GSAP 3.12.5 + ScrollTrigger, Lenis 1.1.14,
  Three r152).
· CONSERVER les ids et hooks DOM du fichier joint (la logique JS les
  cible, et le portage en prod en dépend) :
  #nav-bar, #hero-wrap, #hero-sticky, #hero-video, #hero-fx, #bp-wrap,
  #bp-video, #presse-normandy, #realisations, #expertises, #contact,
  data-reveal / data-count / data-underline / data-marquee /
  data-tilt-card / data-nx-* / data-bp-phase / data-sb-devis-cta.
· Vidéos servies telles quelles (hero-master.mp4 GOP court,
  normandy-scrub.mp4), posters JPEG = LCP, preload auto, muted playsinline.
· Aucun layout shift ; lazy-load de tout le sous-hero ; fonts existantes
  (Playfair Display, IBM Plex Mono, Hanken Grotesk) display=swap.
· Mobile ≤ 820 px : hero bas de cadre empilé (H1 puis colonne droite),
  carte devis → bottom-sheet + CTA sticky pilule, marquees et fisheye
  conservés, tilt et particules désactivés.
```

---

## Notes internes (hors prompt)

- **Périmètre** : re-skin. Le code de prod (`index.html` racine) est **joint au
  prompt** — Claude Design ré-imagine la page jointe, il ne reconstruit pas
  depuis description ; la section 1 lui sert de carte de lecture du fichier.
  Le `.dc.html` produit sera converti puis porté dans `index.html` de prod
  comme la v1 (`03-landing-claude-design/imported/build.cjs`) ; d'où la
  contrainte « mêmes ids/hooks DOM » en section 6 du prompt.
- **Inversion typographique assumée** (la vraie décision du remix) : les grands
  titres passent de Playfair-uppercase-bold → **Hanken Grotesk 500 + mot-clé
  Playfair italique** (mapping 1:1 avec Barlow + Instrument Serif du template).
  Playfair reste la voix des grands chiffres, du wordmark et des citations.
  À valider avant d'envoyer le prompt si tu veux garder les titres serif.
- **Citations presse S3** : reformulées depuis les titres des articles déjà
  liés dans la page — à vérifier mot à mot (ou raccourcir en « … ») avant prod.
- **Placeholders à valider** : tagline méta hero « L'EXIGENCE SE MESURE AU
  LASER » ; les 3 paragraphes courts des expertises (les cartes actuelles
  n'ont que des titres).
- **Monogramme vidéo (R7)** : « S » Playfair vs wordmark complet — laisser
  Claude Design proposer, trancher au rendu.
- **Chiffres clés** : le passage « cartes glass » → « stats nues serif » est le
  plus gros changement visuel sous le hero ; si trop nu au rendu, on peut
  garder une hairline-grid (traits) sans revenir aux boîtes.
- `ref-acreage/` = code du template (zip Bolt `project-bolt-github-pzt1ayyk`),
  copié sans `node_modules`, sans `package-lock.json` ni `public/*.gif`
  (7,6 Mo de GIF décoratifs inutiles à la transposition).
