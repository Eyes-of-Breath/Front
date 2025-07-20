import React, { useState, useEffect } from 'react';
import styles from './Home5.module.css';
import article1 from '../assets/article1.png';
import article2 from '../assets/article2.png';

function Home5() {
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

    const handleReadMore = (articleNumber) => {
        console.log(`기사 ${articleNumber} 더보기 클릭`);
        // 여기에 기사 상세 페이지로 이동하는 로직 추가
    };

    return (
        <div className={styles.parent}>
            {/* 왼쪽 컬럼 - 제목 */}
            <div className={styles.column1}>
                <p className={`${styles.title} ${styles.fadeIn}`}>주요 기사</p>
                <p className={`${styles.subtitle} ${styles.delayedFadeIn}`}>Latest News</p>
            </div>
            
            {/* 오른쪽 컬럼 - 기사들 */}
            <div className={styles.column2}>
                <div className={`${styles.newsRow} ${isVisible ? styles.visible : ''} ${styles.newsRow1}`}>
                    <div className={styles.imageWrapper}>
                        <img src={article1} alt="기사 이미지1" className={styles.image} />
                    </div>
                    <div className={styles.newsText}>
                        <p className={styles.date}>March 5, 2025</p>
                        <h2 className={styles.newsTitle}>고려대의료원, HIMSS 2025에서 의료 IT 최신 트렌드 공유</h2>
                        <p className={styles.newsContent}>
                            고려대의료원은 3월 미국 라스베이거스에서 열린 세계 최대
                            의료 IT 컨퍼런스 'HIMSS 2025'에 참가하여 <span className={styles.highlight}>클라우드 기반
                            의료 시스템과 AI 솔루션</span>을 소개했습니다.
                        </p>
                        <button 
                            className={styles.button}
                            onClick={() => handleReadMore(1)}
                        >
                            더 보기
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>
                
                <div className={`${styles.newsRow} ${isVisible ? styles.visible : ''} ${styles.newsRow2}`}>
                    <div className={styles.imageWrapper}>
                        <img src={article2} alt="기사 이미지2" className={styles.image} />
                    </div>
                    <div className={styles.newsText}>
                        <p className={styles.date}>March 20, 2025</p>
                        <h2 className={styles.newsTitle}>AI와 디지털 기술, 의료의 일상이 되다</h2>
                        <p className={styles.newsContent}>
                            지난 3월 서울 코엑스에서 열린 '메디컬 코리아 2025'에서는
                            <span className={styles.highlight}>인공지능(AI), 사물 인터넷(IoT), 클라우드 기술</span>을 기반으로 한
                            미래 병원의 모습이 소개되었습니다.
                        </p>
                        <button 
                            className={styles.button}
                            onClick={() => handleReadMore(2)}
                        >
                            더 보기
                            <span className={styles.arrowIcon}>→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home5;