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

  const getStatusColor = (status) => {
    const colors = {
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      'needs revision': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No reviews available yet.</p>
      ) : (
        reviews.map(review => (
          <div key={review.id} className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">
                  Review by {review.reviewer.name}
                </h4>
                <p className="text-sm text-gray-500">{review.reviewer.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(review.status)}`}>
                {review.status}
              </span>
            </div>

            {review.feedback && (
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Feedback</h5>
                <p className="text-gray-600 whitespace-pre-wrap">{review.feedback}</p>
              </div>
            )}

            {user.role === 'reviewer' && user.id === review.reviewer.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="text-lg font-medium text-gray-900 mb-4">Update Review</h5>
                <ReviewForm review={review} onReviewUpdate={handleReviewUpdate} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;