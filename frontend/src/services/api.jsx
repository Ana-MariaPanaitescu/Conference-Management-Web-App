import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// // API methods
// const apiService = {
//   // Auth
//   login: (credentials) => api.post('/users/login', credentials),
//   register: (userData) => api.post('/users', userData),
  
//   // Conferences
//   getConferences: () => api.get('/conferences'),
//   getConferenceById: (id) => api.get(`/conferences/${id}`),
//   createConference: (data) => api.post('/conferences', data),
  
//   // Articles
//   getArticles: () => api.get('/articles'),
//   getArticleById: (id) => api.get(`/articles/${id}`),
//   getAuthorArticles: () => api.get('/articles/author'),
//   createArticle: (data) => api.post('/articles', data),
//   updateArticle: (id, data) => api.put(`/articles/${id}`, data),
  
//   // Reviews
//   getReviewsByArticle: (articleId) => api.get(`/reviews/article/${articleId}`),
//   getAssignedReviews: () => api.get('/reviews/assigned'),
//   updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  
//   // Users
//   getUsersByRole: (role) => api.get(`/users/role/${role}`)
// };

// export default apiService;