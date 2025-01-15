import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function ConferenceList() {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await api.get('/conferences');
        setConferences(response.data);
      } catch (err) {
        setError('Failed to fetch conferences');
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Conferences</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {conferences.map(conference => (
          <div key={conference.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{conference.title}</h2>
            <p className="text-gray-600 mb-4">{conference.description}</p>
            <p className="text-sm text-gray-500">
              Date: {new Date(conference.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
