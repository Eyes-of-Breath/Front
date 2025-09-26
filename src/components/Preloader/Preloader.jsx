/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import styles from "./Preloader.module.css";
import usePreloaderProgress from "../../hooks/usePreloaderProgress";
import { createPreloaderTL } from "../../animations/preloader/createPreloaderTL";
import { makeQuickSetter } from "../../gsap/gsapApp";
import { gsap } from "gsap";

function splitTextToSpans(el) {
  if (!el) return () => {};
  const text = el.textContent || "";
  el.textContent = "";
  const spans = [];
  for (const ch of text) {
    const s = document.createElement("span");
    s.textContent = ch;
    el.appendChild(s);
    spans.push(s);
  }
  return () => {
    el.textContent = text;
  };
}

export default function Preloader({ onDone, onReveal }) {
  const overlayRef = useRef(null);
  const lineRef = useRef(null);
  const percentRef = useRef(null);
  const centerGhostRef = useRef(null);

  const { displayedProgress } = usePreloaderProgress(10000);
  const [played, setPlayed] = useState(false);

  const fallbackRef = useRef(null);

  // Mirror the visual styles of the gauge bar to global CSS variables so
  // 0% state (empty) and animated state share the exact same dimensions/colors.
  function syncGaugeVars() {
    const root = document.documentElement;
    const fill = lineRef.current;
    if (!fill) return;
    const track = fill.parentElement;
    const csFill = getComputedStyle(fill);
    const csTrack = track ? getComputedStyle(track) : null;

    // Core visuals of the bar
    root.style.setProperty('--gauge-height', csFill.height);
    root.style.setProperty('--gauge-color', csFill.backgroundColor);
    root.style.setProperty('--gauge-radius', csFill.borderRadius);

    // Useful insets so other places can align the same bar precisely
    if (csTrack) {
      root.style.setProperty('--gauge-padding-left', csTrack.paddingLeft);
      root.style.setProperty('--gauge-padding-right', csTrack.paddingRight);
      root.style.setProperty('--gauge-padding-top', csTrack.paddingTop);
      root.style.setProperty('--gauge-padding-bottom', csTrack.paddingBottom);
    }

    // Current scale as a global var that other components can mirror
    // (0 at start, 0->1 during preloader, 1 when finished)
    const currentScale = scaleSetterRef.current ? undefined : undefined; // no-op placeholder; real value set in effects below
    // Note: we intentionally do not set --gauge-scale here; it is updated in the progress effect.
  }

  function finish(){
    // Clear any pending fallback timer
    if (fallbackRef.current) { clearTimeout(fallbackRef.current); fallbackRef.current = null; }
    // Visual + state finalization
    document.body.classList.remove('is-lock');
    document.body.classList.add('is-loaded');
    if (onDone) onDone();
    document.documentElement.style.setProperty('--gauge-scale', '1');
    // Ensure the overlay can never intercept input after finish
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = 'none';
      overlayRef.current.setAttribute('aria-hidden', 'true');
    }
    // Hide overlay only if it still exists and hasn't been hidden by the timeline
    if (overlayRef.current && overlayRef.current.style.display !== 'none') {
      overlayRef.current.style.display = 'none';
    }
  }

  console.log('[Preloader] rendered, displayedProgress=', displayedProgress, 'played=', played);

  // lock scroll on mount + watchdog (force exit if progress stalls)
  useEffect(() => {
    document.body.classList.add('is-lock');
    const watchdog = setTimeout(() => {
      if (!played) {
        console.warn('[Preloader] Watchdog: forcing FINISH after 4s');
        setPlayed(true);
        runExit();
      }
    }, 4000);
    return () => clearTimeout(watchdog);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensure the bar starts at exact 0% with the same transform origin
  useLayoutEffect(() => {
    if (lineRef.current) {
      gsap.set(lineRef.current, { scaleX: 0, transformOrigin: 'left center' });
      // Also expose current scale as a global var for other components (e.g., header divider)
      document.documentElement.style.setProperty('--gauge-scale', '0');
    }
  }, []);

  // quick setters for performance (create after refs mount)
  const scaleSetterRef = useRef(null);
  useEffect(() => {
    if (lineRef.current) {
      scaleSetterRef.current = makeQuickSetter(lineRef.current, "scaleX");
    }
  }, []);

  useEffect(() => {
    // Populate global CSS variables from the actual DOM/computed styles
    syncGaugeVars();

    const onResize = () => syncGaugeVars();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (played) return; // avoid fighting the exit timeline
    if (scaleSetterRef.current) scaleSetterRef.current(displayedProgress / 100);
    if (percentRef.current) percentRef.current.textContent = `${Math.round(displayedProgress)}%`;
    document.documentElement.style.setProperty('--gauge-scale', String(displayedProgress / 100));
  }, [displayedProgress, played]);

  function runExit(){
    if (!overlayRef.current || !lineRef.current) {
      // If refs are missing, just finish immediately
      finish();
      return;
    }
    const tl = createPreloaderTL({
      lineEl: lineRef.current,
      percentEl: percentRef.current,
      logoWrapEl: centerGhostRef.current,
      overlayEl: overlayRef.current,
      onComplete: finish
    });

    // During exit animation, let gestures pass through to SceneController
    if (overlayRef.current) {
      overlayRef.current.style.pointerEvents = 'none';
    }

    // Give the parent a chance to fade-in Home1 while the overlay still covers the screen
    if (typeof onReveal === 'function') {
      try { onReveal(); } catch(e) { console.warn('[Preloader] onReveal error', e); }
    }

    // Fallback: if onComplete never fires (e.g., timeline misconfig), force finish in ~4s
    if (!fallbackRef.current) fallbackRef.current = setTimeout(finish, 4000);
    tl.play();
  }

  useEffect(() => {
    if (!overlayRef.current || !lineRef.current) return;

    const revertSplit = splitTextToSpans(centerGhostRef.current);

    const maybePlay = () => {
      if (played) return;
      if (displayedProgress >= 100) {
        setPlayed(true);
        runExit();
      }
    };

    maybePlay();

    return () => {
      revertSplit();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedProgress, played]);

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      data-preloader-overlay
      role="status"
      aria-live="polite"
      aria-busy={displayedProgress < 100}
    >
      <div className={styles.inner}>

        {/* Center ghost heading */}
        <div ref={centerGhostRef} className={styles.centerGhost}>
          <div aria-hidden>
            eye of breath
          </div>
        </div>

        {/* Bottom progress bar and meta */}
        <div className={styles.bottom}>
          <div className={styles.meta}>
            <span>Loading…</span>
            <span ref={percentRef} className={styles.percent}>0%</span>
          </div>
          <div className={styles.track}>
            <div ref={lineRef} className={styles.fill} />
          </div>
          {/* Small brand directly under the gauge bar */}
          <div className={styles.brandUnderBar}>
            <div aria-hidden>
              eye of breath
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
