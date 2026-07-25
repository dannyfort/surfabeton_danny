/* =====================================================================
   LE NORMANDY — Théâtre Art Déco (1934), reconstruction procédurale Three.js
   Chantier référence Surfabéton — remplace le hangar schématique du bloc
   « Le lieu se construit ». Spécification mesurée sur l'élévation photo :
   refonte-design/04-normandy-3d/normandy-sculpt-spec.json
   Repère : x = largeur (centré), y = haut (sol 0), z = profondeur (+rue).
   Unités : mètres. Aucune dépendance module — THREE global (r152).
   API : window.SB_NORMANDY.create(THREE, opts) -> { group, build(u), lights, dispose }
   ===================================================================== */
(function () {
  'use strict';

  // ---------- palette (évidence PBR extraite des crops photo) ----------
  const COL = {
    white: 0xF0EEE6, whiteLow: 0xE0DCCF,
    cream: 0xEFE8CF,
    teal: 0x1D5A66, tealDark: 0x17444B,
    signGreen: 0x5F7F5B,
    signRed: 0xA93B32,
    granito: 0x7C8577,
    mosaic: 0x9FBE9A,
    metalGreen: 0x1F4D44,
    metalDark: 0x15181A,
    glassPale: 0xC8D4D8, amber: 0xB98A34,
    glassDark: 0x0E1A18,
    limestone: 0xD8CDB4,
    brass: 0xC8A24A,
    rope: 0x8E1F24,
    sidewalk: 0x9E5F55,
    body: 0x241F19,
    plaster: 0xCFCBC0, // état « enduit brut » avant mise en peinture
  };

  // ---------- petits générateurs de textures (CanvasTexture) ----------
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

  // champ de hauteur -> normal map (Sobel), cf. threejs_texture_reference.md
  function heightToNormal(THREE, hc, strength) {
    const w = hc.width, h = hc.height;
    const src = hc.getContext('2d').getImageData(0, 0, w, h).data;
    const out = canvas(w, h); const ctx = out.getContext('2d');
    const img = ctx.createImageData(w, h);
    const at = (x, y) => src[(((y + h) % h) * w + ((x + w) % w)) * 4];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) / 255;
      const dy = (at(x, y + 1) - at(x, y - 1)) / 255;
      const i = (y * w + x) * 4;
      img.data[i] = (-dx * strength * 0.5 + 0.5) * 255;
      img.data[i + 1] = (dy * strength * 0.5 + 0.5) * 255;
      img.data[i + 2] = 255; img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    const t = new THREE.CanvasTexture(out);
    t.colorSpace = THREE.NoColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  // crépi : blobs aléatoires (graine déterministe)
  function makeStippleHeight(seed, density, r0, r1) {
    const c = canvas(256, 256); const ctx = c.getContext('2d');
    let s = seed;
    const rnd = () => (s = (s * 16807 + 19) % 2147483647) / 2147483647;
    ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < density; i++) {
      const x = rnd() * 256, y = rnd() * 256, r = r0 + rnd() * (r1 - r0);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const up = rnd() > 0.4;
      g.addColorStop(0, up ? 'rgba(220,220,220,0.9)' : 'rgba(70,70,70,0.7)');
      g.addColorStop(1, 'rgba(128,128,128,0)');
      ctx.fillStyle = g;
      // tuilage : dessine aussi les copies décalées près des bords
      for (const ox of [0, 256, -256]) for (const oy of [0, 256, -256]) {
        ctx.beginPath(); ctx.arc(x + ox, y + oy, r, 0, 6.2832); ctx.fill();
      }
    }
    return c;
  }

  // léger nuage tonal (albédo enduit / rendu)
  function makeMottleMap(THREE, hex, amp, seed) {
    const c = canvas(256, 256); const ctx = c.getContext('2d');
    let s = seed; const rnd = () => (s = (s * 48271 + 7) % 2147483647) / 2147483647;
    const base = new THREE.Color(hex);
    ctx.fillStyle = '#' + base.getHexString(); ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 46; i++) {
      const x = rnd() * 256, y = rnd() * 256, r = 30 + rnd() * 90;
      const k = (rnd() - 0.5) * amp;
      const v = base.clone().offsetHSL(0, 0, k);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(' + (v.r * 255 | 0) + ',' + (v.g * 255 | 0) + ',' + (v.b * 255 | 0) + ',0.28)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      for (const ox of [0, 256, -256]) for (const oy of [0, 256, -256]) {
        ctx.beginPath(); ctx.arc(x + ox, y + oy, r, 0, 6.2832); ctx.fill();
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  // granito : mouchetis terrazzo vert-gris + éclats clairs/sombres
  function makeGranitoMap(THREE) {
    const c = canvas(512, 512); const ctx = c.getContext('2d');
    let s = 421; const rnd = () => (s = (s * 16807 + 11) % 2147483647) / 2147483647;
    ctx.fillStyle = '#8A9284'; ctx.fillRect(0, 0, 512, 512);
    const chips = ['#DFDFD5', '#AEB6A6', '#5C6457', '#3E463C', '#8A9284', '#C9CDBE'];
    for (let i = 0; i < 6800; i++) {
      const x = rnd() * 512, y = rnd() * 512, r = 0.6 + rnd() * 2.4;
      ctx.fillStyle = chips[(rnd() * chips.length) | 0];
      ctx.globalAlpha = 0.5 + rnd() * 0.5;
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }

  // mosaïque pâte de verre vert clair : tesselles + joints
  function makeMosaicMaps(THREE) {
    const c = canvas(512, 64); const ctx = c.getContext('2d');
    const hc = canvas(512, 64); const hctx = hc.getContext('2d');
    let s = 97; const rnd = () => (s = (s * 48271 + 3) % 2147483647) / 2147483647;
    ctx.fillStyle = '#7FA57A'; ctx.fillRect(0, 0, 512, 64);
    hctx.fillStyle = '#404040'; hctx.fillRect(0, 0, 512, 64);
    const t0 = 8; // taille tesselle px
    for (let y = 0; y < 64; y += t0) for (let x = 0; x < 512; x += t0) {
      const v = 0.75 + rnd() * 0.5;
      const col = new THREE.Color(0x9FBE9A).offsetHSL((rnd() - 0.5) * 0.02, (rnd() - 0.5) * 0.08, (v - 1) * 0.22);
      ctx.fillStyle = '#' + col.getHexString();
      ctx.fillRect(x + 1, y + 1, t0 - 2, t0 - 2);
      const l = 140 + rnd() * 80;
      hctx.fillStyle = 'rgb(' + l + ',' + l + ',' + l + ')';
      hctx.fillRect(x + 1, y + 1, t0 - 2, t0 - 2);
    }
    const map = new THREE.CanvasTexture(c);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    return { map: map, normalMap: heightToNormal(THREE, hc, 1.2) };
  }

  // vitrail plombé : grille irrégulière, colonnes ambre, joints teal sombre
  function makeLeadedGlass(THREE, seed, amberCol) {
    const W = 128, H = 512;
    const c = canvas(W, H); const ctx = c.getContext('2d');
    let s = seed; const rnd = () => (s = (s * 16807 + 5) % 2147483647) / 2147483647;
    ctx.fillStyle = '#CDD8DB'; ctx.fillRect(0, 0, W, H);
    const cols = 3, cw = W / cols;
    for (let col = 0; col < cols; col++) {
      let y = 0;
      while (y < H) {
        const rh = (rnd() > 0.55 ? 34 : 58) + rnd() * 14;
        const isAmber = col === amberCol && rnd() > 0.45;
        const base = new THREE.Color(isAmber ? 0xA8822F : 0xCDD8DB)
          .offsetHSL(0, (rnd() - 0.5) * 0.03, (rnd() - 0.5) * 0.045);
        ctx.fillStyle = '#' + base.getHexString();
        ctx.fillRect(col * cw, y, cw, rh);
        // léger dégradé vertical par carreau (verre soufflé)
        const g = ctx.createLinearGradient(0, y, 0, y + rh);
        g.addColorStop(0, 'rgba(255,255,255,0.10)');
        g.addColorStop(1, 'rgba(20,40,44,0.12)');
        ctx.fillStyle = g; ctx.fillRect(col * cw, y, cw, rh);
        y += rh;
      }
    }
    // joints (plombs)
    ctx.strokeStyle = '#1A464E'; ctx.lineWidth = 2;
    for (let col = 0; col <= cols; col++) {
      ctx.beginPath(); ctx.moveTo(col * cw, 0); ctx.lineTo(col * cw, H); ctx.stroke();
    }
    s = seed; // re-parcourt les mêmes hauteurs pour tracer les traverses
    for (let col = 0; col < cols; col++) {
      let y = 0;
      while (y < H) {
        const rh = (rnd() > 0.55 ? 34 : 58) + rnd() * 14; rnd();
        ctx.beginPath(); ctx.moveTo(col * cw, y); ctx.lineTo((col + 1) * cw, y); ctx.stroke();
        y += rh;
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  // affiche de spectacle (cadre lumineux sur les vitrines)
  function makePoster(THREE, seed) {
    const c = canvas(96, 144); const ctx = c.getContext('2d');
    let s = seed; const rnd = () => (s = (s * 48271 + 13) % 2147483647) / 2147483647;
    ctx.fillStyle = '#171310'; ctx.fillRect(0, 0, 96, 144);
    const g = ctx.createRadialGradient(48, 78, 6, 48, 78, 70);
    const hues = ['#B4452A', '#C08A2E', '#7A4A6E', '#3E6E62'];
    g.addColorStop(0, hues[(rnd() * hues.length) | 0]);
    g.addColorStop(1, '#171310');
    ctx.fillStyle = g; ctx.fillRect(6, 18, 84, 108);
    ctx.fillStyle = '#EFE8CF';
    ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('NORMANDY', 48, 12);
    ctx.fillStyle = 'rgba(239,232,207,0.75)';
    ctx.fillRect(14, 130, 68, 3);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  // carte « foyer » : volée de marches aux nez jaunes dans la pénombre chaude
  function makeFoyer(THREE) {
    const c = canvas(256, 128); const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, '#100C08'); g.addColorStop(0.55, '#241A12'); g.addColorStop(1, '#3A2A1A');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 128);
    for (let i = 0; i < 7; i++) {
      const y = 122 - i * 9;
      ctx.fillStyle = 'rgba(58,42,26,0.9)'; ctx.fillRect(20, y - 3, 216, 5);
      ctx.fillStyle = 'rgba(214,168,58,' + (0.5 - i * 0.05) + ')';
      ctx.fillRect(20, y - 4, 216, 2); // nez de marche jaune
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  // ---------- fabrique principale ----------
  function create(THREE, opts) {
    opts = opts || {};
    const quality = opts.quality || 'high'; // 'high' | 'lite'
    const group = new THREE.Group();
    group.name = 'normandy-theater';

    const disposables = []; // géométries, matériaux, textures
    const track = (r) => { disposables.push(r); return r; };

    // ---------- matériaux ----------
    const crepiHeight = makeStippleHeight(1234, 340, 3, 9);
    const crepiNormal = track(heightToNormal(THREE, crepiHeight, 2.2));
    crepiNormal.repeat.set(2.2, 3.4);
    const letterHeight = makeStippleHeight(77, 520, 1.2, 3.4);
    const letterNormal = track(heightToNormal(THREE, letterHeight, 0.8));
    letterNormal.repeat.set(2, 2);
    const whiteNormal = track(heightToNormal(THREE, makeStippleHeight(55, 80, 5, 16), 0.16));
    whiteNormal.repeat.set(0.9, 0.9);
    const granitoMap = track(makeGranitoMap(THREE));
    granitoMap.repeat.set(1.4, 1.4);
    const mosaicMaps = makeMosaicMaps(THREE);
    track(mosaicMaps.map); track(mosaicMaps.normalMap);
    const glassTexA = track(makeLeadedGlass(THREE, 901, 2));
    const glassTexB = track(makeLeadedGlass(THREE, 407, 0));
    const foyerTex = track(makeFoyer(THREE));

    const M = {};
    M.white = track(new THREE.MeshStandardMaterial({
      color: 0xF2F0E9, normalMap: whiteNormal, roughness: 0.6, metalness: 0.0,
    }));
    M.cream = track(new THREE.MeshStandardMaterial({ color: COL.cream, roughness: 0.6 }));
    M.teal = track(new THREE.MeshStandardMaterial({
      color: COL.plaster, normalMap: crepiNormal, roughness: 0.88,
    }));
    M.signGreen = track(new THREE.MeshStandardMaterial({
      color: COL.plaster, normalMap: letterNormal, roughness: 0.72,
    }));
    M.signRed = track(new THREE.MeshStandardMaterial({ color: COL.plaster, roughness: 0.66 }));
    M.granito = track(new THREE.MeshPhysicalMaterial({
      color: 0xC6C2B7, map: granitoMap, roughness: 0.34, clearcoat: 0.25,
      clearcoatRoughness: 0.35,
    }));
    M.mosaic = track(new THREE.MeshPhysicalMaterial({
      color: 0xCFCBC0, map: mosaicMaps.map, normalMap: mosaicMaps.normalMap,
      roughness: 0.18, clearcoat: 0.6, clearcoatRoughness: 0.2,
    }));
    M.metalGreen = track(new THREE.MeshStandardMaterial({
      color: 0x8A8D8A, roughness: 0.42, metalness: 0.25,
    }));
    M.metalDark = track(new THREE.MeshStandardMaterial({ color: COL.metalDark, roughness: 0.5, metalness: 0.6 }));
    M.glassA = track(new THREE.MeshStandardMaterial({
      map: glassTexA, emissiveMap: glassTexA, emissive: 0x000000,
      roughness: 0.3, metalness: 0.0, transparent: true, opacity: 0.0,
    }));
    M.glassB = track(new THREE.MeshStandardMaterial({
      map: glassTexB, emissiveMap: glassTexB, emissive: 0x000000,
      roughness: 0.3, metalness: 0.0, transparent: true, opacity: 0.0,
    }));
    // rugosité volontairement haute : en plein jour, un verre trop lisse concentrait
    // la clé directionnelle en une tache blanche cramée au milieu de la loggia
    M.glassDark = track(new THREE.MeshPhysicalMaterial({
      color: COL.glassDark, roughness: 0.38, metalness: 0.0, clearcoat: 0.16,
      clearcoatRoughness: 0.6, transparent: true, opacity: 0.0,
    }));
    M.limestone = track(new THREE.MeshStandardMaterial({ color: COL.limestone, roughness: 0.7 }));
    M.brass = track(new THREE.MeshStandardMaterial({ color: COL.brass, roughness: 0.28, metalness: 1.0 }));
    M.rope = track(new THREE.MeshStandardMaterial({ color: COL.rope, roughness: 0.9 }));
    M.foyer = track(new THREE.MeshBasicMaterial({ map: foyerTex, transparent: true, opacity: 0.0 }));
    M.body = track(new THREE.MeshStandardMaterial({ color: 0xDAD5C9, roughness: 0.85 }));
    M.poster = null; // créés à la volée (2 variantes)

    // ---------- registre de construction (build(u)) ----------
    const stages = []; // {node|mat|light, t0, t1, kind, extra}
    function S(node, t0, t1, kind, extra) {
      stages.push({ node: node, t0: t0, t1: t1, kind: kind || 'rise', extra: extra || {} });
      if (kind === 'rise' || kind === 'pop' || !kind) node.scale.y = 0.0001;
      if (kind === 'pop') node.scale.set(0.0001, 0.0001, 0.0001);
      if (kind === 'riseX') node.scale.x = 0.0001;
      if (kind === 'drop') { node.userData.dropY = node.position.y; node.position.y += (extra && extra.h) || 2.2; node.visible = false; }
      return node;
    }
    const easeOut = (x) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
    const easeBack = (x) => { x = Math.max(0, Math.min(1, x)); const c = 1.35; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };

    // peinture (phase 3) : matériau -> [t0, t1, couleur cible]
    const paints = [
      { m: M.teal, t0: 0.685, t1: 0.745, to: new THREE.Color(0x1F5B66) },
      { m: M.granito, t0: 0.70, t1: 0.76, to: new THREE.Color(0x99A294) },
      { m: M.mosaic, t0: 0.72, t1: 0.78, to: new THREE.Color(0x93B78E) },
      { m: M.metalGreen, t0: 0.72, t1: 0.79, to: new THREE.Color(0x17403A) },
      { m: M.signGreen, t0: 0.76, t1: 0.84, to: new THREE.Color(0x4C6848) },
      { m: M.signRed, t0: 0.84, t1: 0.89, to: new THREE.Color(0x74211B) },
    ];
    paints.forEach((p) => { p.from = p.m.color.clone(); });

    // ---------- helpers géométrie ----------
    const G = [];
    const geo = (g) => { G.push(g); return g; };
    function box(w, h, d, mat, x, y, z, baseAnchor) {
      const g = geo(new THREE.BoxGeometry(w, h, d));
      if (baseAnchor !== false) g.translate(0, h / 2, 0);
      const m = new THREE.Mesh(g, mat);
      m.position.set(x, y, z);
      return m;
    }
    function roundedRectShape(w, h, r) {
      const s = new THREE.Shape();
      const x = -w / 2, y = 0;
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
      s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
      s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
      s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
      return s;
    }
    function extrudeMesh(shape, depth, mat, bevel) {
      const g = geo(new THREE.ExtrudeGeometry(shape, {
        depth: depth, bevelEnabled: !!bevel,
        bevelThickness: bevel || 0, bevelSize: bevel || 0, bevelSegments: 1, steps: 1,
      }));
      return new THREE.Mesh(g, mat);
    }

    // ombres : émetteurs = masses principales seulement
    function shadows(m, cast, receive) { m.castShadow = !!cast; m.receiveShadow = !!receive; return m; }

    /* ============================================================
       CONSTANTES MESURÉES (élévation frontale)
       ============================================================ */
    const XO = 8.5, XI = 2.8, XW = 5.55;      // pylônes ext., int., centres ailes
    const YB = 4.85;                           // naissance étage
    const ZW = 0, ZP = 0.55, ZC = 0.30;        // plans aile / pylône / avant-corps
    const ZGF = -1.15, ZPIER = -0.35, ZS = 1.35;

    /* ------------------------------------------------------------
       PHASE A — LE SOCLE (0.04 → 0.34)
       ------------------------------------------------------------ */
    const gf = new THREE.Group(); group.add(gf);
    const tmpM = new THREE.Matrix4(); const tmpQ = new THREE.Quaternion();

    // seuil + emmarchement pierre
    S(shadows(box(12.9, 0.14, 1.5, M.limestone, 0, 0, ZGF + 1.05), false, true), 0.05, 0.10);
    S(shadows(box(12.5, 0.14, 1.0, M.limestone, 0, 0.14, ZGF + 0.8), false, true), 0.07, 0.12);
    // tapis
    S(box(2.6, 0.02, 1.0, M.metalDark, 0, 0.28, ZGF + 0.7), 0.09, 0.13);

    // piliers granito (coins avant arrondis) + caps corbeaux
    const pierShape = roundedRectShape(1.7, 3.6, 0.18);
    const pierGeo = geo(new THREE.ExtrudeGeometry(pierShape, { depth: 1.0, steps: 1, bevelEnabled: false }));
    pierGeo.rotateX(0); // profil en élévation, extrusion vers -z
    [-XO + 0.05, -XI, XI, XO - 0.05].forEach((px, i) => {
      const p = new THREE.Mesh(pierGeo, M.granito);
      p.position.set(px, 0.28, ZPIER - 1.0);
      shadows(p, true, true);
      S(p, 0.10 + i * 0.035, 0.22 + i * 0.035);
      gf.add(p);
      // cap évasé (2 marches)
      const c1 = box(1.84, 0.16, 1.1, M.white, px, 3.88, ZPIER - 0.55 - 0.5 + 0.02);
      const c2 = box(1.98, 0.18, 1.2, M.white, px, 4.04, ZPIER - 0.55 - 0.55 + 0.05);
      S(c1, 0.28 + i * 0.015, 0.345 + i * 0.015); S(c2, 0.295 + i * 0.015, 0.36 + i * 0.015);
      gf.add(c1, c2);
    });

    // murs de refend granito fermant la loggia
    [-1, 1].forEach((sx) => {
      const w = box(0.75, 4.15, 2.3, M.granito, sx * 9.32, 0.28, ZPIER - 2.25);
      shadows(w, true, true);
      S(w, 0.16, 0.28); gf.add(w);
    });

    // socle bas granito sous vitrines (plinthe sombre)
    S(box(19.0, 0.30, 0.25, M.granito, 0, 0.0, ZGF - 0.1), 0.08, 0.14, 'rise');

    // bandeau crème + bandeau mosaïque (plan piliers)
    S(box(19.0, 0.42, 1.75, M.cream, 0, 3.63, ZPIER - 0.9), 0.24, 0.32);
    const mosaic = box(19.0, 0.45, 0.1, M.mosaic, 0, 3.18, ZPIER - 0.06);
    mosaic.material = M.mosaic; S(mosaic, 0.26, 0.33); gf.add(mosaic);

    // vitrines : 3 baies, châssis vert sombre à imposte cintrée
    const bayXs = [-5.6, 0, 5.6];
    const mullionSlots = [];
    const posterTexs = [track(makePoster(THREE, 5)), track(makePoster(THREE, 23))];
    const glassPanes = [];
    bayXs.forEach((bx, bi) => {
      const bay = new THREE.Group(); bay.position.set(bx, 0, 0); gf.add(bay);
      // châssis : cadre extrudé avec tête cintrée (arc surbaissé)
      const fw = 3.95, fh0 = 0.30, fApex = 3.53, fSpring = 2.72;
      const fs = new THREE.Shape();
      fs.moveTo(-fw / 2, fh0); fs.lineTo(fw / 2, fh0);
      fs.lineTo(fw / 2, fSpring);
      fs.quadraticCurveTo(fw / 2, fApex, fw * 0.22, fApex);
      fs.lineTo(-fw * 0.22, fApex);
      fs.quadraticCurveTo(-fw / 2, fApex, -fw / 2, fSpring);
      fs.closePath();
      // trous vitrés : 6 colonnes sous imposte + éventail
      const inner = new THREE.Path();
      const iw = fw - 0.24, ih = 2.32;
      inner.moveTo(-iw / 2, fh0 + 0.10); inner.lineTo(iw / 2, fh0 + 0.10);
      inner.lineTo(iw / 2, ih); inner.lineTo(-iw / 2, ih); inner.closePath();
      fs.holes.push(inner);
      const imposte = new THREE.Path();
      imposte.moveTo(-iw / 2, ih + 0.12); imposte.lineTo(iw / 2, ih + 0.12);
      imposte.lineTo(iw / 2, fSpring - 0.02);
      imposte.quadraticCurveTo(iw / 2, fApex - 0.12, fw * 0.20, fApex - 0.12);
      imposte.lineTo(-fw * 0.20, fApex - 0.12);
      imposte.quadraticCurveTo(-iw / 2, fApex - 0.12, -iw / 2, fSpring - 0.02);
      imposte.closePath();
      fs.holes.push(imposte);
      const frame = extrudeMesh(fs, 0.10, M.metalGreen);
      frame.position.set(0, 0, ZGF);
      S(frame, 0.24 + bi * 0.02, 0.32 + bi * 0.02, 'fade');
      bay.add(frame);
      // meneaux : transforms collectés, instanciés en un seul draw call plus bas
      for (let mIdx = 1; mIdx <= 5; mIdx++) {
        const mx = -iw / 2 + (iw / 6) * mIdx;
        mullionSlots.push([bx + mx, fh0 + 0.10, ZGF + 0.02, ih - fh0 - 0.1]);
      }
      const trav = box(iw, 0.07, 0.06, M.metalGreen, 0, ih, ZGF + 0.02);
      S(trav, 0.26 + bi * 0.02, 0.33 + bi * 0.02, 'fade'); bay.add(trav);
      // vitrage sombre réfléchissant
      const pane = new THREE.Mesh(
        geo(new THREE.PlaneGeometry(iw, fApex - fh0 - 0.16)), M.glassDark);
      pane.position.set(0, (fApex + fh0) / 2, ZGF - 0.04);
      glassPanes.push(pane); bay.add(pane);
      S(pane, 0.27 + bi * 0.02, 0.35 + bi * 0.02, 'fade'); // sinon opacité 0 : on voyait la salle blanche au travers
      // affiches lumineuses sur le vitrage
      [-1, 1].forEach((ps) => {
        const pm = new THREE.MeshBasicMaterial({ map: posterTexs[(bi + (ps > 0 ? 1 : 0)) % 2], transparent: true, opacity: 0 });
        track(pm);
        const poster = new THREE.Mesh(geo(new THREE.PlaneGeometry(0.62, 0.95)), pm);
        poster.position.set(ps * 1.35, 1.55, ZGF + 0.03);
        poster.userData.posterMat = pm;
        bay.add(poster);
        S(poster, 0.30 + bi * 0.01, 0.36, 'poster');
      });
    });

    // meneaux instanciés (un seul draw call pour les 3 baies)
    if (mullionSlots.length) {
      const mh = mullionSlots[0][3];
      const mullGeo = geo(new THREE.BoxGeometry(0.05, mh, 0.06));
      mullGeo.translate(0, mh / 2, 0);
      const mullIM = new THREE.InstancedMesh(mullGeo, M.metalGreen, mullionSlots.length);
      mullionSlots.forEach((sl, i) => {
        tmpM.compose(new THREE.Vector3(sl[0], sl[1], sl[2]), tmpQ, new THREE.Vector3(1, 1, 1));
        mullIM.setMatrixAt(i, tmpM);
      });
      const mullG = new THREE.Group(); mullG.add(mullIM); gf.add(mullG);
      S(mullG, 0.27, 0.34, 'pop');
    }

    // fond de loggia : panneau sombre opaque couvrant toute la largeur des baies —
    // sans lui on voit la masse blanche de la salle à travers les vitrines.
    const backdrop = box(18.0, 4.3, 0.12, M.body, 0, 0, ZGF - 1.55);
    backdrop.material = track(new THREE.MeshStandardMaterial({ color: 0x1B1712, roughness: 0.95 }));
    gf.add(backdrop);
    S(backdrop, 0.26, 0.34);

    // fond de foyer (carte escalier chaud)
    const foyer = new THREE.Mesh(geo(new THREE.PlaneGeometry(15.5, 3.4)), M.foyer);
    foyer.position.set(0, 0.25, ZGF - 1.45);
    gf.add(foyer);
    S(foyer, 0.30, 0.36, 'fade');

    /* ------------------------------------------------------------
       PHASE B — LES VOLUMES (0.34 → 0.68)
       ------------------------------------------------------------ */
    const upper = new THREE.Group(); group.add(upper);

    // corps de salle (masse sombre arrière)
    const body = shadows(box(18.6, 11.6, 14.0, M.body, 0, 0.2, -1.6 - 14.0 / 2 - 0.45), false, true);
    S(body, 0.40, 0.55); upper.add(body);

    // --- balcon : bandeau mouluré + dalle à bouts arrondis + garde-corps
    const balc = new THREE.Group(); group.add(balc);
    // gros bandeau mouluré (profil escalier + quart-de-rond) sous dalle
    const bandProfile = new THREE.Shape();
    bandProfile.moveTo(0, 0);
    bandProfile.lineTo(0.55, 0); bandProfile.lineTo(0.62, 0.10);
    bandProfile.absarc(0.62, 0.28, 0.18, -Math.PI / 2, 0, false);
    bandProfile.lineTo(0.80, 0.52); bandProfile.lineTo(0.94, 0.58);
    bandProfile.lineTo(0.94, 0.66); bandProfile.lineTo(0, 0.66);
    bandProfile.closePath();
    const bandGeo = geo(new THREE.ExtrudeGeometry(bandProfile, { depth: 19.4, steps: 1, bevelEnabled: false }));
    bandGeo.rotateY(-Math.PI / 2); // extrusion +z -> -x : décalage +9.7 pour couvrir -9.7..+9.7
    const band = new THREE.Mesh(bandGeo, M.white);
    band.position.set(9.7, 3.95, ZS - 1.0);
    shadows(band, true, false);
    S(band, 0.34, 0.44); balc.add(band);

    // dalle plan arrondi (Shape XZ extrudée en épaisseur)
    const slabShape = new THREE.Shape();
    const SW = 19.6, SD = 2.5, SR = 0.8;
    slabShape.moveTo(-SW / 2 + SR, 0);
    slabShape.lineTo(SW / 2 - SR, 0);
    slabShape.absarc(SW / 2 - SR, -SR, SR, Math.PI / 2, 0, true);
    slabShape.lineTo(SW / 2, -SD);
    slabShape.lineTo(-SW / 2, -SD);
    slabShape.lineTo(-SW / 2, -SR);
    slabShape.absarc(-SW / 2 + SR, -SR, SR, Math.PI, Math.PI / 2, true);
    slabShape.closePath();
    const slabGeo = geo(new THREE.ExtrudeGeometry(slabShape, { depth: 0.4, steps: 1, bevelEnabled: false }));
    slabGeo.rotateX(Math.PI / 2); // profondeur du plan vers -z, épaisseur vers le bas
    const slab = new THREE.Mesh(slabGeo, M.white);
    slab.position.set(0, 5.05, ZS);
    shadows(slab, true, true);
    S(slab, 0.37, 0.46); balc.add(slab);

    // consoles arrondies sous les bouts de dalle
    [-1, 1].forEach((sx) => {
      const con = new THREE.Mesh(geo(new THREE.CylinderGeometry(0.55, 0.4, 1.0, 20, 1, false, 0, Math.PI)), M.white);
      con.position.set(sx * 9.35, 3.6, ZS - 0.75);
      con.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
      S(con, 0.40, 0.48); balc.add(con);
    });

    // parapet (fascia + gorge creuse)
    const parapet = box(19.2, 0.52, 0.34, M.white, 0, 5.05, ZS - 0.62);
    shadows(parapet, true, false);
    S(parapet, 0.42, 0.50); balc.add(parapet);
    const groove = box(19.2, 0.08, 0.02, M.whiteLowMat || (M.whiteLowMat = track(new THREE.MeshStandardMaterial({ color: 0xD6D2C6, roughness: 0.7 }))), 0, 5.24, ZS - 0.44);
    S(groove, 0.44, 0.52); balc.add(groove);
    const parapetCap = box(19.3, 0.10, 0.42, M.white, 0, 5.57, ZS - 0.66);
    S(parapetCap, 0.45, 0.53); balc.add(parapetCap);

    // --- ailes : murs + bandeaux
    [-1, 1].forEach((sx) => {
      const x = sx * XW;
      const wall = shadows(box(3.9, 7.7, 0.45, M.white, x, YB, ZW - 0.45), true, true);
      S(wall, 0.40, 0.52); upper.add(wall);
      // couronnement (lèvre saillante)
      S(box(3.94, 0.10, 0.52, M.white, x, 12.49, ZW - 0.48), 0.52, 0.58, 'rise');
      // bandeau crème
      S(box(3.9, 0.6, 0.04, M.cream, x, 11.09, ZW + 0.005), 0.50, 0.56, 'fade');
    });

    // --- pylônes extérieurs : fût + 3 ailerons à nez arrondi étagés
    function finMesh(w, hTop, hBase, depth, mat) {
      // aileron : rectangle + nez arrondi au sommet (profil élévation)
      const s = new THREE.Shape();
      const r = w / 2;
      s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0);
      s.lineTo(w / 2, hTop - hBase - r);
      s.absarc(0, hTop - hBase - r, r, 0, Math.PI, false);
      s.closePath();
      const g = geo(new THREE.ExtrudeGeometry(s, { depth: depth, steps: 1, bevelEnabled: false }));
      return new THREE.Mesh(g, mat);
    }
    [-1, 1].forEach((sx) => {
      const x = sx * XO;
      const py = new THREE.Group(); py.position.set(x, 0, 0); upper.add(py);
      const shaft = shadows(box(2.0, 8.0, 1.05, M.white, 0, YB, ZP - 1.05), true, true);
      S(shaft, 0.44, 0.56); py.add(shaft);
      // 3 ailerons : intérieur (haut) -> extérieur (bas)
      const fins = [
        { w: 0.78, top: 14.40, off: -0.18, d: 0.95 },
        { w: 0.60, top: 13.95, off: sx > 0 ? 0.42 : -0.42 + 0, d: 0.85 },
        { w: 0.52, top: 13.50, off: sx > 0 ? 0.78 : -0.78, d: 0.75 },
      ];
      // aileron intérieur décalé côté centre
      fins[0].off = sx > 0 ? -0.30 : 0.30;
      fins[1].off = sx > 0 ? 0.18 : -0.18;
      fins[2].off = sx > 0 ? 0.62 : -0.62;
      fins.forEach((f, fi) => {
        const fin = finMesh(f.w, f.top, YB + 8.0 - 1.2, f.d, M.white);
        fin.position.set(f.off, YB + 8.0 - 1.2, ZP - f.d);
        shadows(fin, true, false);
        S(fin, 0.52 + fi * 0.03, 0.62 + fi * 0.03);
        py.add(fin);
      });
      // rainures verticales (reveals) sur le fût
      [-0.45, 0.45].forEach((gx) => {
        const gr = box(0.06, 6.4, 0.02, M.whiteLowMat, gx, YB + 0.6, ZP + 0.002);
        S(gr, 0.56, 0.62, 'fade'); py.add(gr);
      });
    });

    // --- pylônes intérieurs : fût + aileron plat (les plus hauts, 15.30)
    [-1, 1].forEach((sx) => {
      const x = sx * XI;
      const py = new THREE.Group(); py.position.set(x, 0, 0); upper.add(py);
      const shaft = shadows(box(1.6, 8.55, 1.0, M.white, 0, YB, ZP - 1.0 - 0.05), true, true);
      S(shaft, 0.47, 0.59); py.add(shaft);
      // aileron plat sommital
      const fin = shadows(box(1.0, 1.9, 0.95, M.white, sx > 0 ? -0.24 : 0.24, 13.40, ZP - 0.93), true, false);
      S(fin, 0.58, 0.66); py.add(fin);
      // épaulement / redent côté aile
      const notch = box(0.55, 0.5, 0.8, M.white, sx > 0 ? 0.5 : -0.5, 13.40, ZP - 0.9);
      S(notch, 0.60, 0.66); py.add(notch);
      // rainure
      const gr = box(0.06, 7.0, 0.02, M.whiteLowMat, 0, YB + 0.5, ZP - 0.05 + 0.002);
      S(gr, 0.58, 0.64, 'fade'); py.add(gr);
    });

    // --- avant-corps central
    const central = new THREE.Group(); group.add(central);
    const cwall = shadows(box(4.26, 9.3, 0.75, M.white, 0, YB, ZC - 0.75), true, true);
    S(cwall, 0.50, 0.62); central.add(cwall);

    // architrave 3 ressauts (sous couronnement)
    const archi = new THREE.Group(); archi.position.set(0, 12.75, 0); central.add(archi);
    [[3.6, 0.30, ZC + 0.10], [3.42, 0.24, ZC + 0.02], [3.24, 0.20, ZC - 0.06]].forEach((a, i) => {
      const st = box(a[0], a[1], 0.34, M.white, 0, 0.55 - (i + 1) * a[1], a[2]);
      S(st, 0.575 + i * 0.015, 0.645 + i * 0.015, 'drop', { h: 1.4 });
      archi.add(st);
    });

    // couronnement « paquebot » : portique à coins arrondis
    const capShape = roundedRectShape(4.15, 1.15, 0.35);
    const capGeo = geo(new THREE.ExtrudeGeometry(capShape, { depth: 1.05, steps: 1, bevelEnabled: false }));
    const cap = new THREE.Mesh(capGeo, M.white);
    cap.position.set(0, 13.72, ZC + 0.75 - 1.05);
    shadows(cap, true, false);
    S(cap, 0.62, 0.70, 'drop', { h: 1.8 });
    central.add(cap);
    // casquette sommitale (petit débord)
    const capLip = box(4.3, 0.12, 1.2, M.white, 0, 14.82, ZC + 0.78 - 1.2);
    S(capLip, 0.66, 0.72, 'drop', { h: 1.2 });
    central.add(capLip);

    /* ------------------------------------------------------------
       Champs teal + panneau enseigne (montés phase B, peints phase C)
       ------------------------------------------------------------ */
    // champ crépi teal central (cadre)
    const tealField = box(4.23, 6.55, 0.14, M.teal, 0, 6.60, ZC - 0.14 + 0.01);
    tealField.receiveShadow = true;
    S(tealField, 0.56, 0.66, 'fade'); central.add(tealField);
    // panneau crème en retrait dans le cadre teal
    const creamPanel = box(3.60, 5.85, 0.10, M.cream, 0, 6.65, ZC - 0.05);
    creamPanel.receiveShadow = true;
    S(creamPanel, 0.58, 0.68, 'fade'); central.add(creamPanel);
    // haut du champ teal (bandeau au-dessus du panneau, sous architrave)
    const tealTop = box(4.23, 0.62, 0.14, M.teal, 0, 12.38, ZC - 0.14 + 0.01);
    S(tealTop, 0.56, 0.66, 'fade'); central.add(tealTop);
    // bandeau crème haut + cannelures
    const flutes = new THREE.Group(); flutes.position.set(0, 10.89, ZC + 0.02); central.add(flutes);
    const ribGeo = geo(new THREE.CylinderGeometry(0.055, 0.055, 0.78, 8, 1, false, 0, Math.PI));
    const ribs = new THREE.InstancedMesh(ribGeo, M.white, 16);
    const fluteBack = new THREE.Mesh(geo(new THREE.BoxGeometry(3.34, 0.8, 0.05)), M.cream);
    fluteBack.position.set(0, 0.4, -0.045);
    flutes.add(fluteBack);
    for (let i = 0; i < 16; i++) {
      const rx = -1.545 + i * 0.206;
      tmpM.compose(new THREE.Vector3(rx, 0.39, 0), tmpQ, new THREE.Vector3(1, 1, 1));
      ribs.setMatrixAt(i, tmpM);
    }
    flutes.add(ribs);
    S(flutes, 0.70, 0.76, 'pop');

    // corbeaux jumeaux (drop crane)
    function corbelMesh() {
      const s = new THREE.Shape();
      // profil élévation : drop en U à pied étagé
      s.moveTo(-0.21, 0); s.lineTo(0.21, 0);
      s.lineTo(0.21, -1.75); s.lineTo(0.30, -1.85); s.lineTo(0.30, -2.05);
      s.lineTo(-0.30, -2.05); s.lineTo(-0.30, -1.85); s.lineTo(-0.21, -1.75);
      s.closePath();
      const g = geo(new THREE.ExtrudeGeometry(s, { depth: 0.40, steps: 1, bevelEnabled: false }));
      return new THREE.Mesh(g, M.white);
    }
    [-1.05, 1.05].forEach((cx, i) => {
      const cb = corbelMesh();
      cb.position.set(cx, 13.10, ZC + 0.42 - 0.40);
      shadows(cb, true, false);
      S(cb, 0.71 + i * 0.03, 0.78 + i * 0.03, 'drop', { h: 1.6 });
      central.add(cb);
    });

    /* ------------------------------------------------------------
       Ailes — champs teal + baies vitrées en accordéon
       ------------------------------------------------------------ */
    let capGeoS = null, cillGeoS = null, postGeoS = null;
    [-1, 1].forEach((sx, wi) => {
      const wgroup = new THREE.Group(); wgroup.position.set(sx * XW, 0, 0); group.add(wgroup);
      const capSlots = [], cillSlots = [], postSlots = [];
      const FW = 3.3, mod = FW / 3;
      const yCill = 5.95, yJamb = 10.55, yProw = 10.92, yFieldTop = 11.05, yFieldBot = 5.72;
      const zBack = ZW - 0.12, zProw = ZW + 0.30;

      // fond teal derrière les vitrages
      const back = box(FW, yFieldTop - yFieldBot, 0.06, M.teal, 0, yFieldBot, zBack - 0.06);
      S(back, 0.52, 0.62, 'fade'); wgroup.add(back);

      // cadre frontal teal : rect extérieur - ouverture zigzag (chevrons)
      const frame = new THREE.Shape();
      frame.moveTo(-FW / 2, yFieldBot); frame.lineTo(FW / 2, yFieldBot);
      frame.lineTo(FW / 2, yFieldTop); frame.lineTo(-FW / 2, yFieldTop);
      frame.closePath();
      const holePath = new THREE.Path();
      holePath.moveTo(-FW / 2 + 0.06, yCill);
      holePath.lineTo(FW / 2 - 0.06, yCill);
      holePath.lineTo(FW / 2 - 0.06, yJamb);
      for (let f = 2; f >= 0; f--) {
        const xj0 = -FW / 2 + f * mod, xp = xj0 + mod / 2, xj1 = xj0 + mod;
        if (f === 2) holePath.lineTo(xj1 - 0.06, yJamb);
        else holePath.lineTo(xj1, yJamb);
        holePath.lineTo(xp, yProw);
        if (f === 0) holePath.lineTo(xj0 + 0.06, yJamb);
        else holePath.lineTo(xj0, yJamb);
      }
      holePath.closePath();
      frame.holes.push(holePath);
      const frameMesh = extrudeMesh(frame, 0.10, M.teal);
      frameMesh.position.set(0, 0, ZW - 0.04);
      S(frameMesh, 0.54, 0.64, 'fade');
      wgroup.add(frameMesh);

      // plis : 2 faces vitrées par module + capots teal inclinés + poteaux
      for (let f = 0; f < 3; f++) {
        const xj0 = -FW / 2 + f * mod, xp = xj0 + mod / 2, xj1 = xj0 + mod;
        // face gauche = tex A (ambre côté proue), face droite = tex B (ambre col 0)
        // face gauche (jamb -> prow) et droite (prow -> jamb)
        [[xj0, zBack + 0.04, xp, zProw, yJamb, yProw, M.glassA], [xp, zProw, xj1, zBack + 0.04, yProw, yJamb, M.glassB]].forEach((q) => {
          const gg = new THREE.BufferGeometry();
          const x0 = q[0], z0 = q[1], x1 = q[2], z1 = q[3], yT0 = q[4], yT1 = q[5];
          const v = new Float32Array([
            x0, yCill, z0, x1, yCill, z1, x1, yT1, z1,
            x0, yCill, z0, x1, yT1, z1, x0, yT0, z0,
          ]);
          const uv = new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]);
          gg.setAttribute('position', new THREE.BufferAttribute(v, 3));
          gg.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
          gg.computeVertexNormals();
          geo(gg);
          const glass = new THREE.Mesh(gg, q[6]);
          S(glass, 0.56 + f * 0.02, 0.66 + f * 0.02, 'fade');
          wgroup.add(glass);
          // capots + appuis : transforms collectés, instanciés par aile
          const len = Math.hypot(x1 - x0, z1 - z0);
          capSlots.push([(x0 + x1) / 2, (yT0 + yT1) / 2 - 0.02, (z0 + z1) / 2,
            -Math.atan2(z1 - z0, x1 - x0), Math.atan2(yT1 - yT0, len)]);
          cillSlots.push([(x0 + x1) / 2, yCill - 0.12, (z0 + z1) / 2,
            -Math.atan2(z1 - z0, x1 - x0), 0]);
        });
        // poteaux teal aux arêtes (jambages + proue)
        [[xj0, zBack + 0.03], [xp, zProw - 0.02], [f === 2 ? xj1 : null, zBack + 0.03]].forEach((pp) => {
          if (pp[0] === null) return;
          postSlots.push([pp[0], yCill - 0.15, pp[1]]);
        });
      }
      // instancie capots / appuis / poteaux de l'aile (3 draw calls au lieu de 31)
      const foldLen = Math.hypot(mod / 2, zProw - zBack - 0.04) + 0.06;
      const capGeoW = capGeoS || (capGeoS = geo(new THREE.BoxGeometry(foldLen, 0.09, 0.12)));
      const cillGeoW = cillGeoS || (cillGeoS = geo(new THREE.BoxGeometry(foldLen, 0.12, 0.16)));
      const postGeoW = postGeoS || (postGeoS = (() => { const g = geo(new THREE.BoxGeometry(0.07, yJamb - yCill + 0.5, 0.07)); g.translate(0, (yJamb - yCill + 0.5) / 2, 0); return g; })());
      const eul = new THREE.Euler();
      const mk = (slots, g, mat) => {
        const im = new THREE.InstancedMesh(g, mat, slots.length);
        slots.forEach((sl, i) => {
          eul.set(0, sl[3] || 0, sl[4] || 0, 'YXZ');
          tmpQ.setFromEuler(eul);
          tmpM.compose(new THREE.Vector3(sl[0], sl[1], sl[2]), tmpQ, new THREE.Vector3(1, 1, 1));
          im.setMatrixAt(i, tmpM);
        });
        tmpQ.identity();
        const gr = new THREE.Group(); gr.add(im); wgroup.add(gr);
        return gr;
      };
      S(mk(capSlots, capGeoW, M.teal), 0.60, 0.70, 'fade');
      S(mk(cillSlots, cillGeoW, M.teal), 0.55, 0.66, 'fade');
      S(mk(postSlots, postGeoW, M.teal), 0.56, 0.67, 'fade');
      // cannelures d'aile (bandeau au-dessus des chevrons)
      const wflutes = new THREE.Group();
      wflutes.position.set(0, yFieldTop + 0.06, ZW + 0.01);
      const wfluteBack = new THREE.Mesh(geo(new THREE.BoxGeometry(3.32, 0.5, 0.05)), M.cream);
      wfluteBack.position.set(0, 0.26, -0.04);
      wflutes.add(wfluteBack);
      const wribs = new THREE.InstancedMesh(ribGeo, M.white, 16);
      for (let i = 0; i < 16; i++) {
        const rx = -1.545 + i * 0.206;
        tmpM.compose(new THREE.Vector3(rx, 0.27, 0), tmpQ, new THREE.Vector3(1, 0.62, 1));
        wribs.setMatrixAt(i, tmpM);
      }
      wflutes.add(wribs);
      S(wflutes, 0.72 + wi * 0.02, 0.78 + wi * 0.02, 'pop');
      wgroup.add(wflutes);
    });

    /* ------------------------------------------------------------
       PHASE C — SIGNS & LUMIÈRE (0.68 → 1.0)
       ------------------------------------------------------------ */
    // --- lettres NORMANDY (Shapes rectilignes condensées, extrudées)
    const rect = (x, y, w, h) => { const s = new THREE.Shape(); s.moveTo(x, y); s.lineTo(x + w, y); s.lineTo(x + w, y + h); s.lineTo(x, y + h); s.closePath(); return s; };
    const quad = (p) => { const s = new THREE.Shape(); s.moveTo(p[0][0], p[0][1]); for (let i = 1; i < p.length; i++) s.lineTo(p[i][0], p[i][1]); s.closePath(); return s; };
    // chaque lettre : boîte em [0..LW]x[0..H], traits épaisseur ST
    // Formes relevées au pixel sur la photo de façade (analyse colorimétrique du
    // panneau : 8 lettres, pas 86,6 px, hauteur 604 px, graisse 25 px).
    // Particularités Art Déco du Normandy : diagonale du N confinée au tiers
    // supérieur, V du M suspendu au bandeau haut, R à bol géant (85 %),
    // Y sans jambage gauche, D à flanc droit oblique.
    function letterShapes(ch, LW, H, ST) {
      const s = [];
      const W = LW, hw = LW / 2;
      const path = (pts) => new THREE.Path(pts.map((p) => new THREE.Vector2(p[0], p[1])));
      const ring = (outer, inner) => { const o = quad(outer); o.holes.push(path(inner)); return o; };
      switch (ch) {
        case 'N':
          s.push(rect(0, 0, ST, H), rect(W - ST, 0, ST, H));
          // diagonale : du haut du fût gauche au fût droit dès 35 % de hauteur
          s.push(quad([[ST, H], [W - ST, H * 0.845], [W - ST, H * 0.655], [ST, H * 0.80]]));
          break;
        case 'O':
          s.push(ring(
            [[W * 0.1, 0], [W * 0.9, 0], [W, H * 0.035], [W, H * 0.965], [W * 0.9, H],
             [W * 0.1, H], [0, H * 0.965], [0, H * 0.035]],
            [[ST, ST], [W - ST, ST], [W - ST, H - ST], [ST, H - ST]]
          ));
          break;
        case 'R':
          s.push(rect(0, 0, ST, H));                        // fût
          s.push(rect(0, H - ST, W, ST));                   // barre haute
          s.push(rect(W - ST, H * 0.15, ST, H * 0.85 - ST));// flanc droit du bol
          s.push(rect(0, H * 0.15, W, ST));                 // fermeture du bol (85 %)
          s.push(quad([[W * 0.50, H * 0.20], [W * 0.78, H * 0.20], [W, 0], [W * 0.70, 0]])); // jambe
          break;
        case 'M':
          s.push(rect(0, 0, ST, H), rect(W - ST, 0, ST, H));
          // V suspendu : pointe intérieure à 13 %, pointe extérieure à 33 %
          s.push(quad([[ST, H], [hw, H * 0.87], [hw, H * 0.67], [ST, H * 0.76]]));
          s.push(quad([[W - ST, H], [hw, H * 0.87], [hw, H * 0.67], [W - ST, H * 0.76]]));
          break;
        case 'A': {
          const o = quad([[0, 0], [W, 0], [W * 0.66, H], [W * 0.34, H]]);
          o.holes.push(path([[hw, H * 0.62], [W * 0.655, H * 0.19], [W * 0.345, H * 0.19]]));
          o.holes.push(path([[W * 0.29, 0], [W * 0.71, 0], [W * 0.655, H * 0.16], [W * 0.345, H * 0.16]]));
          s.push(o);
          break;
        }
        case 'D':
          s.push(ring(
            [[0, 0], [W * 0.955, 0], [W * 0.71, H * 0.93], [W * 0.56, H], [0, H]],
            [[ST, ST], [W * 0.665, ST], [W * 0.42, H - ST], [ST, H - ST]]
          ));
          break;
        case 'Y':
          s.push(rect(W - ST, 0, ST, H));                   // fût droit pleine hauteur
          s.push(quad([[0, H], [ST * 1.15, H], [W - ST, H * 0.66], [W - ST, H * 0.80]]));
          break;
      }
      return s;
    }
    const signGroup = new THREE.Group();
    signGroup.position.set(0, 0, ZC + 0.005);
    central.add(signGroup);
    const WORD = 'NORMANDY';
    const L_W = 0.387, L_ST = 0.137, Y_TOP = 10.36, L_H = 2.96;
    // approches relevées lettre à lettre sur la photo (crénage optique du panneau :
    // le DY final est serré, le Y se glisse sous le flanc oblique du D)
    const L_X = [0, 0.466, 0.922, 1.388, 1.820, 2.256, 2.713, 3.012];
    const L_SPAN = L_X[7] + L_W; // 3,399 m — panneau crème 3,60 m
    const letterMeshes = [];
    for (let i = 0; i < WORD.length; i++) {
      const LH = L_H; // hauteur uniforme — relevé photo : toutes les lettres alignées
      const shapes = letterShapes(WORD[i], L_W, LH, L_ST);
      const g = geo(new THREE.ExtrudeGeometry(shapes, { depth: 0.06, steps: 1, bevelEnabled: false }));
      const mesh = new THREE.Mesh(g, M.signGreen);
      mesh.position.set(-L_SPAN / 2 + L_X[i], Y_TOP - LH, 0);
      letterMeshes.push(mesh);
      signGroup.add(mesh);
      S(mesh, 0.74 + i * 0.016, 0.815 + i * 0.016, 'pop');
    }
    // barres crimson
    const bar1 = box(3.16, 0.16, 0.05, M.signRed, 0, 7.02, ZC + 0.005);
    const bar2 = box(3.32, 0.22, 0.05, M.signRed, 0, 6.66, ZC + 0.005);
    S(bar1, 0.855, 0.895, 'riseX'); S(bar2, 0.875, 0.915, 'riseX');
    central.add(bar1, bar2);

    // --- garde-corps : lisses + montants + triolets de cercles
    const rail = new THREE.Group(); rail.position.set(0, 5.05, ZS - 0.30); balc.add(rail);
    const railMat = track(new THREE.MeshStandardMaterial({ color: COL.metalGreen, roughness: 0.45, metalness: 0.3 }));
    [0.5, 0.13].forEach((ry) => {
      const lg = geo(new THREE.CylinderGeometry(0.022, 0.022, 18.8, 6));
      lg.rotateZ(Math.PI / 2);
      const lis = new THREE.Mesh(lg, railMat);
      lis.position.set(0, ry, 0);
      S(lis, 0.75, 0.83, 'riseX');
      rail.add(lis);
    });
    const postGeo = geo(new THREE.CylinderGeometry(0.02, 0.02, 0.52, 6));
    const posts = new THREE.InstancedMesh(postGeo, railMat, 14);
    for (let i = 0; i < 14; i++) {
      tmpM.compose(new THREE.Vector3(-9.1 + i * 1.4, 0.26, 0), tmpQ, new THREE.Vector3(1, 1, 1));
      posts.setMatrixAt(i, tmpM);
    }
    const postsG = new THREE.Group(); postsG.add(posts); rail.add(postsG);
    S(postsG, 0.76, 0.84, 'pop');
    const circGeo = geo(new THREE.TorusGeometry(0.115, 0.018, 6, 20));
    const circles = new THREE.InstancedMesh(circGeo, railMat, 24);
    let ci = 0;
    for (let t = 0; t < 8; t++) {
      const cx = -8.05 + t * 2.3;
      for (let k = 0; k < 3; k++) {
        tmpM.compose(new THREE.Vector3(cx + (k - 1) * 0.19, 0.315, 0), tmpQ, new THREE.Vector3(1, 1, 1));
        circles.setMatrixAt(ci++, tmpM);
      }
    }
    const circlesG = new THREE.Group(); circlesG.add(circles); rail.add(circlesG);
    S(circlesG, 0.78, 0.87, 'pop');

    // --- spots noirs sur le parapet (allumés en fin de course)
    const spotBoxGeo = geo(new THREE.BoxGeometry(0.26, 0.14, 0.20));
    const spotsIM = new THREE.InstancedMesh(spotBoxGeo, M.metalDark, 6);
    [-2.9, -1.7, -0.55, 0.55, 1.7, 2.9].forEach((sxp, i) => {
      tmpM.compose(new THREE.Vector3(sxp, 5.92, ZS - 0.75), tmpQ, new THREE.Vector3(1, 1, 1));
      spotsIM.setMatrixAt(i, tmpM);
    });
    const spotsG = new THREE.Group(); spotsG.add(spotsIM); balc.add(spotsG);
    S(spotsG, 0.80, 0.86, 'pop');

    // --- parvis : trottoir, potelets laiton, cordons rouges
    const parvis = new THREE.Group(); group.add(parvis);
    // dalle béton clair : le parvis est un ouvrage Surfabéton, pas un tapis rouge —
    // ton froid légèrement plus clair que le bitume, pour le lire comme un ouvrage
    const sidewalkMat = track(new THREE.MeshStandardMaterial({ color: 0xA8AAA8, roughness: 0.7 }));
    const sidewalk = new THREE.Mesh(geo(new THREE.PlaneGeometry(21, 3.6)), sidewalkMat);
    sidewalk.rotation.x = -Math.PI / 2;
    sidewalk.position.set(0, 0.012, 2.7);
    sidewalk.receiveShadow = true;
    S(sidewalk, 0.06, 0.12, 'fade');
    parvis.add(sidewalk);

    const bollardPts = [];
    const bp = new THREE.Shape ? null : null;
    const bollardProfile = [];
    [[0.16, 0], [0.16, 0.05], [0.055, 0.09], [0.045, 0.62], [0.075, 0.68], [0.03, 0.72], [0.062, 0.78], [0.062, 0.80], [0.0, 0.88]].forEach((p) => bollardPts.push(new THREE.Vector2(p[0], p[1])));
    const bollGeo = geo(new THREE.LatheGeometry(bollardPts, 14));
    const bolls = new THREE.InstancedMesh(bollGeo, M.brass, 10);
    for (let i = 0; i < 10; i++) {
      tmpM.compose(new THREE.Vector3(-8.55 + i * 1.9, 0.02, 3.6), tmpQ, new THREE.Vector3(1, 1, 1));
      bolls.setMatrixAt(i, tmpM);
    }
    const bollsG = new THREE.Group(); bollsG.add(bolls); parvis.add(bollsG);
    S(bollsG, 0.88, 0.95, 'pop');
    // sphère sommitale (instanced aussi)
    const knobGeo = geo(new THREE.SphereGeometry(0.062, 12, 10));
    const knobs = new THREE.InstancedMesh(knobGeo, M.brass, 10);
    for (let i = 0; i < 10; i++) {
      tmpM.compose(new THREE.Vector3(-8.55 + i * 1.9, 0.90, 3.6), tmpQ, new THREE.Vector3(1, 1, 1));
      knobs.setMatrixAt(i, tmpM);
    }
    bollsG.add(knobs);
    // cordon : tube sur courbe en chaînette (une géométrie, 9 instances)
    const sag = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.86, 0.78, 0),
      new THREE.Vector3(0, 0.56, 0.02),
      new THREE.Vector3(0.86, 0.78, 0),
    ]);
    const ropeGeo = geo(new THREE.TubeGeometry(sag, 16, 0.028, 6, false));
    const ropes = new THREE.InstancedMesh(ropeGeo, M.rope, 9);
    for (let i = 0; i < 9; i++) {
      tmpM.compose(new THREE.Vector3(-8.55 + 0.95 + i * 1.9, 0.02, 3.6), tmpQ, new THREE.Vector3(1, 1, 1));
      ropes.setMatrixAt(i, tmpM);
    }
    const ropesG = new THREE.Group(); ropesG.add(ropes); parvis.add(ropesG);
    S(ropesG, 0.93, 0.985, 'fadepop');
    ropesG.scale.set(0.0001, 0.0001, 0.0001);

    /* ------------------------------------------------------------
       LUMIÈRES INTÉGRÉES AU MODÈLE (phase C)
       ------------------------------------------------------------ */
    const lights = new THREE.Group(); group.add(lights);
    // 2 projecteurs d'enseigne
    const spotL = new THREE.SpotLight(0xFFE2B0, 0.0, 18, 0.5, 0.55, 1.2);
    spotL.position.set(-1.6, 6.05, ZS - 0.6);
    const spotTargetL = new THREE.Object3D(); spotTargetL.position.set(-0.8, 9.6, ZC);
    lights.add(spotTargetL); spotL.target = spotTargetL;
    const spotR = spotL.clone();
    spotR.position.set(1.6, 6.05, ZS - 0.6);
    const spotTargetR = new THREE.Object3D(); spotTargetR.position.set(0.8, 9.6, ZC);
    lights.add(spotTargetR); spotR.target = spotTargetR;
    lights.add(spotL, spotR);
    // lueur du foyer derrière les vitrines
    const foyerLight = new THREE.PointLight(0xE8A050, 0.0, 14, 2.0);
    foyerLight.position.set(0, 1.8, ZGF - 1.2);
    lights.add(foyerLight);
    // appoint loggia : déboucher l'ombre sous le débord. Décroissance quasi plate —
    // avec un decay physique, la lampe imprimait une flaque ronde sur le fond sombre.
    const loggiaFill = new THREE.PointLight(0xF2E4C8, 0.22, 70, 0.32);
    loggiaFill.position.set(0, 3.4, 5.2);
    lights.add(loggiaFill);

    /* ------------------------------------------------------------
       RUNTIME sculpt (action-ready) + build(u)
       ------------------------------------------------------------ */
    group.userData.sculptRuntime = {
      nodes: { gf: gf, upper: upper, balcony: balc, central: central, parvis: parvis, lights: lights },
      sockets: {
        signAnchor: { position: [0, 8.6, ZC], note: 'centre enseigne' },
        marquee: { position: [0, 4.4, ZS], note: 'nez de dalle balcon' },
      },
      colliders: [
        { type: 'box', min: [-9.8, 0, -15.6], max: [9.8, 15.3, 1.4] },
      ],
      destructionGroups: { facade: ['upper', 'central', 'balcony'], body: ['gf'], parvis: ['parvis'] },
    };

    let lastU = -1;
    function build(u) {
      u = Math.max(0, Math.min(1, u));
      if (Math.abs(u - lastU) < 0.0004 && lastU >= 0) return false;
      lastU = u;
      for (let i = 0; i < stages.length; i++) {
        const st = stages[i];
        const t = (u - st.t0) / (st.t1 - st.t0);
        const n = st.node;
        switch (st.kind) {
          case 'rise': {
            const e = easeOut(t);
            n.scale.y = Math.max(0.0001, e);
            n.visible = e > 0.002;
            break;
          }
          case 'riseX': {
            const e = easeOut(t);
            n.scale.x = Math.max(0.0001, e);
            n.visible = e > 0.002;
            break;
          }
          case 'pop': {
            const e = t <= 0 ? 0 : (t >= 1 ? 1 : easeBack(t));
            const s = Math.max(0.0001, e);
            n.scale.set(s, s, s);
            n.visible = t > 0;
            break;
          }
          case 'fadepop': {
            const e = t <= 0 ? 0 : (t >= 1 ? 1 : easeBack(t));
            const s = Math.max(0.0001, e);
            n.scale.set(s, s, s);
            n.visible = t > 0;
            break;
          }
          case 'drop': {
            if (t <= 0) { n.visible = false; break; }
            n.visible = true;
            const e = easeOut(t);
            n.position.y = n.userData.dropY + (1 - e) * (st.extra.h || 2);
            break;
          }
          case 'fade': {
            const e = easeOut(t);
            n.visible = e > 0.01;
            n.traverse((o) => {
              if (o.isMesh && o.material && o.material.transparent !== undefined) {
                if (!o.userData._fadeMax) {
                  o.userData._fadeMax = (o.material === M.glassDark) ? 0.92
                    : (o.material === M.foyer) ? 0.9 : 1.0;
                  if (o.material !== M.glassA && o.material !== M.glassB && o.material !== M.glassDark && o.material !== M.foyer) {
                    // matériaux opaques : on anime l'échelle plutôt que l'alpha
                    o.userData._fadeScale = true;
                  }
                }
                if (o.userData._fadeScale) return;
                o.material.opacity = Math.max(o.material.opacity, e * o.userData._fadeMax);
              }
            });
            if (n.isMesh && n.userData._fadeScale) {
              n.scale.setScalar(Math.max(0.0001, easeOut(t)));
            } else if (!n.isMesh) {
              n.scale.setScalar(Math.max(0.0001, easeOut(t)));
            }
            break;
          }
          case 'poster': {
            const e = easeOut(t);
            n.visible = e > 0.02;
            if (n.userData.posterMat) n.userData.posterMat.opacity = e * 0.96;
            break;
          }
        }
      }
      // peinture phase C
      for (let i = 0; i < paints.length; i++) {
        const p = paints[i];
        const t = easeOut((u - p.t0) / (p.t1 - p.t0));
        p.m.color.lerpColors(p.from, p.to, t);
      }
      // verre : montée émissive ambre + reflets
      const glow = easeOut((u - 0.84) / 0.12);
      M.glassA.emissive.setHex(0x2A1F0C).multiplyScalar(glow * 1.15);
      M.glassB.emissive.setHex(0x2A1F0C).multiplyScalar(glow * 1.15);
      M.glassDark.emissive = M.glassDark.emissive || new THREE.Color(0);
      M.glassDark.emissive.setHex(0x1A130A).multiplyScalar(glow);
      M.foyer.opacity = Math.min(0.92, M.foyer.opacity < 0.01 && u < 0.30 ? 0 : 0.25 + glow * 0.75);
      // lumières
      spotL.intensity = spotR.intensity = glow * 6.5;
      foyerLight.intensity = easeOut((u - 0.30) / 0.2) * 0.35 + glow * 1.5;
      return true;
    }

    function dispose() {
      G.forEach((g) => g && g.dispose && g.dispose());
      disposables.forEach((d) => d && d.dispose && d.dispose());
    }

    return { group: group, build: build, lights: lights, dispose: dispose };
  }


  /* =====================================================================
     CIEL & LEVER DE SOLEIL — rig lumière photoréaliste de la section
     createSky(THREE, scene, opts) -> { group, update(u, camera), dispose }
     Aube chaude -> matin bleu accueillant ; le soleil émerge derrière le
     théâtre (occlusion réelle) et monte au coin haut-gauche du cadre.
     ===================================================================== */
  /* ==================================================================
     CIEL v5 — aube déjà en place (jamais de noir), le bleu se forme
     avec la montée du soleil, nuages en dômes + billboards duveteux.
     ================================================================== */
  function createSky(THREE, scene, opts) {
    opts = opts || {};
    const g = new THREE.Group();
    g.name = 'sb-sky';
    const disposables = [];
    const keep = (x) => { disposables.push(x); return x; };

    const gradTex = (stops) => {
      const c = canvas(16, 512);
      const ctx = c.getContext('2d');
      const gr = ctx.createLinearGradient(0, 0, 0, 512);
      stops.forEach((s) => gr.addColorStop(s[0], s[1]));
      ctx.fillStyle = gr; ctx.fillRect(0, 0, 16, 512);
      const t = keep(new THREE.CanvasTexture(c));
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    };
    // plein jour : bleu franc -> horizon laiteux chaud (vibe maquette ensoleillée)
    const dayTex = gradTex([[0, '#2F74BE'], [0.30, '#5C9CD8'], [0.55, '#9CC8EA'],
      [0.72, '#D8E8F2'], [0.82, '#F0E6D2'], [0.90, '#E8D2AE'], [1, '#A6957E']]);

    // cumulus du fond de ciel (couche dôme)
    const cloudTex = (() => {
      const W = 1024, H = 512;
      const c = canvas(W, H);
      const ctx = c.getContext('2d');
      let s = 20260725;
      const rnd = () => (s = (s * 16807 + 17) % 2147483647) / 2147483647;
      const puff = (px, py, pr, top) => {
        const gr = ctx.createRadialGradient(px, py - pr * 0.3, pr * 0.08, px, py, pr);
        gr.addColorStop(0, 'rgba(255,255,255,' + top + ')');
        gr.addColorStop(0.5, 'rgba(246,248,251,' + top * 0.72 + ')');
        gr.addColorStop(1, 'rgba(226,232,240,0)');
        ctx.fillStyle = gr;
        for (const ox of [0, -W, W]) { ctx.beginPath(); ctx.arc(px + ox, py, pr, 0, 6.2832); ctx.fill(); }
      };
      for (let i = 0; i < 22; i++) {
        const cx = rnd() * W;
        const cy = 62 + Math.pow(rnd(), 1.4) * 250;
        const near = 1 - (cy - 62) / 280;
        const bw = (90 + rnd() * 150) * (0.4 + near * 0.85);
        const bh = bw * (0.26 + rnd() * 0.14);
        const n = 5 + ((rnd() * 6) | 0);
        for (let p = 0; p < n; p++) {
          const t = p / (n - 1);
          const px = cx + (t - 0.5) * bw + (rnd() - 0.5) * bw * 0.22;
          const bulge = Math.sin(t * Math.PI);
          const py = cy - bulge * bh * 0.42 + (rnd() - 0.5) * bh * 0.25;
          puff(px, py, bh * (0.55 + bulge * 0.75 + rnd() * 0.25), 0.42 + near * 0.24);
        }
      }
      const t = keep(new THREE.CanvasTexture(c));
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    })();

    const domeGeo = keep(new THREE.SphereGeometry(96, 40, 24));
    const mkDome = (tex, op, order) => {
      const m = keep(new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, fog: false,
        depthWrite: false, transparent: op < 1, opacity: op }));
      const mesh = new THREE.Mesh(domeGeo, m);
      mesh.renderOrder = order;
      g.add(mesh);
      return mesh;
    };
    // Le ciel de jour est POSÉ dès u=0 : la section ouvre sur le chantier, pas sur
    // un lever de soleil (le disque solaire lisait « gros flou orange » plein cadre).
    const day = mkDome(dayTex, 1, -12);
    const clouds = mkDome(cloudTex, 0.35, -10);

    // nuages duveteux 3D (billboards, vibe maquette de la référence)
    const puffTex = (() => {
      const c = canvas(256, 128);
      const ctx = c.getContext('2d');
      let s = 4242;
      const rnd = () => (s = (s * 48271 + 7) % 2147483647) / 2147483647;
      const ball = (x, y, r, a) => {
        const gr = ctx.createRadialGradient(x, y - r * 0.34, r * 0.1, x, y, r);
        gr.addColorStop(0, 'rgba(255,255,255,' + a + ')');
        gr.addColorStop(0.62, 'rgba(243,244,247,' + a * 0.8 + ')');
        gr.addColorStop(1, 'rgba(222,228,238,0)');
        ctx.fillStyle = gr;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
      };
      for (let i = 0; i < 9; i++) {
        const t = i / 8;
        const x = 34 + t * 188 + (rnd() - 0.5) * 18;
        const bulge = Math.sin(t * Math.PI);
        ball(x, 84 - bulge * 26 + (rnd() - 0.5) * 8, 20 + bulge * 22 + rnd() * 8, 0.85);
      }
      const t2 = keep(new THREE.CanvasTexture(c));
      t2.colorSpace = THREE.SRGBColorSpace;
      return t2;
    })();
    const puffGeo = keep(new THREE.PlaneGeometry(18, 9));
    const puffs = [];
    const PUFF_POS = opts.isMobile
      ? [[-30, 17, -44], [26, 21, -50]]
      : [[-32, 16, -44], [24, 20, -52], [-10, 23, -60], [38, 14, -34], [8, 18, -48]];
    PUFF_POS.forEach((p, i) => {
      const m = keep(new THREE.MeshBasicMaterial({ map: puffTex, transparent: true, opacity: 0.0,
        fog: false, depthWrite: false }));
      const mesh = new THREE.Mesh(puffGeo, m);
      mesh.position.set(p[0], p[1], p[2]);
      mesh.scale.setScalar(0.8 + (i % 3) * 0.35);
      mesh.renderOrder = -8;
      mesh.userData.phase = i * 1.7;
      g.add(mesh); puffs.push(mesh);
    });

    // Pas de disque solaire : la lumière vient du rig, jamais d'un billboard dans le cadre.
    const hemi = new THREE.HemisphereLight(0xDCE4EC, 0x8B8272, 0.66);
    const sunL = new THREE.DirectionalLight(0xFFE8CC, 0.9);
    sunL.castShadow = true;
    const ms = opts.isMobile ? 1024 : 2048;
    sunL.shadow.mapSize.set(ms, ms);
    sunL.shadow.camera.left = -24; sunL.shadow.camera.right = 24;
    sunL.shadow.camera.top = 26; sunL.shadow.camera.bottom = -4;
    sunL.shadow.camera.near = 4; sunL.shadow.camera.far = 110;
    sunL.shadow.bias = -0.0005;
    sunL.shadow.normalBias = 0.035;
    const fill = new THREE.DirectionalLight(0xFFF2E2, 0.3);
    fill.position.set(16, 11, 30);
    g.add(hemi, sunL, sunL.target, fill);

    scene.fog = new THREE.Fog(0xE4E4DC, 46, 124);

    const C = (h) => new THREE.Color(h);
    const cFog = [C(0xE4E4DC), C(0xDCE8E8)];
    const cHemiSky = [C(0xDCE4EC), C(0xCFE2F2)];
    const cHemiGnd = [C(0x8B8272), C(0x9A9082)];
    const cSun = [C(0xFFE0B4), C(0xFFF2DE)];
    const cCloud = [C(0xF2EDE4), C(0xFFFFFF)];

    function update(u, camera, timeMs) {
      const t = Math.max(0, Math.min(1, u));
      const sec = (timeMs || 0) / 1000;
      const e = 1 - Math.pow(1 - t, 2);
      // La lumière ne « se lève » pas : elle est déjà installée et se dégage un peu
      // pendant le chantier (rise part de 0,45, jamais d'un rasant de lever de soleil).
      const rise = 0.45 + 0.55 * Math.pow(t, 1.2);
      clouds.material.opacity = 0.26 + 0.34 * e;
      clouds.material.color.lerpColors(cCloud[0], cCloud[1], e);
      // billboards duveteux : dérive lente + face caméra
      puffs.forEach((p) => {
        p.position.x += Math.sin(sec * 0.11 + p.userData.phase) * 0.004;
        if (camera) p.quaternion.copy(camera.quaternion);
        p.material.opacity = 0.42 + 0.5 * e;
        p.material.color.lerpColors(cCloud[0], cCloud[1], Math.min(1, e * 1.3));
      });
      // clé avant-gauche découplée du disque (le disque est au fond)
      sunL.position.set(-30 + 7 * rise, 5.5 + 21 * rise, 31 - 5 * rise);
      sunL.target.position.set(0, 6, 0);
      sunL.intensity = 0.86 + 0.34 * e;
      sunL.color.lerpColors(cSun[0], cSun[1], e);
      hemi.intensity = 0.64 + 0.14 * e;
      hemi.color.lerpColors(cHemiSky[0], cHemiSky[1], e);
      hemi.groundColor.lerpColors(cHemiGnd[0], cHemiGnd[1], e);
      fill.intensity = 0.26 + 0.14 * e;
      if (scene.fog) scene.fog.color.lerpColors(cFog[0], cFog[1], e);
    }

    function dispose() { disposables.forEach((d) => d && d.dispose && d.dispose()); }

    return { group: g, update: update, dispose: dispose };
  }

  /* ==================================================================
     SOL v6 — terrain de chantier sobre : un seul disque de terre battue,
     posé dès la première image (pas d'éclosion, pas de route, pas de
     pelouse), horizon fondu + particules de lumière en suspension.
     ================================================================== */
  function createGround(THREE, opts) {
    opts = opts || {};
    const g = new THREE.Group();
    g.name = 'sb-ground';
    const disposables = [];
    const keep = (x) => { disposables.push(x); return x; };

    // --- textures procédurales
    const noiseTex = (base, chips, count, sz) => {
      const c = canvas(sz, sz);
      const ctx = c.getContext('2d');
      let s = 90210;
      const rnd = () => (s = (s * 48271 + 11) % 2147483647) / 2147483647;
      ctx.fillStyle = base; ctx.fillRect(0, 0, sz, sz);
      for (let i = 0; i < count; i++) {
        ctx.fillStyle = chips[(rnd() * chips.length) | 0];
        ctx.globalAlpha = 0.1 + rnd() * 0.35;
        const r = 0.6 + rnd() * 2.2;
        ctx.beginPath(); ctx.arc(rnd() * sz, rnd() * sz, r, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
      const t = keep(new THREE.CanvasTexture(c));
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      return t;
    };

    // sol urbain gris : bitume/béton de voirie (chips froids, plus de terre chaude)
    const dirtTex = noiseTex('#84868A', ['#9B9DA1', '#5E6064', '#74767A', '#8D8F92'], 5200, 256);
    dirtTex.repeat.set(26, 26);
    // --- disque de sol : nappe de bitume gris jusqu'à l'horizon
    const R = 96;
    const discGeo = keep(new THREE.CircleGeometry(R, 72));
    const discMat = keep(new THREE.MeshStandardMaterial({ color: 0x84868A, map: dirtTex, roughness: 0.82 }));
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 0.004;
    disc.receiveShadow = true;
    g.add(disc);

    // --- voile d'horizon : fond la jonction sol/ciel (plus de ligne dure)
    const hazeTex = (() => {
      const c = canvas(8, 256);
      const ctx = c.getContext('2d');
      const gr = ctx.createLinearGradient(0, 0, 0, 256);
      gr.addColorStop(0, 'rgba(206,210,214,0)');
      gr.addColorStop(0.55, 'rgba(202,206,210,0.5)');
      gr.addColorStop(0.85, 'rgba(198,202,206,0.9)');
      gr.addColorStop(1, 'rgba(196,200,204,0.95)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, 8, 256);
      const t = keep(new THREE.CanvasTexture(c));
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    })();
    const hazeMat = keep(new THREE.MeshBasicMaterial({ map: hazeTex, transparent: true,
      depthWrite: false, side: THREE.BackSide, fog: false, opacity: 0.96 }));
    const haze = new THREE.Mesh(keep(new THREE.CylinderGeometry(88, 88, 15, 48, 1, true)), hazeMat);
    haze.position.y = 7.5;
    haze.renderOrder = 2;
    g.add(haze);

    // --- particules de lumière en suspension (poussière dans le soleil)
    const P = opts.isMobile ? 90 : 220;
    const pGeo = keep(new THREE.BufferGeometry());
    const base = new Float32Array(P * 3);
    const pos = new Float32Array(P * 3);
    const phase = new Float32Array(P);
    const speed = new Float32Array(P);
    let ps = 13579;
    const prnd = () => (ps = (ps * 48271 + 5) % 2147483647) / 2147483647;
    for (let i = 0; i < P; i++) {
      base[i * 3] = (prnd() - 0.5) * 64;
      // poussière de chantier : elle reste basse, sinon elle lit « étoiles en plein jour »
      base[i * 3 + 1] = 0.2 + prnd() * prnd() * 7.5;
      base[i * 3 + 2] = -22 + prnd() * 46;
      phase[i] = prnd() * 6.2832;
      speed[i] = 0.25 + prnd() * 0.8;
    }
    pos.set(base);
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const dotTex = (() => {
      const c = canvas(64, 64);
      const ctx = c.getContext('2d');
      const gr = ctx.createRadialGradient(32, 32, 1, 32, 32, 30);
      gr.addColorStop(0, 'rgba(255,244,220,1)');
      gr.addColorStop(0.4, 'rgba(255,236,200,0.5)');
      gr.addColorStop(1, 'rgba(255,230,190,0)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, 64, 64);
      const t = keep(new THREE.CanvasTexture(c));
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    })();
    const pMat = keep(new THREE.PointsMaterial({ map: dotTex, size: 0.34, transparent: true,
      opacity: 0.0, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
    const points = new THREE.Points(pGeo, pMat);
    points.renderOrder = 3;
    g.add(points);

    function update(u, timeMs, camera) {
      const t = Math.max(0, Math.min(1, u));
      const sec = (timeMs || 0) / 1000;
      // Le terrain est POSÉ dès u=0 : la section ouvre sur un chantier en cours, pas
      // sur du vide. Plus d'éclosion en disque (le sol qui « pousse » lisait faux).
      const e = 1 - Math.pow(1 - t, 2);
      pMat.opacity = 0.2 * (0.6 + 0.4 * e);
      const arr = pGeo.attributes.position.array;
      for (let i = 0; i < P; i++) {
        const y = base[i * 3 + 1] + ((sec * 0.22 * speed[i]) % 8);
        arr[i * 3] = base[i * 3] + Math.sin(sec * 0.3 * speed[i] + phase[i]) * 0.9;
        arr[i * 3 + 1] = y > 8.2 ? y - 8 : y;
        arr[i * 3 + 2] = base[i * 3 + 2] + Math.cos(sec * 0.2 * speed[i] + phase[i]) * 0.6;
      }
      pGeo.attributes.position.needsUpdate = true;
    }

    function dispose() { disposables.forEach((d) => d && d.dispose && d.dispose()); }

    return { group: g, update: update, dispose: dispose };
  }

  window.SB_NORMANDY = { create: create, createSky: createSky, createGround: createGround };


})();
