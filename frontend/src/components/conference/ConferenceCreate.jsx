import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

const ConferenceCreate = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    reviewerIds: []
  });
  const [reviewers, setReviewers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const response = await apiService.getUsersByRole('reviewer');
        setReviewers(response.data);
      } catch (err) {
        setError('Failed to fetch reviewers');
      }
    };
    fetchReviewers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createConference(formData);
      navigate('/conferences');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create conference');
    }
  };

  const handleChange = (e) => {
    const value = e.target.name === 'reviewerIds'
      ? Array.from(e.target.selectedOptions, option => option.value)
      : e.target.value;
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Conference</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            name="title"
            className="input-field"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            className="input-field min-h-[100px]"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Date</label>
          <input
            type="date"
            name="date"
            className="input-field"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Reviewers (select at least 2)</label>
          <select
            name="reviewerIds"
            multiple
            className="input-field min-h-[100px]"
            value={formData.reviewerIds}
            onChange={handleChange}
            required
          >
            {reviewers.map(reviewer => (
              <option key={reviewer.id} value={reviewer.id}>
                {reviewer.name} ({reviewer.email})
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Create Conference
        </button>
      </form>
    </div>
  );
};

export default ConferenceCreate;