import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const statusColors = {
    submitted: 'bg-yellow-100 text-yellow-800',
    'under review': 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
      <div className="mb-4">
        <span className={`px-2 py-1 rounded text-sm ${statusColors[article.status]}`}>
          {article.status}
        </span>
      </div>
      <div className="text-gray-600 mb-4">
        <p>Conference: {article.conference?.title}</p>
        <p>Author: {article.author?.name}</p>
      </div>
      <Link
        to={`/articles/${article.id}`}
        className="text-blue-600 hover:text-blue-800"
      >
        View Details →
      </Link>
    </div>
  );
};

export default ArticleCard;