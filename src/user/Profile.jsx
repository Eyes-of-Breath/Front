import React, { } from 'react';
import styles from './Profile.module.css';
import profile from '../assets/profile.jpg';

function Profile() {

    return (
        <div className={styles.body}>
            <h1>프로필</h1>
            <div className={styles.profileArea}>
                <img src={profile} alt='프로필 이미지' className={styles.profile_image} />
                <div className={styles.infoArea}>
                    <p className={styles.name}>강지은</p>
                    <p className={styles.email}>abc1234@gmail.com</p>
                </div>
            </div>
            <hr className={styles.divider}/>
            <div className={styles.textBox}>
                <p className={styles.blackText}>닉네임 변경하기</p>
                <p className={styles.blackText}>비밀번호 변경하기</p>
                <p className={styles.redText}>저장된 이력 모두 지우기</p>
            </div>
        </div>
    );
}

export default Profile;