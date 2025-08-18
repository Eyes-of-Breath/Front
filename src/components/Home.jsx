import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import styles from './Home.module.css';
import logo from '../assets/logo.png';
import Home1 from './Home1';
import Home2 from './Home2';
import Home3 from './Home3';
import Home4 from './Home4';
import Home5 from './Home5';
// 추가: gsap import
import { gsap } from 'gsap';

function Home() {
  const navigate = useNavigate();
  const goToLogin = () => navigate('/login');

  const [currentSection, setCurrentSection] = useState(0);
  const [nextSection, setNextSection] = useState(1);
  // slideProgress 제거
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 추가: 슬라이드 ref
  const currentSlideRef = useRef(null);
  const nextSlideRef = useRef(null);

  const sections = ['Home1', 'Home2', 'Home3', 'Home4', 'Home5'];

  // 섹션 렌더링 함수 - Home2 완전 초기화
  const renderSection = (index) => {
    switch(index) {
      case 0: return <Home1 />;
      case 1: return <Home2 forceFirstSection={true} />;
      case 2: return <Home3 />;
      case 3: return <Home4 />;
      case 4: return <Home5 />;
      default: return <Home1 />;
    }
  };

  useEffect(() => {
    const wheelHandler = (e) => {
      if (currentSection === 1) {
        // Home2에서는 완전히 무시 - Home2가 모든 것을 처리
        console.log('Home2 active - Home.jsx ignoring all wheel events');
        return; // Home2가 모든 휠 이벤트 처리
      }
      e.preventDefault();
      e.stopPropagation();
      if (isTransitioning) return;
      const { deltaY } = e;

      if (deltaY > 0 && currentSection < sections.length - 1) {
        const target = currentSection + 1;
        setIsTransitioning(true);
        setNextSection(target);

        // 아래로 슬라이드: current 위로(-100%), next 0%
        if (currentSlideRef.current && nextSlideRef.current) {
          gsap.set(nextSlideRef.current, { y: '100%' });
          gsap.to(currentSlideRef.current, {
            y: '-100%',
            duration: 0.6,
            ease: 'power2.inOut'
          });
          gsap.to(nextSlideRef.current, {
            y: '0%',
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
              setCurrentSection(target);
              setIsTransitioning(false);
              // 위치 초기화
              gsap.set(currentSlideRef.current, { y: '0%' });
              gsap.set(nextSlideRef.current, { y: '0%' });
            }
          });
        } else {
          setTimeout(() => {
            setCurrentSection(target);
            setIsTransitioning(false);
          }, 600);
        }
      } else if (deltaY < 0 && currentSection > 0) {
        const target = currentSection - 1;
        setIsTransitioning(true);
        setNextSection(target);

        // 위로 슬라이드: current 아래로(100%), next 0%
        if (currentSlideRef.current && nextSlideRef.current) {
          gsap.set(nextSlideRef.current, { y: '-100%' });
          gsap.to(currentSlideRef.current, {
            y: '100%',
            duration: 0.6,
            ease: 'power2.inOut'
          });
          gsap.to(nextSlideRef.current, {
            y: '0%',
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
              setCurrentSection(target);
              setIsTransitioning(false);
              gsap.set(currentSlideRef.current, { y: '0%' });
              gsap.set(nextSlideRef.current, { y: '0%' });
            }
          });
        } else {
          setTimeout(() => {
            setCurrentSection(target);
            setIsTransitioning(false);
          }, 600);
        }
      }
    };

    const handleHome2Exit = (event) => {
      const { direction } = event.detail;
      if (direction === 'next' && currentSection === 1) {
        setIsTransitioning(true);
        setNextSection(2);
        if (currentSlideRef.current && nextSlideRef.current) {
          gsap.set(nextSlideRef.current, { y: '100%' });
          gsap.to(currentSlideRef.current, {
            y: '-100%',
            duration: 0.6,
            ease: 'power2.inOut'
          });
          gsap.to(nextSlideRef.current, {
            y: '0%',
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
              setCurrentSection(2);
              setIsTransitioning(false);
              gsap.set(currentSlideRef.current, { y: '0%' });
              gsap.set(nextSlideRef.current, { y: '0%' });
            }
          });
        } else {
          setTimeout(() => {
            setCurrentSection(2);
            setIsTransitioning(false);
          }, 600);
        }
      } else if (direction === 'prev' && currentSection === 1) {
        setIsTransitioning(true);
        setNextSection(0);
        if (currentSlideRef.current && nextSlideRef.current) {
          gsap.set(nextSlideRef.current, { y: '-100%' });
          gsap.to(currentSlideRef.current, {
            y: '100%',
            duration: 0.6,
            ease: 'power2.inOut'
          });
          gsap.to(nextSlideRef.current, {
            y: '0%',
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
              setCurrentSection(0);
              setIsTransitioning(false);
              gsap.set(currentSlideRef.current, { y: '0%' });
              gsap.set(nextSlideRef.current, { y: '0%' });
            }
          });
        } else {
          setTimeout(() => {
            setCurrentSection(0);
            setIsTransitioning(false);
          }, 600);
        }
      }
    };

    if (currentSection !== 1) {
      document.addEventListener("wheel", wheelHandler, { passive: false });
    }
    window.addEventListener("home2Exit", handleHome2Exit);

    return () => {
      document.removeEventListener("wheel", wheelHandler);
      window.removeEventListener("home2Exit", handleHome2Exit);
    };
  }, [currentSection, sections.length, isTransitioning]);

  // 다음 섹션 자동 계산
  useEffect(() => {
    if (currentSection < sections.length - 1) {
      setNextSection(currentSection + 1);
    } else {
      setNextSection(0);
    }
  }, [currentSection, sections.length]);

  return (
    <div className={styles.container}>
      {/* 상단 네비게이션 */}
      <div className={styles.toolbar}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" className={styles.logoIcon} />
          <h1 className={styles.logoText}>eye of breath</h1>
        </div>
        <button className={styles.loginButton} onClick={goToLogin}>
          로그인
        </button>
      </div>

      {/* 메인 콘텐츠 - 커튼 효과를 위한 2-레이어 */}
      <div className={styles.slideContainer}>
        {/* 현재 화면 */}
        <div 
          className={styles.currentSlide}
          ref={currentSlideRef}
          style={{
            zIndex: 10,
            backgroundColor: currentSection === 0 ? '#EEF2FF' : 
                           currentSection === 1 ? '#FFFFFF' : 
                           currentSection === 2 ? '#F0F9FF' : 
                           currentSection === 3 ? '#1E293B' : '#F8FAFC',
            height: 'calc(100vh - 70px)',
            overflow: 'hidden',
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0,
            // transform/transition 제거
          }}
        >
          {renderSection(currentSection)}
        </div>
        {/* 다음 화면 */}
        <div 
          className={styles.nextSlide}
          ref={nextSlideRef}
          style={{ 
            zIndex: 5,
            backgroundColor: nextSection === 0 ? '#EEF2FF' : 
                           nextSection === 1 ? '#FFFFFF' : 
                           nextSection === 2 ? '#F0F9FF' : 
                           nextSection === 3 ? '#1E293B' : '#F8FAFC',
            height: 'calc(100vh - 70px)',
            overflow: 'hidden',
            position: 'absolute',
            width: '100%',
            top: 0,
            left: 0,
          }}
        >
          <div style={{width: '100%', height: '100%', position: 'relative'}}>
            {renderSection(nextSection)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;