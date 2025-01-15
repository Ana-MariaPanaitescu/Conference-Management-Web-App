import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ConferenceList from './pages/ConferenceList';
import ArticleSubmission from './pages/ArticleSubmission';
import ReviewDashboard from './pages/ReviewDashboard';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <div className="container mx-auto px-4 py-8">
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
              path="/submit-article" 
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;