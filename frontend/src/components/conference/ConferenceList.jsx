import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import ConferenceCard from './ConferenceCard';
import { useAuth } from '../../contexts/AuthContext';

const ConferenceList = () => {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await apiService.getConferences();
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
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Conferences</h2>
        {user.role === 'organizer' && (
          <Link to="/conferences/create" className="btn btn-primary">
            Create New Conference
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {conferences.map(conference => (
          <ConferenceCard key={conference.id} conference={conference} />
        ))}
      </div>
    </div>
  );
};

export default ConferenceList;