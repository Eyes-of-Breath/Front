import React, { } from 'react';
import styles from './Home2.module.css';

function Home2() {

    return (
        <div className={styles.parent}>
            <div className={styles.column}>
                <p className={styles.title}>비전</p>
                <p className={styles.desc}>Vision</p>
            </div>
            <div className={styles.column}>
                <p className={styles.text1}>이미지 첨부</p>
            </div>
            <div className={styles.column}>
                <p className={styles.text2}>
                    영상 인식의 의미뿐만 아니라, Vision Transformer 기반 AI 모델이
                    핵심 기술로 들어가 있다는 점에서 의미를 지니고 있습니다.
                    환자 상태를 '보는 눈', 즉 의료진의 시각을 보조하는
                    역할이라는 이중 의미를 갖습니다.
                </p>
            </div>
        </div>
    );
}

export default Home2;