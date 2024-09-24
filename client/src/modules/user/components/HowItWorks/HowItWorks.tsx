// HowItWorks.tsx

'use client';

import React, { useState, useEffect } from 'react';
import styles from './HowItWorks.module.css';

// Define the type for a single step
interface Step {
  id: string; // Unique identifier for the step
  icon: string; // Path to the icon image
  title: string; // Title of the step
  description: string; // Description of the step
}

// Steps data with defined types
const steps: Step[] = [
  {
    id: '1',
    icon: '/carImages/HowItWorks/search.svg',
    title: 'Browse and select',
    description: 'Choose from our wide range of premium cars, select the pickup and return dates and locations that suit you best.'
  },
  {
    id: '2',
    icon: '/carImages/HowItWorks/calendar-check.svg',
    title: 'Book and confirm',
    description: 'Book your desired car with just a few clicks and receive an instant confirmation via email or SMS.'
  },
  {
    id: '3',
    icon: '/carImages/HowItWorks/face-happy.svg',
    title: 'Enjoy your ride',
    description: 'Pick up your car at the designated location and enjoy your premium driving experience with our top-quality service.'
  }
];

const HowItWorks: React.FC = () => {
  const [carImage, setCarImage] = useState<string>('/carImages/HowItWorks/CarImage.svg'); // Default image

  useEffect(() => {
    // Simulating a dynamic update of the image
    const fetchCarImage = () => {
      setTimeout(() => {
        // This would come from the server in a real application
        const dynamicCarImage = '/carImages/HowItWorks/CarImage.svg'; // For demonstration purposes
        setCarImage(dynamicCarImage);
      }, 2000); // Change the image after 2 seconds
    };

    fetchCarImage();
  }, []);

  return (
    <div className={styles.howItWorks}>
      <div className={styles.HeadingDiv}>
        <h2 className={styles.title}>How it works</h2>
        <p className={styles.description}>Renting a luxury car has never been easier. Our streamlined process makes it simple for you to book and confirm your vehicle of choice online.</p>
      </div>
      <div className={styles.stepsSection}>
        <div className={styles.steps}>
          {steps.map((step) => (
            <div key={step.id} className={styles.step}>
              <div className={styles.iconDiv}>
                <img src={step.icon} alt={`${step.title} icon`} className={styles.icon} />
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.carImage}>
          <img src={carImage} alt="Luxury Car" className={styles.jeepImage} />
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
