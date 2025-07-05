import React, { } from 'react';
import styles from './Home2.module.css';
import trust from '../assets/trust.png';

function Home4() {

    return (
        <div className={styles.parent}>
            <div className={styles.column}>
                <p className={styles.title}>신뢰</p>
                <p className={styles.desc}>Trust</p>
            </div>
            <div className={styles.column}>
                <img src={trust} alt='신뢰' className={styles.image} />
            </div>
            <div className={styles.column}>
                <p className={styles.text2}>
                    AI 결과를 Grad-CAM, Attention Map 등으로 시각화하여
                    의료진이 결과를 이해하고 신뢰할 수 있도록 설계되었습니다.
                    검증된 AI와 시각화는 의료진뿐만 아니라 환자들에게도 신뢰를 주는 요소입니다.
                </p>
            </div>
        </div>
    );
}

export default Home4;