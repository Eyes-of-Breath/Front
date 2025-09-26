import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * useGsapContext
 * - Returns a scope ref to attach to your component root.
 * - Inside setup(), create all GSAP timelines/tweens. They auto-clean on unmount via context.revert().
 */
export function useGsapContext(setup, deps = []) {
  const scopeRef = useRef(null);

  useLayoutEffect(() => {
    let ctx;

    const el = scopeRef.current;
    if (!el) return; // guard against missing node (mount order / conditional render)

    // Use `self` provided by gsap.context; don't reference `ctx` before it's assigned.
    ctx = gsap.context((self) => {
      setup({ gsap, context: self });
    }, el);

    return () => {
      if (ctx) ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}