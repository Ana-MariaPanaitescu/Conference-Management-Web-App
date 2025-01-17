import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ConferenceList from './components/conference/ConferenceList';
import ConferenceCreate from './components/conference/ConferenceCreate';
import ArticleList from './components/article/ArticleList';
import ArticleCreate from './components/article/ArticleCreate';
import ArticleReview from './components/article/ArticleReview';
import OrganizerDashboard from './components/dashboard/OrganizerDashboard';
import ReviewerDashboard from './components/dashboard/ReviewerDashboard';
import AuthorDashboard from './components/dashboard/AuthorDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    {(user) => {
                      switch (user.role) {
                        case 'organizer':
                          return <OrganizerDashboard />;
                        case 'reviewer':
                          return <ReviewerDashboard />;
                        case 'author':
                          return <AuthorDashboard />;
                        default:
                          return <Navigate to="/login" />;
                      }
                    }}
                  </PrivateRoute>
                } 
              />
              <Route path="/conferences" element={<ConferenceList />} />
              <Route 
                path="/conferences/create" 
                element={
                  <PrivateRoute roles={['organizer']}>
                    <ConferenceCreate />
                  </PrivateRoute>
                } 
              />
              <Route path="/articles" element={<ArticleList />} />
              <Route 
                path="/articles/create" 
                element={
                  <PrivateRoute roles={['author']}>
                    <ArticleCreate />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/articles/:id/review" 
                element={
                  <PrivateRoute roles={['reviewer']}>
                    <ArticleReview />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;