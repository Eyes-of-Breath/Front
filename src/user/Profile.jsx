import React, { useState } from 'react';
import styles from './Profile.module.css'; // CSS Module import
import { User, Lock, Trash2, Stethoscope, Building, Mail, BarChart3, Calendar, TrendingUp } from 'lucide-react';
import profile from '../assets/profile.jpg';

const Profile = () => {
    const [userStats] = useState({
        totalDiagnoses: 147,
        thisMonth: 23,
        avgAccuracy: 94.2
    });

    const [doctorInfo] = useState({
        name: '강지은',
        email: 'abc1234@gmail.com',
        department: '내과 · 호흡기내과',
        hospital: '서울대학교병원',
        experience: '8년차'
    });

    const handleProfileEdit = () => {
        console.log('프로필 수정 클릭');
        alert('프로필 수정 기능이 실행됩니다.');
    };

    const handlePasswordChange = () => {
        console.log('비밀번호 변경 클릭');
        alert('비밀번호 변경 페이지로 이동합니다.');
    };

    const handleClearHistory = () => {
        const confirmClear = window.confirm('정말로 진단 이력을 삭제하시겠습니까?');
        if (confirmClear) {
            console.log('이력 삭제 확인됨');
            alert('진단 이력이 삭제되었습니다.');
        }
    };

    return (
        <div className={styles.profileContainer}>
            <main className={styles.mainContent}>
                <div className={styles.pageTitle}>
                    의료진 프로필을 관리하세요.
                </div>
                
                {/* 상단 카드: 프로필 정보 + 통계 */}
                <div className={styles.profileCard}>
                    <div className={styles.profileHeader}>
                        <div className={styles.profileImageContainer}>
                            <img 
                                src={profile} 
                                alt="프로필 이미지" 
                                className={styles.profileImage} 
                            />
                        </div>
                        <div className={styles.profileInfo}>
                            <h1 className={styles.doctorName}>{doctorInfo.name} 선생님</h1>
                            <div className={styles.doctorDetails}>
                                <div className={styles.detailItem}>
                                    <Mail size={18} />
                                    <span>{doctorInfo.email}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <Stethoscope size={18} />
                                    <span>{doctorInfo.department}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <Building size={18} />
                                    <span>{doctorInfo.hospital} · {doctorInfo.experience}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.statsContainer}>
                        <h3 className={styles.statsTitle}>진단 통계</h3>
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    <BarChart3 size={24} />
                                </div>
                                <div className={styles.statContent}>
                                    <div className={styles.statNumber}>{userStats.totalDiagnoses}</div>
                                    <div className={styles.statLabel}>총 진단</div>
                                </div>
                            </div>
                            
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    <Calendar size={24} />
                                </div>
                                <div className={styles.statContent}>
                                    <div className={styles.statNumber}>{userStats.thisMonth}</div>
                                    <div className={styles.statLabel}>이번 달</div>
                                </div>
                            </div>
                            
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    <TrendingUp size={24} />
                                </div>
                                <div className={styles.statContent}>
                                    <div className={styles.statNumber}>{userStats.avgAccuracy}%</div>
                                    <div className={styles.statLabel}>정확도</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 하단 카드: 메뉴 버튼 + 안내문 */}
                <div className={styles.settingsCard}>
                    <h3 className={styles.settingsTitle}>계정 설정</h3>
                    
                    <div className={styles.menuGrid}>
                        <div className={styles.menuButton} onClick={handleProfileEdit}>
                            <div className={styles.menuIcon}>
                                <User size={24} />
                            </div>
                            <div className={styles.menuContent}>
                                <h4 className={styles.menuTitle}>프로필 수정</h4>
                                <p className={styles.menuDescription}>개인정보 및 의료진 정보를 수정합니다</p>
                            </div>
                            <div className={styles.menuArrow}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9,18 15,12 9,6"></polyline>
                                </svg>
                            </div>
                        </div>
                        
                        <div className={styles.menuButton} onClick={handlePasswordChange}>
                            <div className={styles.menuIcon}>
                                <Lock size={24} />
                            </div>
                            <div className={styles.menuContent}>
                                <h4 className={styles.menuTitle}>비밀번호 변경</h4>
                                <p className={styles.menuDescription}>보안을 위해 정기적으로 변경하세요</p>
                            </div>
                            <div className={styles.menuArrow}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9,18 15,12 9,6"></polyline>
                                </svg>
                            </div>
                        </div>
                        
                        <div className={`${styles.menuButton} ${styles.dangerButton}`} onClick={handleClearHistory}>
                            <div className={styles.menuIcon}>
                                <Trash2 size={24} />
                            </div>
                            <div className={styles.menuContent}>
                                <h4 className={styles.menuTitle}>진단 이력 삭제</h4>
                                <p className={styles.menuDescription}>모든 진단 기록을 영구적으로 삭제합니다</p>
                            </div>
                            <div className={styles.menuArrow}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="9,18 15,12 9,6"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.infoNote}>
                        <div className={styles.noteIcon}>💡</div>
                        <div className={styles.noteText}>
                            AI 진단 결과는 참고용이며, 최종 진단은 의료진 판단에 따릅니다.
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;