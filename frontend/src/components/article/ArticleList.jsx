import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import ArticleCard from './ArticleCard';
import { useAuth } from '../../contexts/AuthContext';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = user.role === 'author' 
          ? await apiService.getAuthorArticles()
          : await apiService.getArticles();
        setArticles(response.data);
      } catch (err) {
        setError('Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [user.role]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Articles</h2>
        {user.role === 'author' && (
          <Link to="/articles/create" className="btn btn-primary">
            Submit New Article
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticleList;