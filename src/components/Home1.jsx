import React, {  } from 'react';
import styles from './Home1.module.css';

function Home1() {

    return (
        <div className={styles.parent}>
            <h3>What is the goal of our project?</h3>
            <h6>
                It is to find a lung disease.<br/>
                Then how?<br/>
                Use ViT models to express and quantify areas of suspected disease.    
            </h6>
        </div>
    );
}

export default Home1;