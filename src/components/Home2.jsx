import React, { useRef, useLayoutEffect } from 'react';
import styles from './Home2.module.css';
import logo from '../assets/logo.png';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Home2 = () => {
  const parentRef = useRef(null);
  const leftTrackRef = useRef(null);
  const rightTrackRef = useRef(null);
  const logoRef = useRef(null);
  const progressRef = useRef(null);
  const leftSlidesRef = useRef([]);
  const rightSlidesRef = useRef([]);
  
  // 섹션 번호 ref 추가
  const currentSectionRef = useRef(null);
  const nextSectionRef = useRef(null);

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
    let lastCurrentSection = 0; // 이전 섹션 추적

    const setup = () => {
      const trigger = parentRef.current;
      if (!trigger || !leftTrackRef.current || !rightTrackRef.current) {
        if (tries++ < 10) requestAnimationFrame(setup);
        return;
      }

      ctx = gsap.context(() => {
        // 스크롤/핀 상수 (다른 곳에서도 사용)
        const PIN_SPAN = 4.0; // 섹션을 핀으로 고정하는 스크롤 길이(뷰포트의 400%)
        const SCRUB = 0.3;    // 스크럽 강도

        // 컨테이너 표시
        gsap.set(parentRef.current, { autoAlpha: 1, clearProps: 'opacity,visibility' });

        // 각 슬라이드를 절대배치로 겹치게 설정
        const slideGroups = [leftSlidesRef.current, rightSlidesRef.current];
        slideGroups.forEach((group) => {
          group.forEach((el, i) => {
            if (!el) return;
            gsap.set(el, {
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: sections.length - i,
              willChange: 'transform',
              autoAlpha: 1
            });
          });
        });

        // 초기 위치 설정
        slideGroups.forEach((group) => {
          group.forEach((el, i) => {
            if (!el) return;
            gsap.set(el, { yPercent: i === 0 ? 0 : 100, autoAlpha: 1 });
          });
        });

        // 초기 섹션 번호 설정
        if (currentSectionRef.current) {
          currentSectionRef.current.textContent = '01';
        }
        if (nextSectionRef.current) {
          nextSectionRef.current.textContent = '02';
        }

        // 애니메이션 설정

        const tl = gsap.timeline({
          defaults: { ease: 'power2.out' },
          scrollTrigger: {
            trigger,
            start: 'top top',
            end: `+=${PIN_SPAN * 100}%`,
            scrub: SCRUB,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const progress = self.progress;
              
              // 진행바 업데이트
              if (progressRef.current) {
                gsap.set(progressRef.current, { width: `${Math.round(progress * 100)}%` });
              }

              // 현재 활성 섹션 계산
              const sectionProgress = progress * sections.length;
              const currentSection = Math.floor(sectionProgress);
              const sectionLocalProgress = sectionProgress - currentSection;

              // 섹션 번호 업데이트 (섹션이 바뀔 때만 애니메이션)
              if (currentSection !== lastCurrentSection) {
                const currentNum = String(currentSection + 1).padStart(2, '0');
                // 마지막 섹션일 때는 특별한 표시
                const isLastSection = currentSection >= sections.length - 1;
                
                // 마지막 섹션에 도달했을 때는 애니메이션 하지 않음
                if (currentSection >= sections.length - 1 && lastCurrentSection >= sections.length - 1) {
                  return;
                }
                
                // 롤링 슬라이드 애니메이션 효과
                if (currentSectionRef.current && nextSectionRef.current) {
                  // 현재 섹션 번호 롤링 애니메이션
                  gsap.to(currentSectionRef.current, {
                    y: -20,
                    opacity: 0,
                    duration: 0.15,
                    ease: 'power2.in',
                    onComplete: () => {
                      currentSectionRef.current.textContent = currentNum;
                      gsap.fromTo(currentSectionRef.current, 
                        { y: 20, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' }
                      );
                    }
                  });
                  
                  // 다음 섹션 번호/아이콘 롤링 애니메이션 (약간의 딜레이)
                  gsap.to(nextSectionRef.current, {
                    y: -20,
                    opacity: 0,
                    duration: 0.15,
                    delay: 0.05,
                    ease: 'power2.in',
                    onComplete: () => {
                      if (isLastSection) {
                        // 마지막 섹션일 때 특별한 기호와 아이콘 표시
                        nextSectionRef.current.innerHTML = '<span class="' + styles.sparkleSymbol + '">✦</span>';
                      } else {
                        const nextNum = String(Math.min(currentSection + 2, sections.length)).padStart(2, '0');
                        nextSectionRef.current.textContent = nextNum;
                      }
                      gsap.fromTo(nextSectionRef.current, 
                        { y: 20, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.15, ease: 'power2.out' }
                      );
                    }
                  });
                }
                lastCurrentSection = currentSection;
              }

              // 각 섹션의 슬라이드 위치 업데이트
              sections.forEach((_, i) => {
                const leftEl = leftSlidesRef.current[i];
                const rightEl = rightSlidesRef.current[i];

                const setBoth = (y) => {
                  if (leftEl) gsap.set(leftEl, { yPercent: y, autoAlpha: 1 });
                  if (rightEl) gsap.set(rightEl, { yPercent: y, autoAlpha: 1 });
                };

                if (i < currentSection) {
                  setBoth(-100);
                } else if (i === currentSection) {
                  setBoth(-sectionLocalProgress * 100);
                } else if (i === currentSection + 1) {
                  setBoth(100 - sectionLocalProgress * 100);
                } else {
                  setBoth(100);
                }
              });
            }
          }
        });

        // 더미 애니메이션
        tl.to({}, { duration: 1 });

        // 중앙 로고 애니메이션
        if (logoRef.current) {
          gsap.fromTo(
            logoRef.current,
            { yPercent: 1, scale: 0.98 },
            {
              yPercent: 0,
              scale: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger,
                start: 'top top',
                end: `+=${PIN_SPAN * 100}%`,
                scrub: SCRUB,
              }
            }
          );
        }

      }, parentRef);
    };

    setup();
    return () => ctx && ctx.revert();
  }, []);

  return (
    <section ref={parentRef} className={`${styles.parent} scene-content`} role="region" aria-label="Home section two">
      {/* 배경 */}
      <div className={styles.bgUnder} aria-hidden="true" />

      {/* 좌열 */}
      <div className={`${styles.column} ${styles.leftCol}`}>
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

      {/* 중앙: 로고/레이블 고정 */}
      <div className={`${styles.column} ${styles.centerCol}`}>
        <p className={styles.productLabel}>우리의 제품</p>
        <p className={styles.productLabelEn}>Our Products</p>

        <div className={styles.logoContainer}>
          <img ref={logoRef} src={logo} alt="Company Logo" className={styles.logo} />
        </div>

        {/* 진행바와 섹션 번호 */}
        <div className={styles.progressSection}>
          <span ref={currentSectionRef} className={styles.sectionNumber}>01</span>
          <div className={styles.progressContainer}>
            <div ref={progressRef} className={styles.progressBar} />
          </div>
          <span ref={nextSectionRef} className={styles.sectionNumber}>02</span>
        </div>
      </div>

      {/* 우열 */}
      <div className={`${styles.column} ${styles.rightCol}`}>
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
    </section>
  );
};

export default Home2;