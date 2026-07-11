import { gsap } from 'gsap';

const TARGET = 55000;

/**
 * Préloader « coffrage » : compteur 0 → 55 000 m² + barre oxyde,
 * puis rideau levé. Retourne une promesse résolue quand l'écran est libéré.
 */
export function runPreloader(state) {
  const el = document.getElementById('preloader');
  const count = document.getElementById('preloader-count');
  const fill = document.getElementById('preloader-bar-fill');

  if (state.reduced) {
    el.remove();
    document.body.classList.remove('is-loading');
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const counter = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        el.remove();
        resolve();
      },
    });

    tl.to(counter, {
      v: TARGET,
      duration: 2.0,
      ease: 'power2.inOut',
      onUpdate() {
        count.textContent = Math.round(counter.v).toLocaleString('fr-FR');
      },
    })
      .to(fill, { scaleX: 1, duration: 2.0, ease: 'power2.inOut' }, 0)
      .add(() => document.body.classList.remove('is-loading'), '+=0.15')
      .to(el, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
      });
  });
}
