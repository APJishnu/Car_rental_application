
// src/components/CarBooking/components/ReviewSection.tsx
import React from 'react';
import { Rate, Progress } from 'antd';
import styles from '../CarBooking.module.css';
import { Review , RatingDistribution } from '../../../../../interfaces/user-interfaces/types';

interface ReviewSectionProps {
  reviews: Review[];
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews }) => {
  const calculateOverallRating = (): number => {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return reviews.length > 0 ? totalRating / reviews.length : 0;
  };

  const getRatingDistribution = (): RatingDistribution => {
    const distribution: RatingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      const rating = review.rating as 1 | 2 | 3 | 4 | 5;
      distribution[rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className={styles.reviewSection}>
      <h3>User Reviews</h3>
      <div className={styles.reviewSummary}>
        <Rate value={calculateOverallRating()} disabled allowHalf style={{ color: "black" }} />
        <p>{`Overall Rating: ${calculateOverallRating().toFixed(1)} / 5 ★`}</p>
      </div>

      <div className={styles.ratingDistribution}>
        {([5, 4, 3, 2, 1] as const).map((rating) => (
          <div key={rating} className={styles.ratingRow}>
            <Progress
            type='circle'
            percent={parseFloat(((ratingDistribution[rating] / reviews.length) * 100).toFixed(0))}
            //  format={() => `${rating} ★`}
              strokeColor={rating > 3 ? "#40A578" : rating === 3 ? "#fadb14" : "#ff4d4f"}
              size={80}
            />
            <span>{`${rating} Star${rating === 1 ? '' : 's'}`}</span>
          </div>
        ))}
      </div>

      <div className={styles.reviews}>
        {reviews.slice(0, 5).map((review, index) => (
          <div key={index} className={styles.reviewItem}>
            <img
              src={review.user.profileImage}
              alt={`${review.user.fullName}'s profile`}
              className={styles.userImage}
            />
            <div className={styles.reviewContent}>
              <h4>{review.user.fullName}</h4>
              <p>{review.user.email}</p>
              <Rate
                value={review.rating}
                allowHalf
                disabled
                style={{ color: "black", fontSize: "12px" }}
              />
              <p>{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
