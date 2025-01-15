import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { conferenceAPI, articleAPI, reviewAPI } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    conferences: [],
    articles: [],
    reviews: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const requests = [conferenceAPI.getAllConferences()];
      
      if (user.role === 'author') {
        requests.push(articleAPI.getArticles());
      }
      if (user.role === 'reviewer') {
        requests.push(reviewAPI.getReviews());
      }

      const responses = await Promise.all(requests);
      
      setDashboardData({
        conferences: responses[0].data,
        articles: responses[1]?.data || [],
        reviews: responses[2]?.data || []
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const renderOrganizerDashboard = () => (
    <div className="space-y-6">
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Conferences</h2>
          <Link
            to="/conferences/create"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Create Conference
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.conferences.map(conference => (
            <div key={conference.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">{conference.title}</h3>
              <p className="text-gray-600 mb-4">{conference.description}</p>
              <Link
                to={`/conferences/${conference.id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderAuthorDashboard = () => (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">My Articles</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {dashboardData.articles.map(article => (
              <li key={article.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {article.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-sm ${
                      article.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      article.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600">{article.abstract}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );

  const renderReviewerDashboard = () => (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4">Pending Reviews</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {dashboardData.reviews.map(review => (
              <li key={review.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {review.article.title}
                    </h3>
                    <Link
                      to={`/reviews/${review.id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Review
                    </Link>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Due: {new Date(review.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      {user.role === 'organizer' && renderOrganizerDashboard()}
      {user.role === 'author' && renderAuthorDashboard()}
      {user.role === 'reviewer' && renderReviewerDashboard()}
    </div>
  );
};

export default Dashboard;