import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';

const DashboardCard = ({ title, items = [], linkPrefix }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {items.length > 0 ? (
      <div className="space-y-3">
        {items.map(item => (
          <Link
            key={item.id}
            to={`${linkPrefix}/${item.id}`}
            className="block p-3 hover:bg-gray-50 rounded-md transition-colors duration-150"
          >
            <div className="font-medium text-gray-900">{item.title}</div>
            {item.status && (
              <div className="text-sm text-gray-500">Status: {item.status}</div>
            )}
          </Link>
        ))}
      </div>
    ) : (
      <p className="text-gray-500">No items to display</p>
    )}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    conferences: [],
    articles: [],
    reviews: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const promises = [apiService.getConferences()];

        if (user.role === 'author') {
          promises.push(apiService.getAuthorArticles());
        }
        if (user.role === 'reviewer') {
          promises.push(apiService.getAssignedReviews());
        }

        const responses = await Promise.all(promises);
        
        setData({
          conferences: responses[0].data,
          articles: user.role === 'author' ? responses[1].data : [],
          reviews: user.role === 'reviewer' ? responses[1].data : []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
        {user.role === 'organizer' && (
          <Link
            to="/conferences/create"
            className="btn btn-primary"
          >
            Create Conference
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Recent Conferences"
          items={data.conferences.slice(0, 5)}
          linkPrefix="/conferences"
        />

        {user.role === 'author' && (
          <DashboardCard
            title="My Articles"
            items={data.articles.slice(0, 5)}
            linkPrefix="/articles"
          />
        )}

        {user.role === 'reviewer' && (
          <DashboardCard
            title="Pending Reviews"
            items={data.reviews.slice(0, 5).map(review => ({
              ...review,
              title: review.article?.title,
              id: review.article?.id
            }))}
            linkPrefix="/articles"
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;