import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import Navbar from './components/common/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/common/Dashboard';
import ConferenceList from './components/conference/ConferenceList';
import ConferenceCreate from './components/conference/ConferenceCreate';
import ConferenceDetails from './components/conference/ConferenceDetails';
import ArticleList from './components/article/ArticleList';
import ArticleCreate from './components/article/ArticleCreate';
import ArticleDetails from './components/article/ArticleDetails';
import ReviewForm from './components/review/ReviewForm';
import ReviewList from './components/review/ReviewList';
import { USER_ROLES } from './utils/constants';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private routes */}
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

              {/* Conference routes */}
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

              {/* Article routes */}
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

              {/* Review routes */}
              <Route
                path="/reviews"
                element={
                  <PrivateRoute roles={[USER_ROLES.REVIEWER]}>
                    <ReviewList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/articles/:id/review"
                element={
                  <PrivateRoute roles={[USER_ROLES.REVIEWER]}>
                    <ReviewForm />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;