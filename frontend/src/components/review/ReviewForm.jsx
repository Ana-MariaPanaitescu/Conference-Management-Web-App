import React, { useState } from 'react';
import apiService from '../../services/api';
import { REVIEW_STATUS } from '../../utils/constants';

const ReviewForm = ({ review, onReviewUpdate }) => {
  const [formData, setFormData] = useState({
    feedback: review.feedback || '',
    status: review.status || REVIEW_STATUS.NEEDS_REVISION
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.updateReview(review.id, formData);
      onReviewUpdate(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update review');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <label className="block mb-2">Feedback</label>
        <textarea
          name="feedback"
          className="w-full p-2 border rounded"
          value={formData.feedback}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block mb-2">Status</label>
        <select
          name="status"
          className="w-full p-2 border rounded"
          value={formData.status}
          onChange={handleChange}
          required
        >
          {Object.values(REVIEW_STATUS).map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Update Review
      </button>
    </form>
  );
};

export default ReviewForm;