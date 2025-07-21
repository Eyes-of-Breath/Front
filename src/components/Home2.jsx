import React, { useState, useEffect } from 'react';
import styles from './Home2.module.css';
import logo from '../assets/logo.png';

const Home2 = () => {
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
            {/* 왼쪽 컬럼 - 진단 */}
            <div className={styles.column}>
                <p className={`${styles.title} ${styles.fadeIn}`}>진단</p>
                <p className={`${styles.desc} ${styles.delayedFadeIn}`}>Diagnosis</p>
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