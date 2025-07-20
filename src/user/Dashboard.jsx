import React from 'react';
import styles from './Dashboard.module.css';
import blueGradientBackground from '../assets/blue_gradient_background.svg';

function Dashboard() {
    // 사용자 이름 (실제로는 props나 context에서 가져올 수 있습니다)
    const userName = "Amanda";

    return (
        <div className={styles.body}>
            <h1 className={styles.greeting}>
                안녕하세요, {userName}님. 오늘 하루는 어떠신가요?
            </h1>
        </div>
    );
}

export default Dashboard;