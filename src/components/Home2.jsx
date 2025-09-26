import React, { useRef, useLayoutEffect } from 'react';
import styles from './Home2.module.css';
import logo from '../assets/logo.png';
import gradient from '../assets/blue_gray_gradient.svg';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home2 = () => {
  const parentRef = useRef(null);
  const leftTrackRef = useRef(null);
  const rightTrackRef = useRef(null);
  const logoRef = useRef(null);
  const progressRef = useRef(null);
  const leftSlidesRef = useRef([]);
  const rightSlidesRef = useRef([]);

  const sections = [
    {
      title: '진단',
      subtitle: 'DIAGNOSIS',
      content:
        '폐렴, 결핵, 폐암 등 다양한 폐 질환을 AI가 영상만으로 정확히 판별하는 기능을 상징합니다. 전문의 부족이나 실수에 따른 오진 가능성을 줄여주는 진단 보조 솔루션으로 정체성을 담고 있습니다.'
    },
    {
      title: '비전',
      subtitle: 'VISION',
      content:
        "영상 인식의 의미뿐만 아니라, Vision Transformer 기반 AI 모델이 핵심 기술로 들어가 있다는 점에서 의미를 지니고 있습니다. 환자 상태를 '보는 눈', 즉 의료진의 시각을 보조하는 역할이라는 이중 의미를 갖습니다."
    },
    {
      title: '신뢰',
      subtitle: 'TRUST',
      content:
        'AI 결과를 Grad-CAM, Attention Map 등으로 시각화하여 의료진이 결과를 이해하고 신뢰할 수 있도록 설계되었습니다. 검증된 AI와 시각화는 의료진뿐만 아니라 환자들에게도 신뢰를 주는 요소입니다.'
    }
  ];

  useLayoutEffect(() => {
    let ctx;
    let tries = 0;

    const setup = () => {
      const trigger = parentRef.current;
      if (!trigger || !leftTrackRef.current || !rightTrackRef.current) {
        if (tries++ < 10) requestAnimationFrame(setup);
        return;
      }

      ctx = gsap.context(() => {
        gsap.set([leftTrackRef.current, rightTrackRef.current], { yPercent: 0, willChange: 'transform' });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger,
            start: 'top top',
            end: '+=200%',
            scrub: 0.7,
            pin: true,
            // markers: true, // uncomment to debug
          }
        });

        // thresholds for staged reveal per gauge fill
        const thresholds = sections.map((_, i) => (i === 0 ? 0.01 : i / sections.length));
        // helper to clamp
        const clamp01 = (v) => Math.max(0, Math.min(1, v));

        tl.to({}, { duration: 1 }); // dummy tween to enable progress updates

        tl.eventCallback('onUpdate', () => {
          if (!tl.scrollTrigger) return;
          const p = tl.scrollTrigger.progress; // 0.0 ~ 1.0

          // update gauge
          if (progressRef.current) {
            gsap.set(progressRef.current, { width: `${Math.round(p * 100)}%` });
          }

          // for each slide, compute its local progress between start(threshold) and next threshold (or 1)
          for (let i = 0; i < sections.length; i++) {
            const start = thresholds[i];
            const end = i < sections.length - 1 ? thresholds[i + 1] : 1;
            const span = Math.max(1e-4, end - start);
            const q = clamp01((p - start) / span);

            // left: 100 -> -100 (up), right: -100 -> 100 (down)
            const yL = 100 + (-200) * q;
            const yR = -100 + (200) * q;
            // soft visibility (ease-in-out) — optional fade to avoid popping
            const vis = clamp01(q * (1 - q) * 4);

            const lEl = leftSlidesRef.current[i];
            const rEl = rightSlidesRef.current[i];
            if (lEl) gsap.set(lEl, { yPercent: yL });
            if (rEl) gsap.set(rEl, { yPercent: yR });
            if (lEl) gsap.set(lEl, { opacity: vis });
            if (rEl) gsap.set(rEl, { opacity: vis });
          }
        });
      }, parentRef);
    };

    setup();
    return () => ctx && ctx.revert();
  }, []);

  return (
    <div className={`${styles.parent} scene-content`} ref={parentRef} role="region" aria-label="Home section two">
        {/* Underlay: Home2 background (blue_gray_gradient.svg) */}
        <div className={styles.bgUnder} style={{ backgroundImage: `url(${gradient})` }} />
      {/* 왼쪽 컬럼 — 위로 스크롤(상향) */}
      <div className={styles.column}>
        <div className={styles.textContainer}>
          <div className={styles.vTrack} ref={leftTrackRef}>
            {sections.map((s, i) => (
              <div
                className={styles.textSlide}
                key={`l-${i}`}
                ref={(el) => (leftSlidesRef.current[i] = el)}
              >
                <p className={styles.title}>{s.title}</p>
                <p className={styles.desc}>{s.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 가운데 컬럼 — 로고 고정 */}
      <div className={styles.column}>
        <p className={styles.productLabel}>우리의 제품</p>
        <p className={styles.productLabelEn}>Our Products</p>

        <div className={styles.logoContainer}>
          <img ref={logoRef} src={logo} alt="Company Logo" className={styles.logo} />
        </div>

        {/* 진행바 */}
        <div className={styles.progressContainer}>
          <div ref={progressRef} className={styles.progressBar} />
        </div>
      </div>

      {/* 오른쪽 컬럼 — 아래로 스크롤(하향) */}
      <div className={styles.column}>
        <div className={styles.textContainer}>
          <div className={styles.vTrack} ref={rightTrackRef}>
            {sections.map((s, i) => (
              <div
                className={styles.textSlide}
                key={`r-${i}`}
                ref={(el) => (rightSlidesRef.current[i] = el)}
              >
                <p className={styles.text2}>{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home2;
