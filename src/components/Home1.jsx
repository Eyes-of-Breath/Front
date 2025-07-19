import React, { } from 'react';
import styles from './Home1.module.css';
import diagnosis from '../assets/home1_diagnosis.png'

function Home1() {

    return (
        <div className={styles.parent}>
            <div>
                <img src={diagnosis} alt='진단' className={styles.image} />
            </div>
            <div className={styles.text}>
                <p className={styles.text2}>
                    What is the goal of our project?<br />
                    It is to find <b>a lung disease.</b><br />
                    Then how?<br />
                    Use <b>ViT models</b> to express and quantify<br />
                    areas of suspected disease.
                </p>
            </div>
        </div>
    );
}

export default Home1;