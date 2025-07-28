import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Home2.module.css';
import logo from '../assets/logo.png';

// GSAP ScrollTrigger 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

const Home2 = () => {
    const containerRef = useRef(null);
    const leftColumnRef = useRef(null);
    const rightColumnRef = useRef(null);

    useEffect(() => {
        const leftColumn = leftColumnRef.current;
        const rightColumn = rightColumnRef.current;
        const container = containerRef.current;

        // 가운데 컬럼은 아예 건드리지 않음! (ref도 없음)
        
        if (!leftColumn || !rightColumn || !container) return;

        // 좌우 텍스트만 처음에 숨김 (가운데는 절대 건드리지 않음)
        gsap.set(leftColumn, {
            y: 60,
            opacity: 0
        });
        
        gsap.set(rightColumn, {
            y: 60,
            opacity: 0
        });

        // 스크롤 트리거 설정 - 각각 따로 설정
        ScrollTrigger.create({
            trigger: container,
            start: "top 80%",
            end: "bottom 20%",
            onEnter: () => {
                // 왼쪽 애니메이션
                gsap.to(leftColumn, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                });
            },
            onLeaveBack: () => {
                gsap.to(leftColumn, {
                    y: 60,
                    opacity: 0,
                    duration: 0.5
                });
            }
        });

        ScrollTrigger.create({
            trigger: container,
            start: "top 80%",
            end: "bottom 20%",
            onEnter: () => {
                // 오른쪽 애니메이션 (약간 지연)
                gsap.to(rightColumn, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: 0.2
                });
            },
            onLeaveBack: () => {
                gsap.to(rightColumn, {
                    y: 60,
                    opacity: 0,
                    duration: 0.5
                });
            }
        });

        // 클린업
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div ref={containerRef} className={styles.parent}>
            {/* 왼쪽 컬럼 - 진단 */}
            <div ref={leftColumnRef} className={styles.column}>
                <p className={styles.title}>진단</p>
                <p className={styles.desc}>Diagnosis</p>
            </div>
            
            {/* 가운데 컬럼 - 완전히 고정 (ref 없음, GSAP 제외) */}
            <div className={`${styles.column} ${styles.centerFixed}`}>
                <p className={styles.productLabel}>우리의 제품</p>
                <p className={styles.productLabelEn}>Our Products</p>
                <div className={styles.logoContainer}>
                    <img 
                        src={logo} 
                        alt="Company Logo" 
                        className={styles.logo}
                    />
                </div>
            </div>
            
            {/* 오른쪽 컬럼 - 설명 */}
            <div ref={rightColumnRef} className={styles.column}>
                <p className={styles.text2}>
                    <span className={styles.highlight}>폐렴, 결핵, 폐암</span> 등 다양한 폐 질환을
                    <span className={styles.highlight}> AI가 영상만으로 정확히 판별</span>하는 기능을 상징합니다.
                    전문의 부족이나 실수에 따른 오진 가능성을 줄여주는
                    <span className={styles.highlight}> 진단 보조 솔루션</span>으로 정체성을 담고 있습니다.
                </p>
            </div>
        </div>
    );
};

export default Home2;