import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

const ArticleCreate = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    conferenceId: ''
  });
  const [conferences, setConferences] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await apiService.getConferences();
        setConferences(response.data);
      } catch (err) {
        setError('Failed to fetch conferences');
      }
    };
    fetchConferences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiService.createArticle(formData);
      navigate('/articles');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create article');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Submit New Article</h2>
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
          <label className="block mb-2">Content</label>
          <textarea
            name="content"
            className="input-field min-h-[200px]"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block mb-2">Conference</label>
          <select
            name="conferenceId"
            className="input-field"
            value={formData.conferenceId}
            onChange={handleChange}
            required
          >
            <option value="">Select a conference</option>
            {conferences.map(conference => (
              <option key={conference.id} value={conference.id}>
                {conference.title}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Submit Article
        </button>
      </form>
    </div>
  );
};

export default ArticleCreate;