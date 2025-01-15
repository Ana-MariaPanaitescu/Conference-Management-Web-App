import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
});

const conferenceAPI = {
  getAllConferences: () => api.get('/conferences'),
  getConference: (id) => api.get(`/conferences/${id}`),
  createConference: (data) => api.post('/conferences', data),
  updateConference: (id, data) => api.put(`/conferences/${id}`, data),
  deleteConference: (id) => api.delete(`/conferences/${id}`),
  assignReviewer: (conferenceId, reviewerId) => 
    api.post(`/conferences/${conferenceId}/reviewers`, { reviewerId }),
};

const articleAPI = {
  getArticles: () => api.get('/articles'),
  getArticle: (id) => api.get(`/articles/${id}`),
  submitArticle: (data) => api.post('/articles', data),
  updateArticle: (id, data) => api.put(`/articles/${id}`, data),
  deleteArticle: (id) => api.delete(`/articles/${id}`),
};

const reviewAPI = {
  getReviews: () => api.get('/reviews'),
  getReview: (id) => api.get(`/reviews/${id}`),
  submitReview: (articleId, data) => api.post(`/reviews/${articleId}`, data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
};

const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/profile', data),
  getReviewers: () => api.get('/users/reviewers'),
};

export { api as default, conferenceAPI, articleAPI, reviewAPI, userAPI };