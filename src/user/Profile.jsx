import React, { useState } from 'react';
import styles from './Profile.module.css'; // CSS Module import
import { User, Lock, Trash2, Stethoscope, Building, Mail, BarChart3, Calendar, TrendingUp, Settings, Shield, Award, ChevronRight } from 'lucide-react';
import profile from '../assets/profile.jpg';
import { useNavigate } from 'react-router-dom';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const Profile = () => {
    const navigate = useNavigate();
    const nickname = localStorage.getItem('nickname');
    const email = localStorage.getItem('email');

    const [userStats] = useState({
        totalDiagnoses: 147,
        thisMonth: 23,
        avgAccuracy: 94.2,
        joinDate: '2021.03.15'
    });

    const [doctorInfo] = useState({
        name: nickname,
        email: email,
        licenseNumber: '의사 제241234호',
        hospital: '서울대학교병원',
        department: '내과',
        specialty: '호흡기내과',
        experience: '8년차',
        certificationStatus: '인증 완료'
    });

    const handleProfileEdit = () => {
        console.log('프로필 수정 클릭');
        alert('프로필 수정 기능이 실행됩니다.');
    };

    const handleDiagnosisSettings = () => {
        console.log('진단 설정 클릭');
        alert('진단 설정 및 알림 페이지로 이동합니다.');
    };

    const handlePasswordChange = () => {
        navigate("/changePassword");
    };



    const handleClearHistory = async () => {
        const confirmClear = window.confirm(
            '개인 진단 기록이 모두 삭제됩니다.\n환자 의료 기록은 의료법에 따라 안전하게 보관됩니다.\n정말로 삭제하시겠습니까?'
        );

        if (!confirmClear) return;

        try {
            const accessToken = localStorage.getItem('accessToken');

            const response = await fetch(`${SERVER_URL}/patients/all`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                alert('회원님의 개인 진단 기록이 모두 삭제되었습니다.');
            } else {
                const errData = await response.json();
                console.error('삭제 실패:', errData);
                alert('삭제에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.profileContainer}>
            <main className={styles.mainContent}>
                <div className={styles.greeting}>
                    내 프로필을 최신 상태로 유지해보세요 👤
                </div>

                {/* 프로필 섹션 */}
                <div className={styles.profileSection}>
                    <img
                        src={profile}
                        alt="프로필 이미지"
                        className={styles.profileImage}
                    />
                    <div className={styles.profileInfo}>
                        <h1 className={styles.doctorName}>{doctorInfo.name} 선생님</h1>
                        <div className={styles.doctorDetails}>
                            <div className={styles.detailItem}>
                                <Mail size={18} />
                                <span>{doctorInfo.email}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <Building size={18} />
                                <span>{doctorInfo.hospital} {doctorInfo.department} · {doctorInfo.specialty}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 버튼 섹션 */}
                <div className={styles.buttonGrid}>
                    <button className={styles.actionButton} onClick={handleProfileEdit}>
                        <div className={styles.buttonLeft}>
                            <User size={20} />
                            <span>프로필 정보 수정</span>
                        </div>
                        <ChevronRight size={20} />
                    </button>

                    <button className={styles.actionButton} onClick={handlePasswordChange}>
                        <div className={styles.buttonLeft}>
                            <Lock size={20} />
                            <span>비밀번호 변경</span>
                        </div>
                        <ChevronRight size={20} />
                    </button>

                    <button className={`${styles.actionButton} ${styles.dangerButton}`} onClick={handleClearHistory}>
                        <div className={styles.buttonLeft}>
                            <Trash2 size={20} />
                            <span>개인 진단 기록 삭제</span>
                        </div>
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* AI 유의사항 */}
                <div className={styles.aiNotice}>
                    AI 진단 결과는 참고용이며, 최종 진단은 의료진 판단에 따릅니다. 환자 의료 기록은 의료법에 따라 안전하게 별도 보관됩니다.
                </div>
            </main>
        </div>
    );
};

export default Profile;