import React, { } from 'react';
import styles from './Home2.module.css';
import diagnosis from '../assets/diagnosis.png';

function Home2() {

    return (
        <div className={styles.parent}>
            <div className={styles.column}>
                <p className={styles.title}>진단</p>
                <p className={styles.desc}>Diagnosis</p>
            </div>
            <div className={styles.column}>
                <img src={diagnosis} alt='진단' className={styles.image} />
            </div>
            <div className={styles.column}>
                <p className={styles.text2}>
                    폐렴, 결핵, 폐암 등 다양한 폐 질환을
                    AI가 영상만으로 정확히 판별하는 기능을 상징합니다.
                    전문의 부족이나 실수에 따른 오진 가능성을 줄여주는
                    진단 보조 솔루션으로 정체성을 담고 있습니다.
                </p>
            </div>
        </div>
    );
}

export default Home2;