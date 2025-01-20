import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../services/api';
import ArticleList from '../article/ArticleList';

const ConferenceDetails = () => {
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConference = async () => {
      try {
        const response = await apiService.getConferenceById(id);
        setConference(response.data);
      } catch (err) {
        setError('Failed to fetch conference details');
      } finally {
        setLoading(false);
      }
    };

    fetchConference();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!conference) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
          <p className="text-yellow-700">Conference not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{conference.title}</h1>
            <div className="text-gray-600">
              {new Date(conference.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{conference.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Organizer</h3>
              <p className="text-gray-600">{conference.organizer?.name}</p>
              <p className="text-gray-500 text-sm">{conference.organizer?.email}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Reviewers</h3>
              <div className="space-y-2">
                {conference.reviewers?.map(reviewer => (
                  <div key={reviewer.id} className="text-gray-600">
                    <p>{reviewer.name}</p>
                    <p className="text-gray-500 text-sm">{reviewer.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Conference Articles</h2>
        <ArticleList conferenceId={conference.id} />
      </div>

      <div className="mt-8">
        <button
          onClick={() => navigate('/conferences')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to Conferences
        </button>
      </div>
    </div>
  );
};

export default ConferenceDetails;