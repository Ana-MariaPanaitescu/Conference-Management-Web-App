import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    conferences: [],
    articles: [],
    reviews: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const conferenceResponse = await apiService.getConferences();
        let articleResponse = { data: [] };
        let reviewResponse = { data: [] };

        if (user.role === 'author') {
          articleResponse = await apiService.getAuthorArticles();
        } else if (user.role === 'reviewer') {
          reviewResponse = await apiService.getAssignedReviews();
        }

        setData({
          conferences: conferenceResponse.data,
          articles: articleResponse.data,
          reviews: reviewResponse.data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Conferences</h2>
          <div className="space-y-2">
            {data.conferences.slice(0, 5).map(conference => (
              <div key={conference.id} className="p-2 hover:bg-gray-50 rounded">
                {conference.title}
              </div>
            ))}
          </div>
        </div>

        {user.role === 'author' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">My Articles</h2>
            <div className="space-y-2">
              {data.articles.slice(0, 5).map(article => (
                <div key={article.id} className="p-2 hover:bg-gray-50 rounded">
                  {article.title}
                </div>
              ))}
            </div>
          </div>
        )}

        {user.role === 'reviewer' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Pending Reviews</h2>
            <div className="space-y-2">
              {data.reviews.slice(0, 5).map(review => (
                <div key={review.id} className="p-2 hover:bg-gray-50 rounded">
                  {review.article?.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;