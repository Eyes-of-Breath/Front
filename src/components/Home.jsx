import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from "react";
import styles from './Home.module.css';
import Home1 from './Home1';
import Home2 from './Home2';
import Home3 from './Home3';
import Home4 from './Home4';
import Home5 from './Home5';
import logo from '../assets/logo.png'; // 로고 이미지 import

function Home() {
  const navigate = useNavigate();
  const goToLogin = () => navigate('/login');

  const outerDivRef = useRef();
  const sectionRefs = useRef([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const sections = [1, 2, 3, 4, 5]; // 실제 섹션 수에 맞게 수정

  // 스크롤 위치 업데이트
  const updateCurrentSection = useCallback(() => {
    const currentScroll = outerDivRef.current.scrollTop;
    const newIndex = sectionRefs.current.findIndex(
      (el) => Math.abs(el.offsetTop - currentScroll) < window.innerHeight / 2
    );
    if (newIndex !== -1 && newIndex !== currentSection) {
      setCurrentSection(newIndex);
    }
  }, [currentSection]);

  // 특정 섹션으로 이동
  const scrollToSection = useCallback((targetIndex) => {
    if (isScrolling || targetIndex < 0 || targetIndex >= sections.length) return;
    
    setIsScrolling(true);
    const targetElement = sectionRefs.current[targetIndex];
    
    if (targetElement) {
      outerDivRef.current.scrollTo({
        top: targetElement.offsetTop,
        behavior: 'smooth',
      });
      
      // 스크롤 완료 후 상태 업데이트
      setTimeout(() => {
        setIsScrolling(false);
        setCurrentSection(targetIndex);
      }, 800); // 애니메이션 시간에 맞춤
    }
  }, [isScrolling, sections.length]);

  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();
      
      if (isScrolling) return; // 스크롤 중이면 무시
      
      const { deltaY } = e;
      let targetIndex = currentSection;
      
      if (deltaY > 0 && currentSection < sections.length - 1) {
        targetIndex = currentSection + 1;
      } else if (deltaY < 0 && currentSection > 0) {
        targetIndex = currentSection - 1;
      }
      
      if (targetIndex !== currentSection) {
        scrollToSection(targetIndex);
      }
    };

    // 키보드 네비게이션 추가
    const keyHandler = (e) => {
      if (isScrolling) return;
      
      switch(e.key) {
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          scrollToSection(currentSection + 1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          scrollToSection(currentSection - 1);
          break;
        case 'Home':
          e.preventDefault();
          scrollToSection(0);
          break;
        case 'End':
          e.preventDefault();
          scrollToSection(sections.length - 1);
          break;
      }
    };

    const outer = outerDivRef.current;
    outer.addEventListener("wheel", wheelHandler, { passive: false });
    document.addEventListener("keydown", keyHandler);

    return () => {
      outer.removeEventListener("wheel", wheelHandler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, [currentSection, isScrolling, scrollToSection, sections.length]);

  // 리사이즈 핸들러
  useEffect(() => {
    const resizeHandler = () => {
      // 현재 섹션으로 다시 스크롤
      if (sectionRefs.current[currentSection]) {
        outerDivRef.current.scrollTo({
          top: sectionRefs.current[currentSection].offsetTop,
          behavior: 'auto',
        });
      }
    };

    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [currentSection]);

  return (
    <div>
      {/* 네비게이션 바 */}
      <div className={styles.toolbar}>
        <div className={styles.logoSection}>
          <img src={logo} alt="로고" className={styles.logoImg} />
          <span className={styles.brandName}>eye of breath</span>
        </div>
        <div className={styles.navButtons}>
          <p className={styles.title} onClick={goToLogin}>로그인</p>
        </div>
      </div>

      {/* 섹션 인디케이터 */}
      <div className={styles.sectionIndicator}>
        {sections.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${currentSection === index ? styles.active : ''}`}
            onClick={() => scrollToSection(index)}
            aria-label={`섹션 ${index + 1}로 이동`}
          />
        ))}
      </div>

      {/* 메인 콘텐츠 */}
      <div ref={outerDivRef} className={styles.outer}>
        <div ref={(el) => sectionRefs.current[0] = el} className={styles.section}>
          <Home1 />
        </div>
        <div ref={(el) => sectionRefs.current[1] = el} className={styles.section}>
          <Home2 />
        </div>
        <div ref={(el) => sectionRefs.current[2] = el} className={styles.section}>
          <Home3 />
        </div>
        <div ref={(el) => sectionRefs.current[3] = el} className={styles.section}>
          <Home4 />
        </div>
        <div ref={(el) => sectionRefs.current[4] = el} className={styles.section}>
          <Home5 />
        </div>
      </div>

      {/* 스크롤 힌트 (첫 번째 섹션에서만) */}
      {currentSection === 0 && (
        <div className={styles.scrollHint}>
          <span>스크롤하여 더 보기</span>
          <div className={styles.scrollArrow}>↓</div>
        </div>
      )}
    </div>
  );
}

export default Home;