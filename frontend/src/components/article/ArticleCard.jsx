import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const statusColors = {
    submitted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'under review': 'bg-blue-100 text-blue-800 border-blue-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 flex-grow">{article.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[article.status]}`}>
            {article.status}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-gray-600">
            <span className="font-medium">Conference:</span> {article.Conference?.title}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Author:</span> {article.author?.name}
          </p>
          {article.content && (
            <p className="text-gray-600 line-clamp-2">
              {article.content}
            </p>
          )}
        </div>
        
        <Link
          to={`/articles/${article.id}`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
        >
          View Details
          <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;