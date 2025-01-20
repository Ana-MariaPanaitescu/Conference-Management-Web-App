import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Navbar from './components/common/Navbar';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Common Components
import Dashboard from './components/common/Dashboard';

// Conference Components
import ConferenceList from './components/conference/ConferenceList';
import ConferenceCreate from './components/conference/ConferenceCreate';
import ConferenceDetails from './components/conference/ConferenceDetails';

// Article Components
import ArticleList from './components/article/ArticleList';
import ArticleCreate from './components/article/ArticleCreate';
import ArticleDetails from './components/article/ArticleDetails';

// Review Components
import ReviewList from './components/review/ReviewList';

import { USER_ROLES } from './utils/constants';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              {/* Conference Routes */}
              <Route
                path="/conferences"
                element={
                  <PrivateRoute>
                    <ConferenceList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/conferences/create"
                element={
                  <PrivateRoute roles={[USER_ROLES.ORGANIZER]}>
                    <ConferenceCreate />
                  </PrivateRoute>
                }
              />
              <Route
                path="/conferences/:id"
                element={
                  <PrivateRoute>
                    <ConferenceDetails />
                  </PrivateRoute>
                }
              />

              {/* Article Routes */}
              <Route
                path="/articles"
                element={
                  <PrivateRoute>
                    <ArticleList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/articles/create"
                element={
                  <PrivateRoute roles={[USER_ROLES.AUTHOR]}>
                    <ArticleCreate />
                  </PrivateRoute>
                }
              />
              <Route
                path="/articles/:id"
                element={
                  <PrivateRoute>
                    <ArticleDetails />
                  </PrivateRoute>
                }
              />

              {/* Review Routes */}
              <Route
                path="/reviews"
                element={
                  <PrivateRoute roles={[USER_ROLES.REVIEWER]}>
                    <ReviewList />
                  </PrivateRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;