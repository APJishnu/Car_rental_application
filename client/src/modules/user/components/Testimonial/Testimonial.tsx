"use client"

// components/Testimonial.tsx
import { useState } from 'react';
import styles from './Testimonial.module.css';

type Testimonial = {
    name: string;
    location: string;
    message: string;
    image: string;
};

const testimonials: Testimonial[] = [
    {
        name: 'Lokman Hossain',
        location: 'From Texas',
        message:
            'I was really impressed with the level of service I received from this car rental company. The process was smooth and easy, and the car I rented was in excellent condition. The staff was friendly and helpful, and I felt well taken care of throughout my rental period. I would definitely recommend this company to anyone looking for a premium car rental experience.',
        image: '/carImages/Testimonials/Lokman-hossain.svg',
    },
    {
        name: 'Jane Doe',
        location: 'From New York',
        message:
            'The service was incredible and the car was in perfect condition. I felt confident and safe throughout my entire trip. Will definitely rent again!',
        image: '/carImages/Testimonials/Profile.svg',
    },
    // Add more testimonials if needed
];

const TestimonialComponent: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    };

    const previousTestimonial = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className={styles.testimonialContainer}>

            <div className={styles.mainHeadingDiv}>
                <h2 className={styles.heading}>What Our Customers Say</h2>
                <div className={styles.navigation}>
                    <button onClick={previousTestimonial} className={styles.arrowButton}>
                        &#8592;
                    </button>
                    <button onClick={nextTestimonial} className={styles.arrowButton}>
                        &#8594;
                    </button>
                </div>
            </div>


            {testimonials.map((testimonial, index) => (
                <div
                    key={index}
                    className={styles.testimonial}
                    style={{ display: index === currentIndex ? 'block' : 'none' }}
                >
                    <p className={styles.message}>"{testimonial.message}"</p>
                    <div className={styles.profileContainer}>
                        <img
                            className={styles.profileImage}
                            src={testimonial.image}
                            alt={testimonial.name}
                        />
                        <div>
                            <p className={styles.name}>{testimonial.name}</p>
                            <p className={styles.location}>{testimonial.location}</p>
                        </div>
                    </div>
                </div>
            ))}


        </div>
    );
};

export default TestimonialComponent;
