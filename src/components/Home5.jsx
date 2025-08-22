import React from 'react';
import styles from './Home5.module.css';

const Home5 = () => {
  return (
    <div className={styles.container}>
      {/* 로고 섹션 */}
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <div className={styles.iconPart1}></div>
            <div className={styles.iconPart2}></div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={styles.mainContent}>
        {/* EXPLORE 섹션 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>EXPLORE</h3>
          <div className={styles.linkList}>
            <a href="#" className={styles.link}>Principles</a>
            <a href="#" className={styles.link}>Perspectives</a>
            <a href="#" className={styles.link}>Portfolio</a>
            <a href="#" className={styles.link}>People</a>
          </div>
        </div>

        {/* PRODUCT 섹션 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>PRODUCT</h3>
          <div className={styles.linkList}>
            <a href="#" className={styles.link}>Blueprint</a>
            <a href="#" className={styles.link}>Benchmarks</a>
            <a href="#" className={styles.link}>Fragments</a>
          </div>
        </div>

        {/* OTHERS 섹션 */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>OTHERS</h3>
          <div className={styles.linkList}>
            <a href="#" className={styles.link}>Privacy Policy</a>
            <a href="#" className={styles.link}>Terms of Service</a>
            <a href="#" className={styles.link}>Cookie Policy</a>
            <a href="#" className={styles.link}>Disclaimers</a>
          </div>
        </div>
      </div>

      {/* 하단 연락처 정보 */}
      <div className={styles.contactInfo}>
        <div className={styles.locationGroup}>
          <div className={styles.location}>
            <h4 className={styles.cityName}>Seoul</h4>
            <p className={styles.address}>
              123 Gangnam-daero, Gangnam-gu, Seoul 06142,<br />
              South Korea
            </p>
            <a href="mailto:seoul@eyeofbreath.com" className={styles.email}>
              seoul@eyeofbreath.com
            </a>
          </div>

          <div className={styles.location}>
            <h4 className={styles.cityName}>Busan</h4>
            <p className={styles.address}>
              456 Haeundae-ro, Haeundae-gu, Busan 48094,<br />
              South Korea
            </p>
            <a href="mailto:busan@eyeofbreath.com" className={styles.email}>
              busan@eyeofbreath.com
            </a>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div className={styles.footer}>
        <p className={styles.copyright}>©2025, EYE OF BREATH</p>
      </div>
    </div>
  );
};

export default Home5;