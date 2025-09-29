import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Home2 ~ Home5 구간 동안 body.header-red 유지
 * - startTrigger: Home2의 루트 요소
 * - endTrigger:   Home5의 루트 요소
 *
 * 섹션들에 id가 없다면, 아래 셀렉터를 data-attr로 바꿔도 됩니다.
 */
export default function HeaderColorTrigger() {
  useEffect(() => {
    const startEl = document.querySelector('#home2');
    const endEl   = document.querySelector('#home5');

    if (!startEl || !endEl) {
      // 필요한 엘리먼트를 못 찾으면 아무것도 하지 않음
      return;
    }

    // 기존 동일 id 트리거가 있으면 제거(중복 방지)
    const prev = ScrollTrigger.getById('header-color-h2toh5');
    if (prev) prev.kill();

    const trigger = ScrollTrigger.create({
      id: 'header-color-h2toh5',
      trigger: startEl,
      start: 'top 80%',          // Home2가 뷰포트 80% 지점에 들어오면 ON
      endTrigger: endEl,
      end: 'bottom bottom',      // Home5의 바닥이 뷰포트 바닥에 닿을 때까지 유지
      scrub: 0.3,                // 스르륵
      anticipatePin: 1,
      invalidateOnRefresh: true, // iOS 주소창/리사이즈 등 레이아웃 변화 대응
      toggleClass: {             // onEnter/Leave 대신 ScrollTrigger가 클래스 토글을 관리
        targets: document.body,
        className: 'header-red'
      }
    });

    ScrollTrigger.refresh();

    return () => {
      document.body.classList.remove('header-red');
      trigger.kill();
    };
  }, []);

  return null;
}