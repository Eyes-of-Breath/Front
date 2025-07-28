import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Home2.module.css';
import logo from '../assets/logo.png';

gsap.registerPlugin(ScrollTrigger);

function Home3() {
    const containerRef = useRef(null);
    const leftColumnRef = useRef(null);
    const rightColumnRef = useRef(null);
    const centerColumnRef = useRef(null);

    useEffect(() => {
        const leftColumn = leftColumnRef.current;
        const rightColumn = rightColumnRef.current;
        const centerColumn = centerColumnRef.current;
        const container = containerRef.current;

        // 1. 모든 요소를 보이게 설정
        gsap.set([leftColumn, rightColumn, centerColumn], {
            opacity: 1,
            y: 0
        });

        // 2. 좌우 컬럼만 아래로 이동
        gsap.set([leftColumn, rightColumn], {
            y: 80,
            opacity: 0
        });

        // 3. 스크롤 트리거 설정
        ScrollTrigger.create({
            trigger: container,
            start: "top 70%",
            end: "bottom 30%",
            onEnter: () => {
                gsap.to(leftColumn, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                });
                
                gsap.to(rightColumn, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out",
                    delay: 0.2
                });
            },
            onLeave: () => {
                gsap.to([leftColumn, rightColumn], {
                    y: 80,
                    opacity: 0,
                    duration: 0.5
                });
            },
            onEnterBack: () => {
                gsap.to([leftColumn, rightColumn], {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.out"
                });
            },
            onLeaveBack: () => {
                gsap.to([leftColumn, rightColumn], {
                    y: 80,
                    opacity: 0,
                    duration: 0.5
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div ref={containerRef} className={styles.parent}>
            {/* 왼쪽 컬럼 - 비전 */}
            <div ref={leftColumnRef} className={styles.column}>
                <p className={styles.title}>비전</p>
                <p className={styles.desc}>Vision</p>
            </div>
            
            {/* 가운데 컬럼 - 고정 */}
            <div ref={centerColumnRef} className={styles.column}>
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
                    영상 인식의 의미뿐만 아니라, <span className={styles.highlight}>Vision Transformer 기반 AI 모델</span>이
                    핵심 기술로 들어가 있다는 점에서 의미를 지니고 있습니다.
                    환자 상태를 <span className={styles.highlight}>'보는 눈'</span>, 즉 의료진의 시각을 보조하는
                    <span className={styles.highlight}> 역할이라는 이중 의미</span>를 갖습니다.
                </p>
            </div>
        </div>
    );
}

export default Home3;