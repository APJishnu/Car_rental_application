"use client";

import React, { useEffect, useState } from 'react';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  const [scale, setScale] = useState(1);
  const [showDescription, setShowDescription] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const newScale = Math.max(0.8, 1 - scrollY / 1000);
    setScale(newScale);

    // Show description when scale is 0.9 or less
    setShowDescription(newScale <= 0.9);
  };

  useEffect(() => {
    const throttledHandleScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledHandleScroll);
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);


  return (
    <div className={styles.mainDiv}>
      <section
        className={styles.heroSection}
        style={{ transform: `scale(${scale})`, transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        <span className={styles.overlay}></span>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Discover the world on wheels <br /> with our car rental service
          </h1>

        </div>
      </section>
      {showDescription && ( // Conditional rendering for the description
        <p className={styles.description}>
          Rent a vehicle that suits your needs with ease and convenience.
        </p>
      )}
    </div>
  );
};

export default HeroSection;
