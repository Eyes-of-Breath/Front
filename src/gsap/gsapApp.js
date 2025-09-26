import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let _inited = false;

export function initGSAP() {
  if (_inited) return;
  if (typeof window === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  // ScrollTrigger safe configs
  ScrollTrigger.config({
    ignoreMobileResize: true,
    limitCallbacks: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
  });

  // sensible defaults
  gsap.defaults({ ease: "power1.out", duration: 0.6 });
  gsap.config({ nullTargetWarn: false });
  gsap.ticker.lagSmoothing(1000, 16);

  // Defer scroller default to when #scroll-root exists
  setDefaultScroller();

  // reduced motion flag
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const setRM = () => (window.__REDUCED_MOTION__ = mq.matches);
  setRM();
  if (mq.addEventListener) {
    mq.addEventListener('change', setRM);
  } else if (mq.addListener) {
    mq.addListener(setRM); // Safari fallback
  }

  refreshOnWindowLoad();

  _inited = true;
}

export const makeQuickSetter = (el, prop, unit) => gsap.quickSetter(el, prop, unit);
export const makeQuickTo = (el, prop, opts) => gsap.quickTo(el, prop, opts);

export function setDefaultScroller(selector = '#scroll-root', maxTries = 20) {
  if (typeof window === 'undefined') return;
  let tries = 0;
  const tick = () => {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (el) {
      try { ScrollTrigger.defaults({ scroller: el }); } catch (_) {}
      return;
    }
    if (tries++ < maxTries) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function refreshScrollTriggers(nextTick = true) {
  if (typeof window === 'undefined') return;
  const run = () => {
    try { ScrollTrigger.refresh(); } catch (_) {}
  };
  nextTick ? requestAnimationFrame(run) : run();
}

export function refreshOnWindowLoad() {
  if (typeof window === 'undefined') return;
  window.addEventListener('load', () => refreshScrollTriggers(true));
}