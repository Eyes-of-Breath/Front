import React, { } from 'react';
import styles from './Home5.module.css';
import article1 from '../assets/article1.png';
import article2 from '../assets/article2.png';

function Home5() {

    return (
        <div className={styles.parent}>
            <div className={styles.column1}>
                <p className={styles.title}>주요 기사</p>
            </div>
            <div className={styles.column2}>
                <div className={styles.news_row}>
                    <img src={article1} alt='기사 이미지1' className={styles.image} />
                    <div className={styles.news_text}>
                        <p>March 5, 2025</p>
                        <h1 className={styles.news_title}>고려대의료원, HIMSS 2025에서 의료 IT 최신 트렌드 공유</h1>
                        <p>
                            고려대의료원은 3월 미국 라스베이거스에서 열린 세계 최대
                            의료 IT 컨퍼런스 'HIMSS 2025'에 참가하여 클라우드 기반
                            의료 시스템과 AI 솔루션을 소개했습니다.
                        </p>
                        <button className={styles.button}>더 보기</button>
                    </div>
                </div>
                <div className={styles.news_row}>
                    <img src={article2} alt='기사 이미지2' className={styles.image} />
                    <div className={styles.news_text}>
                        <p>March 20, 2025</p>
                        <h1 className={styles.news_title}>AI와 디지털 기술, 의료의 일상이 되다</h1>
                        <p>
                            지난 3월 서울 코엑스에서 열린 '메디컬 코리아 2025'에서는
                            인공지능(AI), 사물 인터넷(IoT), 클라우드 기술을 기반으로 한
                            미래 병원의 모습이 소개되었습니다.
                        </p>
                        <button className={styles.button}>더 보기</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home5;