import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function OrganizerDashboard() {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/conferences');
        setConferences(response.data);
      } catch (error) {
        console.error('Error fetching conferences:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
      <div className="grid gap-6">
        {conferences.map(conference => (
          <div key={conference.id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{conference.title}</h2>
            <p className="text-gray-600">{conference.description}</p>
            <p className="text-sm text-gray-500">
              Date: {new Date(conference.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrganizerDashboard;