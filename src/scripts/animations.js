// GSAP animation orchestration, per the real architecture debate's plan:
// Core (all tweens), ScrollTrigger (section reveals + pipeline pinning),
// SVG/DrawSVGPlugin (pipeline + deploy diagrams drawing in), TextPlugin
// (hero headline reveal). Degrades to instant-visible on
// prefers-reduced-motion, and simplifies pinning on narrow viewports.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, TextPlugin);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 720px)').matches;

export function initAnimations() {
  if (reduceMotion) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('opacity-100'));
    return;
  }

  // Hero headline: TextPlugin word-by-word reveal
  const heroLine = document.querySelector('[data-anim="hero-text"]');
  if (heroLine) {
    const full = heroLine.textContent || '';
    heroLine.textContent = '';
    gsap.to(heroLine, { duration: 1.1, text: full, ease: 'none', delay: 0.15 });
  }

  // Hero pipeline strip: sequential step highlight (Core only, no scroll dependency)
  const pipeSteps = gsap.utils.toArray('[data-pipeline-step]');
  if (pipeSteps.length) {
    const tl = gsap.timeline({ repeat: -1 });
    pipeSteps.forEach((el) => {
      tl.to(el, { backgroundColor: 'var(--accent-soft)', borderColor: 'var(--accent)', color: 'var(--text)', duration: 0.3 })
        .to(el, { backgroundColor: 'var(--panel)', borderColor: 'var(--border)', color: 'var(--text-faint)', duration: 0.3 }, '+=0.5');
    });
  }

  // Generic section reveal on scroll (ScrollTrigger)
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // Debate scene bubbles: staggered reveal
  const bubbles = gsap.utils.toArray('.debate-bubble');
  if (bubbles.length) {
    gsap.to(bubbles, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.22,
      ease: 'power2.out',
      scrollTrigger: { trigger: bubbles[0].closest('[data-debate-scene]'), start: 'top 75%' },
    });
  }

  // Pipeline/timeline SVG connector: DrawSVG reveal tied to natural scroll of
  // the timeline itself -- no pinning. Real bug found live: pinning the
  // entire ~1400px-tall workflow section for the full scrub duration created
  // a long stretch of "stuck" scrolling (the section doesn't move while the
  // user keeps scrolling) that reads as a blank/broken page, since only a
  // thin line was animating during all of it. The line now just draws in
  // sync with the section's own natural scroll past the viewport instead.
  const svgPath = document.querySelector('[data-draw-path]');
  if (svgPath) {
    gsap.set(svgPath, { drawSVG: '0%' });
    gsap.to(svgPath, {
      drawSVG: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: svgPath.closest('[data-pipeline-diagram]'),
        start: 'top 60%',
        end: 'bottom 60%',
        scrub: 0.6,
      },
    });
  }

  // Deploy workflow diagram: same DrawSVG pattern, no pin (shorter section)
  const deployPath = document.querySelector('[data-draw-path-deploy]');
  if (deployPath) {
    gsap.set(deployPath, { drawSVG: '0%' });
    gsap.to(deployPath, {
      drawSVG: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: deployPath.closest('[data-deploy-diagram]'),
        start: 'top 80%',
        end: 'bottom 60%',
        scrub: 0.5,
      },
    });
  }
}
