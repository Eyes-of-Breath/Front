import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Observer, ScrollTrigger } from "gsap/all";
import scenes from "./index";


gsap.registerPlugin(Observer, ScrollTrigger);

// Hard-disable scene flipping by default; let ScrollTrigger drive sections
if (typeof window !== 'undefined') {
  try {
    // Freeze the flag so later scripts can’t flip it back inadvertently
    Object.defineProperty(window, '__SC_OBSERVER_ENABLED__', { value: false, writable: false, configurable: true });
  } catch {
    window.__SC_OBSERVER_ENABLED__ = false;
  }
}

const SceneController = ({ onSceneChange }) => {
  const hostRef = useRef(null);
  const intentRef = useRef({ dir: 0, count: 0, ts: 0 });
  const lastFlipTsRef = useRef(0);
  const scrollBufRef = useRef({ amt: 0, dir: 0, since: 0 });
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.__SC_OBSERVER_ENABLED__) {
      return; // allow native scroll + ScrollTrigger to control animations
    }
    if (!hostRef.current) return;

    const MIN_GAP = 1600; // ms — longer cooldown between flips
    const THRESHOLD_PX = 800;   // need more accumulated distance
    const THRESHOLD_MS = 600;   // within this window
    const THRESHOLD_VEL = 2.0;  // or very fast flick

    const target = document;
    const observer = Observer.create({
      target: target,
      type: "wheel,touch,pointer",
      preventDefault: false,
      passive: true,
      capture: false,
      lockAxis: true,
      wheelSpeed: 0.5,
      tolerance: 16,
      dragMinimum: 28,
      onChangeY(self) {
        const target = hostRef.current || document;

        // Do not react while the user is typing/selecting text
        const ae = document.activeElement;
        const tag = (ae && ae.tagName) ? ae.tagName.toLowerCase() : '';
        if (tag === 'input' || tag === 'textarea' || (ae && ae.isContentEditable)) return;
        const sel = window.getSelection && window.getSelection();
        if (sel && sel.type === 'Range') return;

        // If any ScrollTrigger is active (pin or not), avoid flipping scenes
        if (ScrollTrigger.getAll().some(st => st.isActive())) return;

        // If any pin-type ScrollTrigger is actively consuming scroll, don't flip scenes
        if (ScrollTrigger.getAll().some(st => st.pin && st.isActive())) return;

        // If an app-specific blocker exists, obey it
        if (typeof window.shouldBlockSceneController === 'function' && window.shouldBlockSceneController()) return;

        const raw = self.deltaY || 0;
        const ABS_MIN = 24; // ignore micro nudges
        if (Math.abs(raw) < ABS_MIN) return;

        const now = Date.now();
        if (now - lastFlipTsRef.current < MIN_GAP) return; // cooldown

        // clamp per-event delta to tame trackpad spikes
        const dy = Math.max(-140, Math.min(140, raw));
        const add = Math.min(Math.abs(dy), 90);
        const dir = dy > 0 ? 1 : -1;

        // update rolling buffer
        const buf = scrollBufRef.current;
        if (!buf.since || dir !== buf.dir || (now - buf.since) > 800) {
          buf.amt = 0; buf.since = now; buf.dir = dir;
        }
        buf.amt += add;
        const elapsed = now - buf.since;
        const vel = buf.amt / Math.max(1, elapsed); // px/ms

        // Determine strong intent using either distance-in-window OR high velocity
        const strongIntent = (buf.amt > THRESHOLD_PX && elapsed < THRESHOLD_MS) || (vel > THRESHOLD_VEL);
        if (!strongIntent) return;

        // Require two consecutive strong-intent readings in the same direction
        const ic = intentRef.current;
        if (ic.dir !== dir || (now - ic.ts) > 700) {
          intentRef.current = { dir, count: 1, ts: now };
          return;
        } else {
          intentRef.current = { dir, count: ic.count + 1, ts: now };
          if (intentRef.current.count < 2) return;
        }

        // Flip scene
        let nextScene = currentScene + dir;
        if (nextScene < 0) nextScene = 0;
        if (nextScene >= scenes.length) nextScene = scenes.length - 1;

        if (nextScene !== currentScene) {
          setCurrentScene(nextScene);
          onSceneChange && onSceneChange(nextScene);
          lastFlipTsRef.current = now;
          // reset buffers so tiny follow-up movements don't cascade
          scrollBufRef.current = { amt: 0, dir: 0, since: 0 };
          intentRef.current = { dir: 0, count: 0, ts: 0 };
        }
      }
    });

    return () => {
      observer && observer.kill();
    };
  }, [currentScene, onSceneChange]);

  return (
    <div
      ref={hostRef}
      className="scene-controller"
      style={{ position: 'relative', zIndex: 1, pointerEvents: 'auto' }}
    >
      {scenes[currentScene]?.Comp && React.createElement(scenes[currentScene].Comp)}
    </div>
  );
};

export default SceneController;