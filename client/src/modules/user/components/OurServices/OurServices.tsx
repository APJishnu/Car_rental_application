import React from 'react';
import styles from './OurServices.module.css'; // CSS module import


const OurServices = () => {
  const services = [
    {
      icon: '/carImages/OurServices/Quality-icon.svg',
      title: 'Quality Choice',
      description: 'We offer a wide range of high-quality vehicles to choose from, including luxury cars, SUVs, vans, and more.'
    },
    {
      icon: '/carImages/OurServices/Price-icon.svg',
      title: 'Affordable Prices',
      description: 'Our rental rates are highly competitive and affordable, allowing our customers to enjoy their trips without breaking the bank.'
    },
    {
      icon: '/carImages/OurServices/Booking-icon.svg',
      title: 'Convenient Online Booking',
      description: 'With our easy-to-use online booking system, customers can quickly and conveniently reserve their rental car from anywhere, anytime.'
    }
  ];

  return (
    <section className={styles.ourServices}>
      <h2 className={styles.heading}>Our Services & Benefits</h2>
      <p className={styles.description}>
        To make renting easy and hassle-free, we provide a variety of services and advantages.
        We have you covered with a variety of vehicles and flexible rental terms.
      </p>
      <div className={styles.servicesContainer}>
        {services.map((service, index) => (
          <div className={styles.service} key={index}>
            <div className={styles.iconWrapper}>
              <img src={service.icon} alt={service.title} className={styles.icon} />
            </div>
            <h3 className={styles.serviceTitle}>{service.title}</h3>
            <p className={styles.serviceDescription}>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurServices;
