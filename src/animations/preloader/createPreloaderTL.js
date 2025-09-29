import { gsap } from "gsap";

/**
 * Returns a paused timeline. Call tl.play() when ready (>=100%).
 */
export function createPreloaderTL({ lineEl, percentEl, logoWrapEl, overlayEl, onReveal, onComplete }) {
  const tl = gsap.timeline({ paused: true });

  // Underlying main view to fade in (fallback to data attribute if id not present)
  const revealEl = document.querySelector('#home1') || document.querySelector('[data-reveal-root]');
  const headerFill = document.querySelector('[data-divider-fill]');

  if (overlayEl) gsap.set(overlayEl, { opacity: 1, pointerEvents: 'auto' });
  if (overlayEl) tl.set(overlayEl, { willChange: 'opacity, transform' }, 0);
  if (revealEl) gsap.set(revealEl, { opacity: 0, pointerEvents: 'none' });
  if (headerFill) gsap.set(headerFill, { transformOrigin: 'left center', scaleX: 0 });

  // Set global prestart class at time 0 (force initial layout to final resting positions)
  tl.add(() => {
    document.documentElement.classList.add('prestart');
  }, 0);

  // 1) Gauge fill 0% → 100% (black) + percent counter sync
  if (lineEl) gsap.set(lineEl, { transformOrigin: 'left center', scaleX: 0, background: '#fff' });
  const counter = { v: 0 };
  tl.to(lineEl, {
    scaleX: 1,
    duration: 1.2,
    ease: 'power2.out'
  });
  if (percentEl) {
    tl.to(counter, {
      v: 100,
      duration: 1.2,
      ease: 'none',
      onUpdate: () => {
        const n = Math.round(counter.v);
        percentEl.textContent = `${n}%`;
        percentEl.setAttribute?.('aria-valuenow', String(n));
      }
    }, '<');
  }

  // 2) Lift gauge bar near top (≈1rem from top)
  const bottomEl = lineEl?.parentElement?.parentElement; // fill → track → bottom
  if (bottomEl) {
    gsap.set(bottomEl, {
      position: 'fixed',
      left: 'calc(clamp(16px, 6vw, 48px) + 10px)',  // shorten 10px from left
      right: 'calc(clamp(16px, 6vw, 48px) + 10px)', // shorten 10px from right
      height: 2,
      // Start at current visual Y so there is no jump when switching to fixed
      top: bottomEl.getBoundingClientRect().top + 20, // start slightly lower
      margin: 0,
      padding: 0,
      background: 'transparent',
      pointerEvents: 'none',
      zIndex: 10000
    });
  }
  tl.add(() => {
    if (!bottomEl || !overlayEl) return;
    // compute delta so the top of bottomEl aligns to overlay top + 16px
    const overlayBox = overlayEl.getBoundingClientRect();
    const targetTop = overlayBox.top + 16; // 1rem ≈ 16px base

    const brandWrap = document.getElementById('brandWipe');
    const brandInk = document.querySelector('#brandWipe [data-ink]');
    if (brandWrap && brandInk) {
      // measure and pin the brand over the overlay so the wipe is visible during the lift
      const r = brandWrap.getBoundingClientRect();
      gsap.set(brandWrap, {
        position: 'fixed',
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
        margin: 0,
        zIndex: 10001,        // above overlay (overlay zIndex was 9999)
        pointerEvents: 'none',
        willChange: 'transform'
      });

      // prepare erase direction (reverse sweep)
      gsap.set(brandInk, { '--angle': `${18 + 180}deg`, '--pos': '-40%' });
      // wipe *while* gauge moves up (same duration)
      gsap.to(brandInk, { '--pos': '180%', duration: 0.6, ease: 'power3.inOut' });
    }

    // Optional: if you wrap the percent text with <InkWipe id="percentWipe" ... autoplay={false} mode="erase" />
    const percentInk = document.querySelector('#percentWipe [data-ink]');
    if (percentInk) {
      gsap.set(percentInk, { '--angle': `${18 + 180}deg`, '--pos': '-40%' });
      gsap.to(percentInk, { '--pos': '180%', duration: 0.6, ease: 'power3.inOut' });
    }

    gsap.to(bottomEl, {
      top: targetTop + 5, // 20px lower than 1rem
      duration: 0.6,
      ease: 'power3.inOut'
    });
  });

  // 3) Logo reveal (fade + subtle scale)
  // Expect logoWrapEl children to be split spans for stagger; fallback to wrapper
  if (logoWrapEl) {
    const targets = logoWrapEl?.querySelectorAll?.("span")?.length
      ? logoWrapEl.querySelectorAll("span")
      : [logoWrapEl];
    tl.fromTo(targets, {
      opacity: 0,
      yPercent: 20,
      scale: 0.96
    }, {
      opacity: 1,
      yPercent: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.04,
      ease: "power3.out"
    }, "<0.1");
  }

  // 4) Signal reveal start so underlying view can mount/prepare
  tl.add(() => {
    // Switch from prestart → revealing before overlay fade, so underlying scene can crossfade in
    document.documentElement.classList.remove('prestart');
    document.documentElement.classList.add('revealing');
    if (onReveal) onReveal();
  });

  // 4.5) Crossfade underlying main view (starts slightly before overlay fade/lift)
  if (revealEl) {
    tl.to(revealEl, {
      opacity: 1,
      duration: 0.6,
      ease: 'power1.out',
      onComplete: () => { try { revealEl.style.pointerEvents = ''; } catch (_) {} }
    }, '+=0.05');
  }

  // 4.8) Snap header divider to filled state (visual hand-off from preloader gauge)
  if (headerFill) {
    tl.to(headerFill, {
      scaleX: 1,
      duration: 0.35,
      ease: 'power2.out'
    }, '<0.05');
  }

  // 5) Overlay fade out (reveal main) – small hold after onReveal to avoid flicker
  tl.to(overlayEl, {
    autoAlpha: 0,          // opacity:0 + visibility:hidden
    duration: 0.6,
    ease: 'power2.out',
    onComplete: () => {
      document.documentElement.classList.remove('revealing');
      if (overlayEl) {
        overlayEl.style.pointerEvents = 'none';
        overlayEl.style.willChange = '';
        overlayEl.style.transform = '';
      }
      const brandWrap = document.getElementById('brandWipe');
      if (brandWrap) {
        brandWrap.style.position = '';
        brandWrap.style.left = '';
        brandWrap.style.top = '';
        brandWrap.style.width = '';
        brandWrap.style.height = '';
        brandWrap.style.margin = '';
        brandWrap.style.zIndex = '';
        brandWrap.style.pointerEvents = '';
        brandWrap.style.willChange = '';
      }
      onComplete && onComplete();
    }
  }, '<0.1');

  return tl;
}
