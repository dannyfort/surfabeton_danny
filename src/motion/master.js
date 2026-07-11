import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * LE scrub maître : chaque section mappe son passage à une tranche de
 * phase [n → n+1] via une ligne de repère à 75 % du viewport.
 * Les tranches sont contiguës (bas de section n = haut de section n+1),
 * donc la phase évolue sans à-coups ni chevauchements.
 */
const PHASE_SECTIONS = [
  ['#stats', 1],
  ['#expertises', 2],
  ['#types', 3],
  ['#realisations', 4],
  ['#final', 5],
];

export function initMaster(state) {
  // Pin de la section chiffres : le temps que la règle laser passe
  ScrollTrigger.create({
    trigger: '#stats',
    start: 'top top',
    end: '+=120%',
    pin: true,
    pinSpacing: true,
  });

  for (const [sel, base] of PHASE_SECTIONS) {
    const isLast = base === 5;
    ScrollTrigger.create({
      trigger: sel,
      start: 'top 75%',
      end: isLast ? 'bottom bottom' : 'bottom 75%',
      scrub: 0.8,
      onUpdate(self) {
        state.phase = base + self.progress;
      },
      refreshPriority: -base,
    });
  }

  // Recalage après chargement des fonts (positions de pin dépendent du layout)
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}
