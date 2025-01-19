import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';
import ReviewForm from './ReviewForm';
import { useAuth } from '../../contexts/AuthContext';

const ReviewList = ({ articleId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await apiService.getReviewsByArticle(articleId);
        setReviews(response.data);
      } catch (err) {
        setError('Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [articleId]);

  const handleReviewUpdate = (updatedReview) => {
    setReviews(reviews.map(review => 
      review.id === updatedReview.id ? updatedReview : review
    ));
  };

  if (loading) return <div>Loading reviews...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      {reviews.map(review => (
        <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <span className="font-semibold">Reviewer:</span> {review.reviewer.name}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Status:</span> {review.status}
          </div>
          {review.feedback && (
            <div className="mb-4">
              <span className="font-semibold">Feedback:</span>
              <p className="mt-2 whitespace-pre-wrap">{review.feedback}</p>
            </div>
          )}
          {user.role === 'reviewer' && user.id === review.reviewer.id && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Update Review</h4>
              <ReviewForm review={review} onReviewUpdate={handleReviewUpdate} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;