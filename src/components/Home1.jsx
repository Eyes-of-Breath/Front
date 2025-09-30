import React, { useRef, useLayoutEffect } from 'react';
import styles from './Home1.module.css';
import image from '../assets/hand.png';
import { ChevronDown } from "lucide-react"; // 화살표 아이콘
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Home1() {
  const root = useRef(null);
  const imgRef = useRef(null);

  useLayoutEffect(() => {
    let ctx;
    let tries = 0;
    const setup = () => {
      const triggerEl = root.current;
      const scrollerEl = document.getElementById('scroll-root');
      if (!triggerEl || !scrollerEl) {
        if (tries++ < 10) requestAnimationFrame(setup);
        return;
      }
      ctx = gsap.context(() => {
        gsap.fromTo(
          imgRef.current,
          { scale: 1, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: triggerEl,
              scroller: scrollerEl,
              start: "top 80%",
              once: true
            }
          }
        );
      }, root);
    };
    setup();
    return () => ctx && ctx.revert();
  }, []);

  return (
    <div ref={root} className={`${styles.container} scene-content`}>
      <div className={styles.bg}></div>
      <div className={styles.overlayText}>
        <h1>What is the goal of our project?</h1>
        <p>
          It is to find a lung disease.<br/>
          Use ViT to quantify areas of suspected disease.
        </p>
      </div>
      <div className={styles.centerImageWrap}>
        <img ref={imgRef} src={image} alt="프로젝트 이미지" className={styles.centerImage} />
      </div>
      <div className={styles.scrollHint}>
  <span>Scroll to discover</span>
  <ChevronDown className={styles.scrollIcon} />
</div>
    </div>
  );
}

export default Home1;