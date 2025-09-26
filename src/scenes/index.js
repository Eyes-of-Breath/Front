// src/scenes/index.js
import Home1 from "../components/Home1";
import Home2 from "../components/Home2";
import Home3 from "../components/Home3";
import Home4 from "../components/Home4";
import Home5 from "../components/Home5";
import { gsap } from "gsap";

console.log('[SCENES] registry loaded');

// 공용 간단 intro/outro (장차 각 씬 폴더로 분리 가능)
const fadeIn = (scope) => {
  const el = scope?.querySelector?.('.scene-content');
  if (!el) {
    console.warn('[SCENES] fadeIn: .scene-content not found in scope');
    return gsap.timeline({ paused: true });
  }
  return gsap.timeline({ paused: true })
    .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'power1.out', onStart: () => console.log('[SCENES] tlIn start'), onComplete: () => console.log('[SCENES] tlIn done') });
};

// 첫 씬 전용: 이미 뒤에서 렌더된 상태이므로 즉시 보이기 (깜빡임 방지)
const fadeInInstant = (scope) => {
  const el = scope?.querySelector?.('.scene-content');
  if (!el) {
    console.warn('[SCENES] fadeInInstant: .scene-content not found in scope');
    return gsap.timeline({ paused: true });
  }
  return gsap.timeline({ paused: true })
    .set(el, { autoAlpha: 1, clearProps: 'visibility,opacity' });
};

const fadeOut = (scope) => {
  const el = scope?.querySelector?.('.scene-content');
  if (!el) {
    console.warn('[SCENES] fadeOut: .scene-content not found in scope');
    return gsap.timeline({ paused: true });
  }
  return gsap.timeline({ paused: true })
    .to(el, { autoAlpha: 0, duration: 0.4, ease: 'power1.in', onStart: () => console.log('[SCENES] tlOut start'), onComplete: () => console.log('[SCENES] tlOut done') });
};

export default [
  { id: "home1", Comp: Home1, tlIn: fadeInInstant, tlOut: fadeOut, bgVar: "transparent" },
  { id: "home2", Comp: Home2, tlIn: fadeInInstant, tlOut: fadeOut, bgVar: "transparent" },
  { id: "home3", Comp: Home3, tlIn: fadeIn,  tlOut: fadeOut, bgVar: "var(--bg-home3, #F0F9FF)" },
  { id: "home4", Comp: Home4, tlIn: fadeIn,  tlOut: fadeOut, bgVar: "var(--bg-home4, #1E293B)" },
  { id: "home5", Comp: Home5, tlIn: fadeIn,  tlOut: fadeOut, bgVar: "var(--bg-home5, #F8FAFC)" },
];

export const SCENES_COUNT = 5;