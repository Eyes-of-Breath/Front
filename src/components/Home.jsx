import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from "react";
import styles from './Home.module.css';
import Home1 from './Home1';
import Home2 from './Home2';
import Home3 from './Home3';

function Home() {
  const navigate = useNavigate();
  const goToLogin = () => navigate('/login');

  const outerDivRef = useRef();
  const sectionRefs = useRef([]);

  const sections = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();
      const { deltaY } = e;
      const currentScroll = outerDivRef.current.scrollTop;

      const currentIndex = sectionRefs.current.findIndex(
        (el) =>
          Math.abs(el.offsetTop - currentScroll) < window.innerHeight / 2
      );

      let targetIndex = currentIndex;
      if (deltaY > 0 && currentIndex < sections.length - 1) {
        targetIndex++;
      } else if (deltaY < 0 && currentIndex > 0) {
        targetIndex--;
      }

      const targetElement = sectionRefs.current[targetIndex];
      if (targetElement) {
        outerDivRef.current.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth',
        });
      }

    };

    const outer = outerDivRef.current;
    outer.addEventListener("wheel", wheelHandler, { passive: false });

    return () => outer.removeEventListener("wheel", wheelHandler);
  }, [sections.length]);

  return (
    <div>
      <div className={styles.toolbar}>
        <h1>VITMED</h1>
        <p className={styles.title} onClick={goToLogin}>로그인</p>
      </div>
      <div ref={outerDivRef} className={styles.outer}>
        <div ref={(el) => sectionRefs.current[0] = el}><Home1 /></div>
        <div ref={(el) => sectionRefs.current[1] = el}><Home2 /></div>
        <div ref={(el) => sectionRefs.current[2] = el}><Home3 /></div>
        <div ref={(el) => sectionRefs.current[3] = el} className={styles.bg_gray}>4</div>
        <div ref={(el) => sectionRefs.current[4] = el} className={styles.bg_light_gray}>5</div>
        <div ref={(el) => sectionRefs.current[5] = el} className={styles.bg_gray}>6</div>
      </div>
    </div>
  );
}

export default Home;
