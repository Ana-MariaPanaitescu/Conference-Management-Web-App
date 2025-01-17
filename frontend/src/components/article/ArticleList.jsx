import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = user.role === 'author'
          ? await api.get(`/articles/author/${user.id}`)
          : await api.get('/articles');
        setArticles(response.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Articles</h1>
      {articles.map(article => (
        <div key={article.id} className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold">{article.title}</h2>
          <p className="text-gray-600 mt-2">{article.content.substring(0, 200)}...</p>
          <div className="mt-4">
            <span className={`px-2 py-1 rounded text-sm ${
              article.status === 'approved' ? 'bg-green-100 text-green-800' :
              article.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {article.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;