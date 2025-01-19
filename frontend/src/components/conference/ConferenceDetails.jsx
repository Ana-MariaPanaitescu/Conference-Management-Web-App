import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../../services/api';
import ArticleList from '../article/ArticleList';

const ConferenceDetails = () => {
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!conference) return <div>Conference not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">{conference.title}</h2>
        <div className="mb-4">
          <span className="font-semibold">Date:</span>{' '}
          {new Date(conference.date).toLocaleDateString()}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Organizer:</span>{' '}
          {conference.organizer?.name}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Reviewers:</span>
          <ul className="list-disc ml-8 mt-2">
            {conference.reviewers?.map(reviewer => (
              <li key={reviewer.id}>{reviewer.name} ({reviewer.email})</li>
            ))}
          </ul>
        </div>
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p>{conference.description}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Conference Articles</h3>
        <ArticleList conferenceId={conference.id} />
      </div>
    </div>
  );
};

export default ConferenceDetails;