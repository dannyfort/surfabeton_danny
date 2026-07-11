import { gsap } from 'gsap';

/* Contenu du hero par offre — bascule via le toggle segmenté. */
const HERO = {
  industriel: {
    eyebrow: 'NORMANDIE + NATIONAL  ·  +25 ANS  ·  QUALIBAT 2153',
    lines: ['Le dallage', 'industriel, à la', 'hauteur de vos', 'surfaces.'],
    lead:
      'Surfabéton conçoit et réalise vos sols industriels et dallages béton de grandes surfaces — usines, plateformes logistiques, entrepôts. Parc matériel propre, équipe qualifiée, un interlocuteur unique de l’étude à la réception.',
  },
  decoratif: {
    eyebrow: 'AMÉNAGEMENTS EXTÉRIEURS  ·  BÉTON DÉCORATIF  ·  NORMANDIE',
    lines: ['Le béton', 'décoratif, pour', 'des extérieurs', 'qui durent.'],
    lead:
      'Bétons désactivés, quartz, bicolores, balayés et drainants — Surfabéton signe vos aménagements extérieurs avec la même exigence technique que sur nos dallages industriels. Rendu maîtrisé, surfaces durables.',
  },
};

function initHeroToggle(reduced) {
  const seg = document.querySelector('.segmented');
  const title = document.getElementById('hero-title');
  const eyebrow = document.getElementById('hero-eyebrow');
  const lead = document.getElementById('hero-lead');
  if (!seg || !title) return;

  const render = (offer) => {
    const data = HERO[offer];
    eyebrow.innerHTML = data.eyebrow;
    lead.textContent = data.lead;
    title.innerHTML = data.lines
      .map((l, i) => {
        const accent = i === data.lines.length - 1 ? ' accent' : '';
        return `<span class="line"><span class="line-inner${accent}">${l}</span></span>`;
      })
      .join('');
  };

  seg.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-offer]');
    if (!btn || btn.getAttribute('aria-pressed') === 'true') return;

    seg.querySelectorAll('button').forEach((b) =>
      b.setAttribute('aria-pressed', String(b === btn))
    );
    const offer = btn.dataset.offer;

    if (reduced) {
      render(offer);
      return;
    }
    // Crossfade sobre du bloc texte
    const els = [eyebrow, title, lead];
    gsap.to(els, {
      opacity: 0,
      y: 10,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        render(offer);
        gsap.fromTo(
          els,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' }
        );
      },
    });
  });
}

function initCarousel() {
  const track = document.getElementById('pcarousel');
  if (!track) return;
  const prev = document.getElementById('pc-prev');
  const next = document.getElementById('pc-next');
  const progress = document.getElementById('pc-progress');
  const filters = document.querySelectorAll('.filter');

  const step = () => {
    const card = track.querySelector('.pcard:not(.is-hidden)');
    return card ? card.getBoundingClientRect().width + 22 : 340;
  };

  const updateProgress = () => {
    const max = track.scrollWidth - track.clientWidth;
    const ratio = max > 0 ? track.scrollLeft / max : 0;
    const visible = track.querySelectorAll('.pcard:not(.is-hidden)').length;
    const w = Math.max(0.15, 1 / Math.max(visible - 2, 1));
    progress.style.width = `${Math.min(w, 1) * 100}%`;
    progress.style.transform = `translateX(${ratio * (100 / (Math.min(w, 1)) - 100)}%)`;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
  };

  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', updateProgress, { passive: true });

  filters.forEach((f) => {
    f.addEventListener('click', () => {
      filters.forEach((o) => o.setAttribute('aria-pressed', String(o === f)));
      const cat = f.dataset.filter;
      track.querySelectorAll('.pcard').forEach((card) => {
        card.classList.toggle('is-hidden', cat !== 'all' && card.dataset.cat !== cat);
      });
      track.scrollTo({ left: 0, behavior: 'smooth' });
      requestAnimationFrame(updateProgress);
    });
  });

  updateProgress();
  window.addEventListener('resize', updateProgress);
}

export function initUI(state) {
  initHeroToggle(state.reduced);
  initCarousel();
}
