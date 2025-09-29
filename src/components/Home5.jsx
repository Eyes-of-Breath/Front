import React from 'react';
import styles from './Home5.module.css';

const Home5 = () => {
  return (
    <div className={`${styles.container} scene-content`}>
      <div className={styles.footerContent}>
        {/* 왼쪽 섹션 */}
        <div className={styles.leftSection}>
          {/* 로고 */}
          <div className={styles.logoSection}>
            <div className={styles.logoIcon}>LOGO</div>
            <h2 className={styles.logoText}>EYE OF BREATH</h2>
          </div>

          {/* 설명 텍스트 */}
          <p className={styles.description}>
            프로젝트 팀원 소개 페이지
          </p>

          {/* CTA 버튼 */}
          <button className={styles.ctaButton}>
            팀원 정보 보기
          </button>

          {/* 소셜 아이콘 */}
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialIcon}>in</a>
            <a href="#" className={styles.socialIcon}>X</a>
            <a href="#" className={styles.socialIcon}>f</a>
          </div>
        </div>

        {/* 오른쪽 섹션 - 팀원 정보 */}
        <div className={styles.rightSection}>
          <div className={styles.teamGrid}>
            {/* 팀원 1 */}
            <div className={styles.teamMember}>
              <div className={styles.memberName}>류다현</div>
              <div className={styles.memberRole}>Project Leader</div>
              <div className={styles.memberEmail}>fbekgus413@skuniv.ac.kr</div>
            </div>

            {/* 팀원 2 */}
            <div className={styles.teamMember}>
              <div className={styles.memberName}>강지은</div>
              <div className={styles.memberRole}>Frontend Developer</div>
              <div className={styles.memberEmail}>kje147459@gachon.ac.kr</div>
            </div>

            {/* 팀원 3 */}
            <div className={styles.teamMember}>
              <div className={styles.memberName}>장준혁</div>
              <div className={styles.memberRole}>Backend Developer</div>
              <div className={styles.memberEmail}>joonsoon65@skuniv.ac.kr</div>
            </div>

            {/* 팀원 4 */}
            <div className={styles.teamMember}>
              <div className={styles.memberName}>조성은</div>
              <div className={styles.memberRole}>UI/UX Designer</div>
              <div className={styles.memberEmail}>shap2819@hs.ac.kr</div>
            </div>
          </div>

          {/* 뉴스레터 구독 */}
          <div className={styles.newsletter}>
            <h3 className={styles.newsletterTitle}>팀 소식 받아보기</h3>
            <div className={styles.newsletterForm}>
              <input 
                type="email" 
                placeholder="이메일을 입력하세요" 
                className={styles.emailInput}
              />
              <button className={styles.subscribeButton}>구독하기</button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 카피라이트 */}
      <div className={styles.copyright}>
        <span>© Copyright 2025. EYE OF BREATH. All rights reserved.</span>
        <span>Created by Team Members</span>
      </div>
    </div>
  );
};

export default Home5;