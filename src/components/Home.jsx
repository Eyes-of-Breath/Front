import React from "react";
import styles from './Home.module.css';
import Home1 from './Home1';
import Home2 from './Home2';
import Home3 from './Home3';
import Home4 from './Home4';
import Home5 from './Home5';

// Continuous-scroll Home: stack sections vertically and let each section
// manage its own (non-pin) GSAP reveal if needed.
function Home() {
  return (
    <div className={styles.container}>
      <section className="section"><Home1 /></section>
      <section className="section"><Home2 forceFirstSection={true} /></section>
      <section className="section"><Home3 /></section>
      <section className="section"><Home4 /></section>
      <section className="section"><Home5 /></section>
    </div>
  );
}

export default Home;