import React, { useState, useCallback, useMemo } from 'react';
import styles from './Sidebar.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../assets/logo.png';
import {
  LayoutDashboard,
  Calendar,
  Search,
  BarChart3,
  User,
  LogOut,
  Stethoscope
} from 'lucide-react';

const MENU_ITEMS = [
  { path: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { path: '/calendar', label: '캘린더', icon: Calendar },
  { path: '/patientAll', label: '모든 환자 조회', icon: Search },
  { path: '/patient', label: '환자 조회', icon: Stethoscope },
  { path: '/analysis', label: '분석', icon: BarChart3 },
  { path: '/profile', label: '프로필', icon: User }
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  const handleLogoutClick = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  const handleLogoutConfirm = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      localStorage.clear();
      sessionStorage.clear();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
      alert('로그아웃 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  }, [navigate]);

  const handleLogoutCancel = useCallback(() => {
    setShowLogoutModal(false);
  }, []);

  const handleModalKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleLogoutCancel();
    }
  }, [handleLogoutCancel]);

  const renderMenuItems = useMemo(() => {
    return MENU_ITEMS.map(({ path, label, icon: IconComponent }) => {
      const isCurrentMenuActive = isActive(path);
      
      return (
        <button
          key={path}
          onClick={() => navigate(path)}
          className={`${styles.iconButton} ${isCurrentMenuActive ? styles.active : ''}`}
          aria-label={label}
          aria-current={isCurrentMenuActive ? 'page' : undefined}
          data-tooltip={label}
        >
          <IconComponent size={20} className={styles.icon} />
        </button>
      );
    });
  }, [navigate, isActive]);

  return (
    <>
      <nav 
        className={styles.body} 
        role="navigation" 
        aria-label="메인 메뉴"
      >
        {/* 로고 */}
        <div className={styles.logoContainer}>
          <img src={logo} alt="메디컬 시스템 로고" className={styles.logo} />
        </div>

        {/* 메뉴 아이콘들 */}
        <div className={styles.menuSection}>
          {renderMenuItems}
        </div>

        <div className={styles.spacer} />

        {/* 로그아웃 버튼 */}
        <div className={styles.logoutSection}>
          <button
            onClick={handleLogoutClick}
            className={styles.iconButton}
            aria-label="로그아웃"
            data-tooltip="로그아웃"
            disabled={isLoggingOut}
          >
            <LogOut size={20} className={styles.icon} />
          </button>
        </div>
      </nav>

      {/* 로그아웃 확인 모달 */}
      {showLogoutModal && (
        <div
          className={styles.modalOverlay}
          onClick={handleLogoutCancel}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="logout-modal-title" className={styles.modalTitle}>
              로그아웃 확인
            </h2>
            <p className={styles.modalText}>
              정말 로그아웃 하시겠습니까?
            </p>
            <div className={styles.modalButtons}>
              <button
                onClick={handleLogoutCancel}
                className={`${styles.modalButton} ${styles.cancelButton}`}
                disabled={isLoggingOut}
              >
                취소
              </button>
              <button
                onClick={handleLogoutConfirm}
                className={`${styles.modalButton} ${styles.confirmButton}`}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;