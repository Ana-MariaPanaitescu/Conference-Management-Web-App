import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function ReviewerDashboard() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/reviews/reviewer/${user.id}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user.id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reviewer Dashboard</h1>
      <div className="grid gap-6">
        {reviews.map(review => (
          <div key={review.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{review.article.title}</h2>
            <p className="text-gray-600 mt-2">Status: {review.status}</p>
            {review.feedback && (
              <p className="text-gray-600 mt-2">Feedback: {review.feedback}</p>
            )}
            <div className="mt-4">
              <Link
                to={`/articles/${review.articleId}/review`}
                className="text-blue-500 hover:text-blue-600"
              >
                Review Article
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewerDashboard;