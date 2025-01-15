import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArticle } from '../../services/api';

const ArticleCreate = ({ conferenceId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    conferenceId: conferenceId,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await createArticle(formData);
      navigate('/author/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Submit New Article</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Title
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded mt-1"
              disabled={isSubmitting}
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Content
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="10"
              className="w-full p-2 border rounded mt-1"
              disabled={isSubmitting}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Article'}
        </button>
      </form>
    </div>
  );
};

export default ArticleCreate;