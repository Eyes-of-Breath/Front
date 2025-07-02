import React, { } from 'react';
import styles from './Patient.module.css';

function Patient() {

    return (
        <div className={styles.body}>
            <h1>환자 관리</h1>
            <div className={styles.Info}>
                <label htmlFor='patientID' className={styles.patientID}>환자 ID:</label>
                <input
                    type='text'
                    name='text'
                    placeholder='ID를 입력하세요'
                    className={styles.inputID}
                />
                <button className={styles.button}>환자 조회</button>
            </div>
        </div>
    );
}

export default Patient;