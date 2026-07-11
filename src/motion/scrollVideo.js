import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/scrollvid.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-scrubbing vidéo « Approche B » : une séquence d'images pré-rendues
 * dessinée sur un <canvas> plein écran fixe. La progression du scroll global
 * (0 → 1 sur toute la page) mappe l'index de frame — même principe que le
 * `state.phase` qui pilote la 3D, mais en source image photoréaliste.
 *
 * Séquence de test = fondus entre les 6 cases du storyboard (placeholder).
 * À remplacer par l'export frame-par-frame de la vraie vidéo Seedance.
 */
const FRAME_COUNT = 121;
const MAX_DPR = 2;

const framePath = (i) => `/seq/frame_${String(i).padStart(3, '0')}.webp`;

// Étapes du plan-séquence, pour le HUD technique.
const BEATS = ['BÉTON FRAIS', 'LISSAGE', 'SURFACE FERMÉE', 'VUE ZÉNITHALE', 'ENTREPÔT', 'RÉCEPTION'];

/** HUD « dossier » fixe : repères mono + barre de progression. */
function buildHud() {
  const hud = document.createElement('div');
  hud.className = 'sv-hud';
  hud.innerHTML =
    '<div class="sv-hud-tl">SURFABÉTON<br>DOSSIER TECHNIQUE · QUALIBAT 2153</div>' +
    '<div class="sv-hud-tr" data-hud-beat>01 · BÉTON FRAIS</div>' +
    '<div class="sv-hud-bl">COULÉE EN COURS ▼</div>' +
    '<div class="sv-hud-progress"><span></span></div>';
  document.body.appendChild(hud);
  return {
    beat: hud.querySelector('[data-hud-beat]'),
    bar: hud.querySelector('.sv-hud-progress > span'),
  };
}

export function initScrollVideo(state) {
  const canvas = document.getElementById('scrollvid');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  const images = new Array(FRAME_COUNT);
  const seq = { frame: 0 };
  let ready = false;

  // --- Dessin « cover » : remplit le viewport, recadre le débord ---
  function drawCover(img) {
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.width, ch / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  function render() {
    if (!ready) return;
    const i = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(seq.frame)));
    const img = images[i];
    if (img && img.complete && img.naturalWidth) drawCover(img);
  }

  // --- Dimensionnement DPR-aware ---
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    render();
  }

  // --- Préchargement : la frame 0 débloque l'affichage, le reste suit ---
  let loaded = 0;
  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      loaded++;
      if (i === 0) {
        ready = true;
        canvas.classList.add('is-ready');
        render();
      }
      if (loaded === FRAME_COUNT) ScrollTrigger.refresh();
    };
    img.src = framePath(i);
    images[i] = img;
  }

  window.addEventListener('resize', resize);
  resize();

  const hud = buildHud();

  // --- Reduced-motion : on fige une frame, pas de scrub ---
  if (state.reduced) {
    const settle = () => {
      seq.frame = FRAME_COUNT - 1;
      render();
    };
    if (images[FRAME_COUNT - 1].complete) settle();
    else images[FRAME_COUNT - 1].onload = settle;
    return;
  }

  // --- LE scrub maître : progression du scroll global → index de frame ---
  gsap.to(seq, {
    frame: FRAME_COUNT - 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate(self) {
        const p = self.progress;
        hud.bar.style.width = (p * 100).toFixed(1) + '%';
        const bi = Math.min(BEATS.length - 1, Math.floor(p * BEATS.length));
        hud.beat.textContent = String(bi + 1).padStart(2, '0') + ' · ' + BEATS[bi];
      },
    },
    onUpdate: render,
  });
}
