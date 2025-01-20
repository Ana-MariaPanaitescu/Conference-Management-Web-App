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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const response = await apiService.getUsersByRole('reviewer');
        setReviewers(response.data);
      } catch (err) {
        setError('Failed to fetch reviewers');
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Conference</h2>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="reviewerIds" className="block text-sm font-medium text-gray-700">
              Select Reviewers (minimum 2)
            </label>
            <select
              id="reviewerIds"
              name="reviewerIds"
              multiple
              value={formData.reviewerIds}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              size={5}
              required
            >
              {reviewers.map(reviewer => (
                <option key={reviewer.id} value={reviewer.id}>
                  {reviewer.name} ({reviewer.email})
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Hold Ctrl/Cmd to select multiple reviewers
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/conferences')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Conference
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConferenceCreate;