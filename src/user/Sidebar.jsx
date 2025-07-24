import React from 'react';
import styles from './Sidebar.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../assets/logo.png';
import { 
    LayoutDashboard, 
    Calendar, 
    Users, 
    BarChart3, 
    User, 
    LogOut, 
    HelpCircle 
} from 'lucide-react';

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
            icon: LayoutDashboard
        },
        { 
            path: '/calendar', 
            label: '캘린더',
            icon: Calendar
        },
        { 
            path: '/patient', 
            label: '환자 관리',
            icon: Users
        },
        { 
            path: '/analysis', 
            label: '분석',
            icon: BarChart3
        },
        { 
            path: '/profile', 
            label: '프로필',
            icon: User
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
                        <IconComponent size={28} className={styles.icon} />
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
                    <HelpCircle size={28} className={styles.icon} />
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
                    <LogOut size={28} className={styles.icon} />
                </button>
            </div>
        </nav>
    );
}

export default Sidebar;