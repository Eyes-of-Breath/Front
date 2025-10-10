import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeaderColorTrigger() {
  useEffect(() => {
    const home2 = document.querySelector('#home2');
    const home5 = document.querySelector('#home5');

    if (!home2 || !home5) {
      console.warn('home2 또는 home5 요소를 찾을 수 없습니다');
      return;
    }

    // 기존 트리거 제거
    ScrollTrigger.getById('header-red-trigger')?.kill();

    // Home2 시작점부터 Home5 끝점까지 header-red 활성화
    ScrollTrigger.create({
      id: 'header-red-trigger',
      trigger: home2,
      start: 'top 20%',
      endTrigger: home5,
      end: 'bottom center',
      
      onEnter: () => document.body.classList.add('header-red'),
      onLeave: () => document.body.classList.remove('header-red'),
      onEnterBack: () => document.body.classList.add('header-red'),
      onLeaveBack: () => document.body.classList.remove('header-red'),
      
      // markers: true  // 디버깅할 때 주석 해제
    });

    return () => {
      document.body.classList.remove('header-red');
      ScrollTrigger.getById('header-red-trigger')?.kill();
    };
  }, []);

  return null;
}