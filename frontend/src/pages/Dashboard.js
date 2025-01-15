import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

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
        const [conferences, articles, reviews] = await Promise.all([
          api.get('/conferences'),
          api.get('/articles'),
          user.role === 'reviewer' ? api.get('/reviews') : Promise.resolve({ data: [] })
        ]);

        setData({
          conferences: conferences.data,
          articles: articles.data,
          reviews: reviews.data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user]);

  const renderContent = () => {
    switch (user.role) {
      case 'organizer':
        return <OrganizerDashboard data={data} />;
      case 'reviewer':
        return <ReviewerDashboard data={data} />;
      case 'author':
        return <AuthorDashboard data={data} />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
      {renderContent()}
    </div>
  );
};

export default Dashboard;