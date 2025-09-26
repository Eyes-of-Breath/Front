import { useEffect, useRef, useState } from "react";
import { assetList } from "../utils/assetList";

function lerp(a, b, t) { return a + (b - a) * t; }

export default function usePreloaderProgress(timeoutMs = 10000) {
  const [real, setReal] = useState(0); // 0~100
  const [displayed, setDisplayed] = useState(0);
  const completeRef = useRef(false);

  useEffect(() => {
    let mounted = true;
    let doneWeight = 0;
    const totalWeight = assetList.reduce((s, a) => s + (a.weight || 1), 0) || 1;

    const controllers = [];

    const markDone = (w) => {
      doneWeight += w;
      const next = Math.min(100, Math.round((doneWeight / totalWeight) * 100));
      if (mounted) setReal(next);
    };

    // Images
    assetList.filter(a => a.type === 'image').forEach(a => {
      const img = new Image();
      img.onload = img.onerror = () => markDone(a.weight || 1);
      img.src = a.src;
      controllers.push(img);
    });

    // Fonts
    const fontAssets = assetList.filter(a => a.type === 'font');
    if (fontAssets.length > 0) {
      // Wait for document.fonts
      if (document?.fonts?.ready) {
        document.fonts.ready.then(() => {
          // Try to load each explicitly so FOIT/FOUT is minimized
          Promise.all(fontAssets.map(a => document.fonts.load(`1rem "${a.family}"`)))
            .catch(() => {})
            .finally(() => {
              fontAssets.forEach(a => markDone(a.weight || 1));
            });
        });
      } else {
        // Fallback if Font Loading API not supported
        setTimeout(() => fontAssets.forEach(a => markDone(a.weight || 1)), 300);
      }
    }

    // Safety timeout
    const to = setTimeout(() => {
      if (mounted) setReal(100);
    }, timeoutMs);

    // Displayed (lerp) loop
    let rafId = 0;
    const loop = () => {
      setDisplayed(prev => {
        // more aggressive catch-up near the end
        const k = prev > 90 ? 0.25 : 0.15;
        const next = lerp(prev, real, k);
        return next > 99.7 && real === 100 ? 100 : next;
      });
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      mounted = false;
      controllers.length = 0;
      clearTimeout(to);
      cancelAnimationFrame(rafId);
    };
  }, [timeoutMs]);

  useEffect(() => {
    if (displayed >= 100) completeRef.current = true;
  }, [displayed]);

  return {
    realProgress: real,
    displayedProgress: Math.round(displayed),
    isComplete: completeRef.current,
  };
}
