import React from 'react';
import styles from './Home1.module.css';
import image from '../assets/image.png';

function Home1() {
    return (
        <div className={styles.container}>
            <div className={styles.textSection}>
                <h3 className={styles.title}>What is the goal of our project?</h3>
                <h6 className={styles.subtitle}>
                    It is to find a lung disease.<br/>
                    Then how?<br/>
                    Use ViT models to express and quantify areas of suspected disease.    
                </h6>
            </div>
            <div className={styles.imageSection}>
                <img src={image} alt="프로젝트 이미지" className={styles.projectImage} />
            </div>
        </div>
    );
}

export default Home1;