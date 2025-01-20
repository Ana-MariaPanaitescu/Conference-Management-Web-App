import React, { useState } from 'react';
import apiService from '../../services/api';
import { REVIEW_STATUS } from '../../utils/constants';

const ReviewForm = ({ review, onReviewUpdate }) => {
  const [formData, setFormData] = useState({
    feedback: review.feedback || '',
    status: review.status || REVIEW_STATUS.NEEDS_REVISION
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await apiService.updateReview(review.id, formData);
      onReviewUpdate(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update review');
    } finally {
      setSubmitting(false);
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
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
          Feedback
        </label>
        <textarea
          id="feedback"
          name="feedback"
          rows={4}
          value={formData.feedback}
          onChange={handleChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          disabled={submitting}
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          disabled={submitting}
        >
          {Object.entries(REVIEW_STATUS).map(([key, value]) => (
            <option key={key} value={value}>
              {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
            submitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {submitting ? 'Updating...' : 'Update Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;