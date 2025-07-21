import React, { useState, useEffect } from 'react';
import styles from './Home2.module.css';
import logo from '../assets/logo.png';

function Home4() {
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
            {/* 왼쪽 컬럼 - 신뢰 */}
            <div className={styles.column}>
                <p className={`${styles.title} ${styles.fadeIn}`}>신뢰</p>
                <p className={`${styles.desc} ${styles.delayedFadeIn}`}>Trust</p>
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
                    AI 결과를 <span className={styles.highlight}>Grad-CAM, Attention Map</span> 등으로 시각화하여
                    의료진이 결과를 이해하고 <span className={styles.highlight}>신뢰할 수 있도록</span> 설계되었습니다.
                    검증된 AI와 시각화는 의료진뿐만 아니라 환자들에게도 <span className={styles.highlight}>신뢰를 주는 요소</span>입니다.
                </p>
            </div>
        </div>
    );
}

export default Home4;