import React, { useState, useEffect, useRef } from 'react';
import styles from './Home2.module.css';
import logo from '../assets/logo.png';
import { gsap } from 'gsap';

const Home2 = ({ forceFirstSection = true }) => {
    const [currentSection, setCurrentSection] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const mountTimeRef = useRef(Date.now());

    const leftTextRef = useRef(null);
    const rightTextRef = useRef(null);
    const lastWheelTime = useRef(0);

    const sections = [
        {
            title: '진단',
            subtitle: 'DIAGNOSIS',
            content: '폐렴, 결핵, 폐암 등 다양한 폐 질환을 AI가 영상만으로 정확히 판별하는 기능을 상징합니다. 전문의 부족이나 실수에 따른 오진 가능성을 줄여주는 진단 보조 솔루션으로 정체성을 담고 있습니다.'
        },
        {
            title: '비전',
            subtitle: 'VISION',
            content: '영상 인식의 의미뿐만 아니라, Vision Transformer 기반 AI 모델이 핵심 기술로 들어가 있다는 점에서 의미를 지니고 있습니다. 환자 상태를 \'보는 눈\', 즉 의료진의 시각을 보조하는 역할이라는 이중 의미를 갖습니다.'
        },
        {
            title: '신뢰',
            subtitle: 'TRUST',
            content: 'AI 결과를 Grad-CAM, Attention Map 등으로 시각화하여 의료진이 결과를 이해하고 신뢰할 수 있도록 설계되었습니다. 검증된 AI와 시각화는 의료진뿐만 아니라 환자들에게도 신뢰를 주는 요소입니다.'
        }
    ];

    useEffect(() => {
        setCurrentSection(0);
        setIsTransitioning(false);
        
        setTimeout(() => {
            setCurrentSection(0);
        }, 0);
    }, []);

    useEffect(() => {
        if (forceFirstSection) {
            setCurrentSection(0);
            setIsTransitioning(false);
        }
    }, [forceFirstSection]);

    const handleSectionChange = (newSection) => {
        if (isTransitioning) return;

        setIsTransitioning(true);

        // 이동 방향 계산
        const direction = newSection > currentSection ? -1 : 1;
        const outY = direction * window.innerHeight; // 화면 높이만큼 이동
        // 화면 밖으로 완전히 이동하려면 vw 단위 사용
        const outVW = direction * 100; // -100(위), +100(아래)

        if (leftTextRef.current && rightTextRef.current) {
            gsap.to(leftTextRef.current, {
                y: `${outVW}vw`,
                opacity: 0,
                duration: 0.6,
                ease: "power2.in"
            });
            gsap.to(rightTextRef.current, {
                y: `${outVW}vw`,
                opacity: 0,
                duration: 0.6,
                ease: "power2.in"
            });
        }

        setTimeout(() => {
            setCurrentSection(newSection);

            setTimeout(() => {
                if (leftTextRef.current && rightTextRef.current) {
                    // 반대 방향에서 들어오도록
                    gsap.fromTo(leftTextRef.current,
                        { y: `${-outVW}vw`, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
                    );
                    gsap.fromTo(rightTextRef.current,
                        { y: `${-outVW}vw`, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
                    );
                }
                setIsTransitioning(false);
            }, 10);
        }, 600);
    };

    useEffect(() => {
        const wheelHandler = (e) => {
            const now = Date.now();
            if (isTransitioning || now - lastWheelTime.current < 700) {
                // 0.7초 이내 추가 입력 무시
                return;
            }
            lastWheelTime.current = now;

            e.preventDefault();
            e.stopPropagation();
            
            if (e.deltaY > 0) {
                if (currentSection < sections.length - 1) {
                    handleSectionChange(currentSection + 1);
                } else {
                    const exitEvent = new CustomEvent('home2Exit', {
                        detail: { direction: 'next' }
                    });
                    window.dispatchEvent(exitEvent);
                }
            } else if (e.deltaY < 0) {
                if (currentSection > 0) {
                    handleSectionChange(currentSection - 1);
                } else {
                    const exitEvent = new CustomEvent('home2Exit', {
                        detail: { direction: 'prev' }
                    });
                    window.dispatchEvent(exitEvent);
                }
            }
        };

        document.addEventListener('wheel', wheelHandler, { passive: false });

        return () => {
            document.removeEventListener('wheel', wheelHandler);
        };
    }, [currentSection, sections.length, isTransitioning]);

    return (
        <div className={styles.parent}>
            {/* 왼쪽 컬럼 - 제목들 */}
            <div className={styles.column}>
                <div className={styles.textContainer}>
                    {/* 현재 텍스트 */}
                    <div
                        className={`${styles.textSlide} ${styles.currentText}`}
                        key={`current-${currentSection}-${mountTimeRef.current}`}
                        ref={leftTextRef}
                    >
                        <p className={styles.title}>
                            {sections[currentSection].title}
                        </p>
                        <p className={styles.desc}>
                            {sections[currentSection].subtitle}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* 가운데 컬럼 - 로고와 진행바 */}
            <div className={styles.column}>
                <p className={styles.productLabel}>우리의 제품</p>
                <p className={styles.productLabelEn}>Our Products</p>
                
                <div className={styles.logoContainer}>
                    <img 
                        src={logo} 
                        alt="Company Logo" 
                        className={styles.logo}
                    />
                </div>
                
                {/* 진행바 */}
                <div className={styles.progressContainer}>
                    <div 
                        className={styles.progressBar}
                        style={{ 
                            width: `${((currentSection + 1) / sections.length) * 100}%` 
                        }}
                    />
                </div>
                
                {/* 현재 섹션 표시 */}
                <div className={styles.sectionIndicator}>
                    {currentSection + 1} / {sections.length}
                </div>
            </div>
            
            {/* 오른쪽 컬럼 - 설명 */}
            <div className={styles.column}>
                <div className={styles.textContainer}>
                    {/* 현재 텍스트 */}
                    <div
                        className={`${styles.textSlide} ${styles.currentText}`}
                        key={`content-current-${currentSection}-${mountTimeRef.current}`}
                        ref={rightTextRef}
                    >
                        <p className={styles.text2}>
                            {sections[currentSection].content}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home2;