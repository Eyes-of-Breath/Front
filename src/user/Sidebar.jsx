import React from 'react';
import styles from './Sidebar.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';


function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.replace('/');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.body}>
            <button
                onClick={() => navigate('/dashboard')}
                className={isActive('/dashboard') ? styles.active : styles.normal}
            >
                대시보드
            </button>
            <button
                onClick={() => navigate('/patient')}
                className={isActive('/patient') ? styles.active : styles.normal}
            >
                환자 관리
            </button>
            <button
                onClick={() => navigate('/analysis')}
                className={isActive('/analysis') ? styles.active : styles.normal}
            >
                분석
            </button>
            <button
                onClick={() => navigate('/profile')}
                className={isActive('/profile') ? styles.active : styles.normal}
            >
                프로필
            </button>
              <div className={styles.spacer} />
            <div className={styles.logoutContainer}>
                <p onClick={handleLogout} className={styles.logoutText}>
                    로그아웃
                </p>
            </div>

        </div>
    );
}

export default Sidebar;
