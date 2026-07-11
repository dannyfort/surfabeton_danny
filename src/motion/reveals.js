import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const fmt = (v, format) =>
  format === 'fr' ? Math.round(v).toLocaleString('fr-FR') : String(Math.round(v));

/** Intro du hero : lignes sorties de coffrage + fiche technique + lead. */
export function heroIntro(state) {
  if (state.reduced) return;

  gsap
    .timeline({ defaults: { ease: 'power4.out' } })
    .from('.hero-title .line-inner', {
      yPercent: 112,
      duration: 1.1,
      stagger: 0.09,
    })
    .from('.reveal-eyebrow', { opacity: 0, y: 12, duration: 0.6 }, 0.35)
    .from(
      '.hero .reveal-up',
      { opacity: 0, y: 26, duration: 0.8, stagger: 0.12 },
      0.55
    )
    .from('.reveal-fiche', { opacity: 0, x: 30, duration: 0.8 }, 0.8);
}

/** Révélations au scroll + compteurs + barres + méthode. */
export function initReveals(state) {
  const setFinalValues = () => {
    document.querySelectorAll('.count').forEach((el) => {
      el.textContent = fmt(Number(el.dataset.count), el.dataset.format);
    });
    document
      .querySelectorAll('.project-bar span')
      .forEach((el) => (el.style.transform = 'scaleX(1)'));
    document.getElementById('steps-line-fill').style.transform = 'scaleY(1)';
    document.querySelectorAll('.step').forEach((s) => s.classList.add('is-active'));
  };

  if (state.reduced) {
    setFinalValues();
    return;
  }

  // --- Compteurs des stats : s'impriment pendant le pin (règle laser) ---
  const statsTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#stats',
      start: 'top top',
      end: '+=120%',
      scrub: true,
    },
  });
  document.querySelectorAll('.stats .count').forEach((el, i) => {
    const counter = { v: 0 };
    statsTl.to(
      counter,
      {
        v: Number(el.dataset.count),
        duration: 0.55,
        ease: 'none',
        onUpdate: () => (el.textContent = fmt(counter.v, el.dataset.format)),
      },
      0.12 + i * 0.18
    );
  });
  statsTl.from('.trust', { opacity: 0, y: 16, duration: 0.3 }, 0.75);

  // --- Cartes expertises + types + moyens : entrées en batch ---
  ScrollTrigger.batch('.card, .type, .moyens-list li', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.fromTo(
        els,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.85, stagger: 0.09, ease: 'power3.out', overwrite: true }
      ),
  });

  // --- Têtes de section ---
  ScrollTrigger.batch('.section-head', {
    start: 'top 85%',
    once: true,
    onEnter: (els) =>
      gsap.fromTo(
        els,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', overwrite: true }
      ),
  });

  // --- Réalisations : compteurs m² + barres de comparaison ---
  document.querySelectorAll('.project').forEach((row) => {
    const countEl = row.querySelector('.count');
    const bar = row.querySelector('.project-bar span');
    const counter = { v: 0 };
    gsap
      .timeline({
        scrollTrigger: { trigger: row, start: 'top 85%', once: true },
        defaults: { ease: 'power3.out' },
      })
      .fromTo(row, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 })
      .to(
        counter,
        {
          v: Number(countEl.dataset.count),
          duration: 1.1,
          ease: 'power2.out',
          onUpdate: () => (countEl.textContent = fmt(counter.v, countEl.dataset.format)),
        },
        0.1
      )
      .to(bar, { scaleX: 1, duration: 1.1, ease: 'power4.out' }, 0.15);
  });

  // --- Méthode : la ligne se trace, les étapes s'allument ---
  gsap.to('#steps-line-fill', {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: '.steps',
      start: 'top 70%',
      end: 'bottom 55%',
      scrub: 0.6,
    },
  });
  document.querySelectorAll('.step').forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 68%',
      onEnter: () => step.classList.add('is-active'),
      onLeaveBack: () => step.classList.remove('is-active'),
    });
  });

  // --- Témoignage + bandes finales ---
  ScrollTrigger.batch('.final .reveal-up', {
    start: 'top 85%',
    once: true,
    onEnter: (els) =>
      gsap.fromTo(
        els,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out', overwrite: true }
      ),
  });
}
