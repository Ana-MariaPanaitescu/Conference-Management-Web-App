import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Article-related API calls
export const createArticle = async (articleData) => {
  try {
    const response = await api.post('/articles', articleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAuthorArticles = async (authorId) => {
  try {
    const response = await api.get(`/articles/author/${authorId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

// You might want to add these additional article-related functions
export const getArticleById = async (articleId) => {
  try {
    const response = await api.get(`/articles/${articleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateArticle = async (articleId, articleData) => {
  try {
    const response = await api.put(`/articles/${articleId}`, articleData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteArticle = async (articleId) => {
  try {
    const response = await api.delete(`/articles/${articleId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;