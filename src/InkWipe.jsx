// src/components/InkWipe.jsx
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './InkWipe.module.css';

/**
 * InkWipe
 * 물결 잉크처럼 텍스트가 드러나거나(=reveal) 지워지는(=erase) 효과
 *
 * props
 * - text: 표시할 텍스트
 * - mode: 'reveal' | 'erase'
 * - autoplay: 마운트 시 자동 재생 여부
 * - duration: 애니메이션 시간(초)
 * - delay: 시작 지연(초)
 * - angle: 진행 방향(도). 0=→, 90=↓
 * - softness: 가장자리 번짐(px)
 * - gap: 잉크 경계 두께(%)
 * - onComplete: 완료 콜백
 */
export default function InkWipe({
  text = 'defiant',
  mode = 'reveal',
  autoplay = true,
  duration = 1.1,
  delay = 0,
  angle = 18,
  softness = 28,
  gap = 12,
  onComplete,
}) {
  const wrapRef = useRef(null);
  const tlRef = useRef(null);

  useLayoutEffect(() => {
    const root = wrapRef.current;
    const ink = root.querySelector(`.${styles.ink}`);

    // 공통 초기값
    gsap.set(ink, {
      '--angle': `${angle}deg`,
      '--soft': `${softness}px`,
      '--gap': `${gap}%`,
    });

    const tl = gsap.timeline({
      paused: !autoplay,
      delay,
      onComplete,
      defaults: { duration, ease: 'power3.out' },
    });

    if (mode === 'reveal') {
      // 왼쪽/위쪽 바깥에서 안으로 쓸어와서 드러남
      gsap.set(ink, { '--pos': '-40%' });
      tl.to(ink, { '--pos': '100%' });
    } else {
      // erase: 반대방향으로 쓸어가며 지워짐
      gsap.set(ink, {
        '--pos': '-40%',
        '--angle': `${(angle + 180) % 360}deg`, // 진행 방향 반전
      });
      // 충분히 멀리 보내 완전히 지우기 (100%보다 더 가도 됨)
      tl.to(ink, { '--pos': '180%', ease: 'power3.in' });
    }

    tlRef.current = tl;
    return () => tl.kill();
  }, [mode, duration, delay, angle, softness, gap, autoplay, onComplete]);

  return (
    <span ref={wrapRef} className={styles.wrap} aria-label={text}>
      <span className={styles.ink}>{text}</span>
    </span>
  );
}