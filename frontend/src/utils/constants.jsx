// API Base URL
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// User Roles
export const USER_ROLES = {
  ORGANIZER: 'organizer',
  REVIEWER: 'reviewer',
  AUTHOR: 'author'
};

// Article Status
export const ARTICLE_STATUS = {
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under review',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

// Review Status
export const REVIEW_STATUS = {
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  NEEDS_REVISION: 'needs revision'
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  AUTHOR_DASHBOARD: '/author/dashboard',
  REVIEWER_DASHBOARD: '/reviewer/dashboard',
  ORGANIZER_DASHBOARD: '/organizer/dashboard',
  CREATE_CONFERENCE: '/conferences/create',
  CREATE_ARTICLE: '/articles/create',
  REVIEW_ARTICLE: '/articles/:id/review'
};

// Form Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  TITLE_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  CONTENT_MIN_LENGTH: 100
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long.`
};

// Success Messages
export const SUCCESS_MESSAGES = {
  ARTICLE_CREATED: 'Article submitted successfully.',
  REVIEW_SUBMITTED: 'Review submitted successfully.',
  CONFERENCE_CREATED: 'Conference created successfully.',
  REGISTRATION_SUCCESS: 'Registration successful. Please log in.',
  PROFILE_UPDATED: 'Profile updated successfully.'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50
};