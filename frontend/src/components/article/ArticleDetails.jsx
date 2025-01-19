import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../../services/api';
import ReviewList from '../review/ReviewList';
import { useAuth } from '../../contexts/AuthContext';

const ArticleDetails = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await apiService.getArticleById(id);
        setArticle(response.data);
      } catch (err) {
        setError('Failed to fetch article details');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!article) return <div>Article not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
        <div className="mb-4">
          <span className="font-semibold">Status:</span> {article.status}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Conference:</span> {article.conference?.title}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Author:</span> {article.author?.name}
        </div>
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-2">Content</h3>
          <div className="whitespace-pre-wrap">{article.content}</div>
        </div>
      </div>

      {(user.role === 'reviewer' || user.role === 'organizer') && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Reviews</h3>
          <ReviewList articleId={article.id} />
        </div>
      )}
    </div>
  );
};

export default ArticleDetails;