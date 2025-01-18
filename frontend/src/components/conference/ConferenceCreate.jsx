import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import AuthContext from '../../contexts/AuthContext';

function ConferenceCreate() {
  const { user } = useContext(AuthContext);
  const [reviewers, setReviewers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    reviewerIds: [] // Add this for reviewer selection
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch available reviewers when component mounts
  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const response = await api.get('/users/role/reviewer');
        setReviewers(response.data);
      } catch (error) {
        setError('Failed to fetch reviewers');
      }
    };
    fetchReviewers();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === 'reviewerIds') {
      // Handle multiple select for reviewers
      const selectedReviewers = Array.from(e.target.selectedOptions, option => Number(option.value));
      setFormData({ ...formData, reviewerIds: selectedReviewers });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.reviewerIds.length < 2) {
      setError('Please select at least 2 reviewers');
      return;
    }

    try {
      await api.post('/conferences', formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create conference');
    }
  };

  // Redirect if user is not an organizer
  if (user?.role !== 'organizer') {
    return <div>Only organizers can create conferences</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Create New Conference</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Select Reviewers (minimum 2)</label>
          <select
            name="reviewerIds"
            multiple
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            {reviewers.map(reviewer => (
              <option key={reviewer.id} value={reviewer.id}>
                {reviewer.name} ({reviewer.email})
              </option>
            ))}
          </select>
          <small className="text-gray-500">Hold Ctrl/Cmd to select multiple reviewers</small>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Conference
        </button>
      </form>
    </div>
  );
}

export default ConferenceCreate;