import React, { useState, useEffect } from 'react';
import styles from './Home2.module.css';
import logo from '../assets/logo.png';

function Home3() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const element = document.querySelector(`.${styles.parent}`);
        if (element) {
            observer.observe(element);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className={styles.parent}>
            {/* 왼쪽 컬럼 - 비전 */}
            <div className={styles.column}>
                <p className={`${styles.title} ${styles.fadeIn}`}>비전</p>
                <p className={`${styles.desc} ${styles.delayedFadeIn}`}>Vision</p>
            </div>
            
            {/* 가운데 컬럼 - 우리의 제품 + 로고 */}
            <div className={styles.column}>
                <p className={`${styles.productLabel} ${styles.fadeIn}`}>우리의 제품</p>
                <p className={`${styles.productLabelEn} ${styles.fadeIn}`}>Our Products</p>
                <div 
                    className={`${styles.logoContainer} ${isVisible ? styles.visible : ''}`}
                    style={{ opacity: 1 }}
                >
                    <img 
                        src={logo} 
                        alt="Company Logo" 
                        className={styles.logo}
                    />
                </div>
            </div>
            
            {/* 오른쪽 컬럼 - 설명 */}
            <div className={styles.column}>
                <p className={`${styles.text2} ${styles.extraDelayedFadeIn}`}>
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