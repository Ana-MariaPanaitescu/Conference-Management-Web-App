import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ConferenceList from './pages/conference/ConferenceList';
import ConferenceDetail from './pages/conference/ConferenceDetail';
import ArticleSubmission from './pages/conference/ArticleSubmission';
import ReviewDashboard from './pages/conference/ReviewDashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/conferences"
                element={
                  <PrivateRoute>
                    <ConferenceList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/conferences/:id"
                element={
                  <PrivateRoute>
                    <ConferenceDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/conferences/:id/submit"
                element={
                  <PrivateRoute>
                    <ArticleSubmission />
                  </PrivateRoute>
                }
              />
              <Route
                path="/reviews"
                element={
                  <PrivateRoute>
                    <ReviewDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;