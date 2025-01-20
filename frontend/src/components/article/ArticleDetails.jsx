import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import ReviewList from '../review/ReviewList';
import { useAuth } from '../../contexts/AuthContext';

const ArticleDetails = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await apiService.getArticleById(id);
        setArticle(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch article details');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const getStatusBadgeColor = (status) => {
    const colors = {
      submitted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'under review': 'bg-blue-100 text-blue-800 border-blue-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">Article not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(article.status)}`}>
              {article.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Conference</h3>
              <p className="mt-1 text-lg text-gray-900">{article.Conference?.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Author</h3>
              <p className="mt-1 text-lg text-gray-900">{article.author?.name}</p>
            </div>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Content</h3>
            <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap text-gray-700">
              {article.content}
            </div>
          </div>
        </div>
      </div>

      {(user.role === 'reviewer' || user.role === 'organizer' || user.id === article.authorId) && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          <ReviewList articleId={article.id} />
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={() => navigate('/articles')}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Articles
        </button>
      </div>
    </div>
  );
};

export default ArticleDetails;