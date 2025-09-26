// src/effects/ScanlineH1toH2.jsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScanlineH1toH2.module.css";
import frameUrl from "../assets/frame.svg"; // ⬅️ 마스크용 SVG (흰=보임, 검=가림)

gsap.registerPlugin(ScrollTrigger);

/**
 * Home1 → Home2 전이
 * - paperMasked: SVG 모양으로 구멍 뚫린 흰 종이 1장만 아래→위로 커튼처럼 올라옴
 */
export default function ScanlineH1toH2({
  pinVh = 280,     // 스크롤 길이(vh)
  scrub = 0.5,     // 부드러움
  maskSrc = frameUrl, // (옵션) 마스크 이미지(SVG/PNG)
  maskMode = 'luminance', // SVG= 'luminance', PNG= 'alpha'
  debugMarkers = false,   // 디버그 마커 표시 여부
}) {
  const root = useRef(null);

  useLayoutEffect(() => {
    const el = root.current;
    const ctx = gsap.context(() => {
      // 길이 & 변수 세팅
      gsap.set(el.querySelector(`.${styles.spacer}`), { height: `${pinVh}vh` });
      gsap.set(el, { "--scanY": 0 });

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: `+=${pinVh}vh`,
        pin: el.querySelector(`.${styles.stage}`),
        pinSpacing: true,
        scrub,
        anticipatePin: 1,
        markers: debugMarkers,
        onUpdate: (st) => {
          const ease = gsap.parseEase('power2.out'); // curtain-like ease
          const y = Math.round(ease(st.progress) * 100);
          el.style.setProperty('--scanY', y);
        },
      });

      // 레이아웃 변동 대응
      document.fonts?.ready?.then(() => ScrollTrigger.refresh());
    }, root);
    return () => ctx.revert();
  }, [pinVh, scrub]);

  return (
    <section ref={root} className={styles.wrap} aria-label="Transition: Home1 → Home2">
      <div className={styles.stage}>
        <div className={styles.frameClip}>
          {/* Underlay: Home1 gradient (pinned underneath) */}
          <div className={styles.bgUnder} />
          {/* 흰 종이(마스크 구멍) — 커튼처럼 아래→위로 올라옴 */}
          <div
            className={styles.paperMasked}
            style={{
              position: 'absolute', inset: 0, zIndex: 3,
              background: '#fff',
              WebkitClipPath: 'inset(calc(100% - var(--scanY)%) 0 0 0)',
              clipPath: 'inset(calc(100% - var(--scanY)%) 0 0 0)',
              // two-layer mask: full white rect EXCLUDED by SVG → true hole
              WebkitMaskImage: `linear-gradient(#fff 0 0), url(${maskSrc})`,
              maskImage: `linear-gradient(#fff 0 0), url(${maskSrc})`,
              WebkitMaskSize: '100% 100%, var(--mask-size, 40vmin) auto',
              maskSize: '100% 100%, var(--mask-size, 40vmin) auto',
              WebkitMaskPosition: '0 0, center',
              maskPosition: '0 0, center',
              WebkitMaskRepeat: 'no-repeat, no-repeat',
              maskRepeat: 'no-repeat, no-repeat',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              WebkitMaskMode: `${maskMode}, ${maskMode}`,
              maskMode: `${maskMode}, ${maskMode}`,
            }}
          />
        </div>
      </div>
      <div className={styles.spacer} />
    </section>
  );
}
