import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';
import './styles/components.css';

import { gsap } from 'gsap';
import { runPreloader } from './motion/preloader.js';
import { initMaster } from './motion/master.js';
import { heroIntro, initReveals } from './motion/reveals.js';
import { initUI } from './motion/ui.js';

// Frames lentes (compile shaders, machine faible) : les tweens sautent
// en avant au lieu de ramper — le préloader dure VRAIMENT 2 s.
gsap.ticker.lagSmoothing(0);

/** État partagé : les ScrollTriggers écrivent, la 3D lit. */
const state = {
  phase: 1,
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  webgl: detectWebGL(),
  // Proto scroll-vidéo (Approche B) : activé via ?scrollvid=1
  scrollvid: new URLSearchParams(window.location.search).has('scrollvid'),
};

function detectWebGL() {
  try {
    const c = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (c.getContext('webgl2') || c.getContext('webgl'))
    );
  } catch {
    return false;
  }
}

if (!state.webgl) document.body.classList.add('no-gl');
if (state.reduced) document.body.classList.add('reduced');
if (state.scrollvid) document.body.classList.add('scrollvid');

// --- 3D en dynamique : le module se précharge pendant le préloader,
//     mais l'instanciation (compilation des shaders) attend la fin.
//     Court-circuitée en mode scroll-vidéo (proto). ---
const glModule = state.webgl && !state.scrollvid ? import('./gl/Experience.js') : null;

runPreloader(state).then(async () => {
  if (state.scrollvid) {
    const { initScrollVideo } = await import('./motion/scrollVideo.js');
    initScrollVideo(state);
  } else if (glModule) {
    try {
      const { Experience } = await glModule;
      new Experience(document.getElementById('gl'), state);
    } catch (err) {
      console.error('[Surfabéton] WebGL indisponible, fallback DOM :', err);
      document.body.classList.add('no-gl');
    }
  }
  heroIntro(state);
  if (!state.reduced) {
    initMaster(state);
  } else {
    state.phase = 6;
  }
  initReveals(state);
  initUI(state);
});

// --- Formulaire devis : compose un email (pas de backend) ---
document.getElementById('devis-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const sujet = encodeURIComponent(`Demande de devis — ${data.get('sujet')}`);
  const corps = encodeURIComponent(
    `Prénom : ${data.get('prenom')}\nNom : ${data.get('nom')}\n` +
      `Email : ${data.get('email')}\nTéléphone : ${data.get('telephone') || '—'}\n\n` +
      `${data.get('message') || ''}`
  );
  window.location.href = `mailto:surfabeton@gmail.com?subject=${sujet}&body=${corps}`;
  document.getElementById('form-note').textContent =
    'VOTRE MESSAGERIE VA S’OUVRIR — NOUS VOUS RAPPELONS SOUS 24H.';
});

// --- Divers ---
document.getElementById('footer-year').textContent = String(new Date().getFullYear());
