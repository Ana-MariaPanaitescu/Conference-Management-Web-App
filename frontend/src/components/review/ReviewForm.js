import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function ReviewForm({ articleId }) {
  const [formData, setFormData] = useState({
    feedback: '',
    status: 'needs revision'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        ...formData,
        articleId,
        reviewerId: user.id
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Feedback
        </label>
        <textarea
          className="w-full p-2 border rounded"
          rows="6"
          value={formData.feedback}
          onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Status
        </label>
        <select
          className="w-full p-2 border rounded"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="needs revision">Needs Revision</option>
          <option value="accepted">Accept</option>
          <option value="rejected">Reject</option>
        </select>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit Review
      </button>
    </form>
  );
}