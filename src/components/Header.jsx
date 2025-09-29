import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import kaduceus from '../assets/logo_white.png';

function HeaderInner(){
  const navigate = useNavigate();
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className={styles.root} aria-label="site header">
      {/* content row */}
      <div className={styles.row} data-header-row>
        <span className={styles.brand}>
          <img src={kaduceus} alt="logo" className={styles.logoIcon} />
          eye of breath
        </span>
        <nav className={styles.nav} aria-label="primary">
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <button onClick={() => scrollToSection('home1')} className={styles.navLink}>
                Home
              </button>
            </li>
            <li className={styles.navItem}>
              <button onClick={() => scrollToSection('home2')} className={styles.navLink}>
                About
              </button>
            </li>
            <li className={styles.navItem}>
              <button onClick={() => scrollToSection('home3')} className={styles.navLink}>
                Article
              </button>
            </li>
            <li className={styles.navItem}>
              <button onClick={() => scrollToSection('home5')} className={styles.navLink}>
                Credit
              </button>
            </li>
          </ul>
        </nav>
        <button
          type="button"
          className={styles.loginBtn}
          onClick={() => navigate('/login')}
          aria-label="login"
        >
          Login
        </button>
      </div>
      <div className={styles.dividerTrack} data-divider-track>
        <div className={styles.dividerFill} data-divider-fill />
      </div>
    </header>
  );
}

export default function Header(){
  return createPortal(<HeaderInner />, document.body);
}