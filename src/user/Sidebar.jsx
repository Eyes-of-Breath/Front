import React from 'react';
import styles from './Sidebar.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../assets/logo.png';

// 아이콘 컴포넌트들 - CSS color 속성 사용하도록 수정
const DashboardIcon = () => (
    <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
    >
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
    </svg>
);

const CalendarIcon = () => (
    <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
    >
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
    </svg>
);

const PatientIcon = () => (
    <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
    >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

const AnalysisIcon = () => (
    <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
    >
        <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
    </svg>
);

const ProfileIcon = () => (
    <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
);

const LogoutIcon = () => (
    <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
    >
        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
    </svg>
);

const HelpIcon = () => (
    <svg 
        width="28" 
        height="28" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        className={styles.icon}
    >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
    </svg>
);

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const handleHelp = () => {
        // 도움말 페이지로 이동하거나 모달 열기
        navigate('/help');
        // 또는 외부 도움말 링크
        // window.open('https://help.example.com', '_blank');
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/', { replace: true });
        } catch (error) {
            console.error('로그아웃 중 오류 발생:', error);
            alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const menuItems = [
        { 
            path: '/dashboard', 
            label: '대시보드',
            icon: DashboardIcon
        },
        { 
            path: '/calendar', 
            label: '캘린더',
            icon: CalendarIcon
        },
        { 
            path: '/patient', 
            label: '환자 관리',
            icon: PatientIcon
        },
        { 
            path: '/analysis', 
            label: '분석',
            icon: AnalysisIcon
        },
        { 
            path: '/profile', 
            label: '프로필',
            icon: ProfileIcon
        }
    ];

    return (
        <nav className={styles.body} role="navigation" aria-label="메인 메뉴">
            {/* 로고 섹션 */}
            <div className={styles.logoContainer}>
                <img src={logo} alt="로고" className={styles.logo} />
            </div>
            
            {/* 메뉴 아이콘들 */}
            <div className={styles.menuSection}>
                {menuItems.map(({ path, label, icon: IconComponent }) => (
                    <button
                        key={path}
                        onClick={() => navigate(path)}
                        className={`${styles.iconButton} ${isActive(path) ? styles.active : ''}`}
                        aria-label={label}
                        data-tooltip={label}
                    >
                        <IconComponent />
                    </button>
                ))}
            </div>
            
            <div className={styles.spacer} />
            
            {/* 도움말 버튼 */}
            <div className={styles.helpSection}>
                <button 
                    onClick={handleHelp} 
                    className={styles.iconButton}
                    aria-label="도움말"
                    data-tooltip="도움말"
                >
                    <HelpIcon />
                </button>
            </div>
            
            {/* 로그아웃 버튼 */}
            <div className={styles.logoutSection}>
                <button 
                    onClick={handleLogout} 
                    className={styles.iconButton}
                    aria-label="로그아웃"
                    data-tooltip="로그아웃"
                >
                    <LogoutIcon />
                </button>
            </div>
        </nav>
    );
}

export default Sidebar;