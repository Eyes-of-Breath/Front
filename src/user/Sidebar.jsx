import React, { } from 'react';
import styles from './Sidebar.module.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

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

        </div>
    );
}

export default Sidebar;