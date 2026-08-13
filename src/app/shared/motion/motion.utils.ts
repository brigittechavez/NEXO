export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

export function isReducedMotion(): boolean {
  if (!isBrowser()) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export async function gsapSafe() {
  if (!isBrowser()) return null;
  const { gsap } = await import('gsap');
  return gsap;
}

export async function scrollTriggerSafe() {
  if (!isBrowser()) return null;
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  return ScrollTrigger;
}

export async function initGsap() {
  const gsap = await gsapSafe();
  const ScrollTrigger = await scrollTriggerSafe();
  if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
  return { gsap, ScrollTrigger };
}
