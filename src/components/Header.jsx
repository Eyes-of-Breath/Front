import React from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import kaduceus from '../assets/logo_white.png';

function HeaderInner(){
  const navigate = useNavigate();

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
            <li className={styles.navItem}><Link to="/" className={styles.navLink}>Home</Link></li>
            <li className={styles.navItem}><Link to="/about" className={styles.navLink}>About</Link></li>
            <li className={styles.navItem}><Link to="/services" className={styles.navLink}>Services</Link></li>
            <li className={styles.navItem}><Link to="/contact" className={styles.navLink}>Contact</Link></li>
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