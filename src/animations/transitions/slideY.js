// src/animations/transitions/slideY.js
import { gsap } from "gsap";

/**
 * Vertical slide transition between two absolutely-positioned layers.
 * - Brings `nextEl` from offscreen (top/bottom) while moving `currentEl` out.
 * - Uses yPercent so it doesn't depend on pixel heights.
 * - Temporarily manages z-index to ensure next is on top during the swap.
 * `dir` can be "next"/"prev" or numeric `1` / `-1` (treated as next/prev respectively).
 */
export function createSlideY({ currentEl, nextEl, dir = "next", dur = 0.6, ease = "power2.inOut", hideCurrent = true, useDisplaySwap = true }) {
  const tl = gsap.timeline({ paused: true });

  // Normalize ease to a GSAP ease string if someone passes an object accidentally
  if (typeof ease !== 'string') ease = 'power2.inOut';

  // Normalize direction to numeric sign (1 = next/down, -1 = prev/up)
  const dirNum = (dir === 1 || dir === "1" || dir === "next" || dir === "forward" || dir === "down") ? 1 : -1;

  if (!currentEl || !nextEl) {
    console.warn("[slideY] missing element(s)", { currentEl, nextEl });
    return tl; // return empty paused timeline to avoid runtime errors
  }

  // Prep: place next off-screen and ensure it's above current during the swap
  const fromPercent = dirNum === 1 ? 100 : -100;
  gsap.set(nextEl, { yPercent: fromPercent, zIndex: 2, force3D: true, autoAlpha: 1, display: useDisplaySwap ? 'block' : undefined, willChange: 'transform,opacity' });
  gsap.set(currentEl, { zIndex: 1, force3D: true, willChange: 'transform,opacity' });

  // InkWipe integration: drive CSS variables on any [data-ink] elements in both layers
  const ERASE_ANGLE = 198; // 18 + 180 (reverse)
  const REVEAL_ANGLE = 18;

  const currentInks = currentEl.querySelectorAll('[data-ink]');
  const nextInks = nextEl.querySelectorAll('[data-ink]');

  // Current layer → erase while sliding out
  currentInks.forEach((ink) => {
    gsap.set(ink, { '--angle': `${ERASE_ANGLE}deg`, '--pos': '-40%' });
    tl.to(ink, { '--pos': '180%', duration: dur, ease }, 0);
  });

  // Next layer → reveal while sliding in
  nextInks.forEach((ink) => {
    gsap.set(ink, { '--angle': `${REVEAL_ANGLE}deg`, '--pos': '-40%' });
    tl.to(ink, { '--pos': '100%', duration: dur, ease }, 0);
  });

  // Animate both layers
  tl.to(currentEl, { yPercent: -fromPercent, duration: dur, ease }, 0)
    .to(nextEl,    { yPercent: 0,          duration: dur, ease }, 0)
    .add(() => {
      // Cleanup: ensure next is fully visible at top and current is hidden if requested
      if (hideCurrent) {
        gsap.set(currentEl, { yPercent: 0, zIndex: 1, autoAlpha: 0, display: useDisplaySwap ? 'none' : 'block' });
      } else {
        gsap.set(currentEl, { yPercent: 0, zIndex: 1 });
      }
      gsap.set(nextEl,    { yPercent: 0, zIndex: 2, autoAlpha: 1, display: 'block' });
      // Clear performance hints
      gsap.set([currentEl, nextEl], { willChange: 'auto', clearProps: 'opacity,filter' });
    });

  return tl;
}

export default createSlideY;