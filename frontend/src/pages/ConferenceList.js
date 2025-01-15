import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { conferenceAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ConferenceList = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadConferences();
  }, []);

  const loadConferences = async () => {
    try {
      const response = await conferenceAPI.getAllConferences();
      setConferences(response.data);
    } catch (error) {
      toast.error('Failed to load conferences');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Conferences</h1>
        {user.role === 'organizer' && (
          <Link
            to="/conferences/create"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Create Conference
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {conferences.map((conference) => (
          <div
            key={conference.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{conference.title}</h2>
              <p className="text-gray-600 mb-4">{conference.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <p>
                  <span className="font-medium">Submission Deadline:</span>{' '}
                  {formatDate(conference.submissionDeadline)}
                </p>
                <p>
                  <span className="font-medium">Conference Date:</span>{' '}
                  {formatDate(conference.startDate)}
                </p>
                <p>
                  <span className="font-medium">Location:</span>{' '}
                  {conference.location}
                </p>
              </div>

              <div className="mt-6">
                <Link
                  to={`/conferences/${conference.id}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {conferences.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600">No conferences found</h3>
        </div>
      )}
    </div>
  );
};

export default ConferenceList;