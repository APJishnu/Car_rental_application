import React from 'react';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.overlay}></div>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Discover the world on wheels <br /> with our car rental service
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
