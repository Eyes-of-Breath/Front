import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./Preloader.module.css";

export default function Preloader({ onDone, onReveal }) {
  const overlayRef = useRef(null);
  const textContainerRef = useRef(null);
  const gradientRef = useRef(null);
  const percentRef = useRef(null);
  const maskTextRef = useRef(null);
  
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const animationRef = useRef(null);

  console.log('[Preloader] progress:', progress);
  console.log('[Preloader] isExiting:', isExiting);

  // 프로그레스 애니메이션 (훅 대신 직접 구현)
  useEffect(() => {
    console.log('[Preloader] 🚀 프로그레스 시작');
    const duration = 1000; // 1초
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      if (newProgress < 100) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // 진행률에 따라 리빌/필 업데이트 (연출용)
  useEffect(() => {
    if (isExiting) return;
    const p = Math.max(0, Math.min(progress, 100));
    const scaleY = p / 100; // 0 -> 1
    const insetTop = 100 - p; // clip-path top

    if (gradientRef.current) {
      gsap.to(gradientRef.current, {
        scaleY,
        transformOrigin: 'bottom',
        duration: 0.2,
        ease: 'power2.out',
        overwrite: true
      });
    }

    if (maskTextRef.current) {
      gsap.to(maskTextRef.current, {
        clipPath: `inset(${insetTop}% 0% 0% 0%)`,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: true
      });
    }

    if (percentRef.current) {
      percentRef.current.textContent = `${Math.round(p)}%`;
    }
  }, [progress, isExiting]);

  // 100% 도달 시 exit 애니메이션
  useEffect(() => {
    if (progress >= 100 && !isExiting) {
      console.log('[Preloader] 🎉 100% 도달! Exit 시작');
      setIsExiting(true);
      const fadeOutDuration = 0.8;

      const tl = gsap.timeline({
        onComplete: () => {
          console.log('[Preloader] ✅ 애니메이션 완료');
          document.body.classList.remove('is-lock');
          document.body.classList.add('is-loaded');
          if (onDone) onDone();
          if (overlayRef.current) overlayRef.current.style.display = 'none';
        }
      });

      // onReveal 먼저 호출
      if (onReveal) {
        console.log('[Preloader] 🎬 onReveal 호출');
        onReveal();
      }

      // 텍스트와 퍼센트 페이드아웃
      tl.to([textContainerRef.current, percentRef.current, maskTextRef.current], {
        opacity: 0,
        duration: fadeOutDuration * 0.5,
        ease: 'power2.inOut'
      });

      // 오버레이 페이드아웃
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: fadeOutDuration,
        ease: 'power2.inOut'
      }, '-=0.2');
    }
  }, [progress, isExiting, onDone, onReveal]);

  // 마운트 시 초기화
  useEffect(() => {
    console.log('[Preloader] 🔒 마운트 - 초기화');
    document.body.classList.remove('is-loaded');
    document.body.classList.add('is-lock');

    if (overlayRef.current) {
      overlayRef.current.style.display = 'flex';
      overlayRef.current.style.opacity = '1';
      overlayRef.current.style.visibility = 'visible';
      overlayRef.current.style.pointerEvents = 'auto';
    }

    if (textContainerRef.current) {
      textContainerRef.current.style.opacity = '1';
    }

    if (gradientRef.current) {
      gsap.set(gradientRef.current, { scaleY: 0, transformOrigin: 'bottom' });
    }

    if (maskTextRef.current) {
      gsap.set(maskTextRef.current, { clipPath: 'inset(100% 0% 0% 0%)' });
    }

    if (percentRef.current) {
      percentRef.current.textContent = '0%';
      percentRef.current.style.opacity = '1';
    }

    return () => {
      console.log('[Preloader] 🔓 언마운트');
      document.body.classList.remove('is-lock');
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="status"
      aria-live="polite"
      aria-busy={progress < 100}
    >
      {/* 브랜드 텍스트 컨테이너 */}
      <div ref={textContainerRef} className={styles.textContainer}>
        {/* 회색 베이스 텍스트 */}
        <div className={styles.baseText} aria-hidden="true">
          EYE OF BREATH
        </div>

        {/* 퍼센트 채움 오버레이 */}
        <div ref={gradientRef} className={styles.gradient} />

        {/* 클리핑 리빌 텍스트 */}
        <div ref={maskTextRef} className={styles.maskText} aria-label="Eye of Breath">
          EYE OF BREATH
        </div>
      </div>

      {/* 퍼센트 표시 */}
      <div ref={percentRef} className={styles.percent}>0%</div>
    </div>
  );
}