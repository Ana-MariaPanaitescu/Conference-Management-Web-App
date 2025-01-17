import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuthorArticles } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const AuthorDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await getAuthorArticles(user.id);
        setArticles(response.data);
      } catch (err) {
        setError('Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [user.id]);

  const getStatusBadgeColor = (status) => {
    const colors = {
      submitted: 'bg-yellow-100 text-yellow-800',
      'under review': 'bg-blue-100 text-blue-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Author Dashboard</h1>
        <Link
          to="/articles/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit New Article
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-600">No articles submitted yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <div
              key={article.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{article.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeColor(
                    article.status
                  )}`}
                >
                  {article.status}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600">
                  Conference: {article.conference?.title || 'N/A'}
                </p>
                <p className="text-gray-600">
                  Submitted: {new Date(article.createdAt).toLocaleDateString()}
                </p>

                {article.reviews?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Reviews:</h4>
                    <div className="space-y-2">
                      {article.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="bg-gray-50 p-3 rounded"
                        >
                          <p className="text-sm">
                            <span className="font-medium">Status:</span>{' '}
                            {review.status}
                          </p>
                          {review.feedback && (
                            <p className="text-sm mt-1">
                              <span className="font-medium">Feedback:</span>{' '}
                              {review.feedback}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorDashboard;