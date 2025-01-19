import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-semibold">Conference Manager</span>
            </Link>
            {user && (
              <div className="ml-10 flex items-center space-x-4">
                <Link to="/conferences" className="text-gray-700 hover:text-gray-900">
                  Conferences
                </Link>
                {user.role === 'author' && (
                  <Link to="/articles" className="text-gray-700 hover:text-gray-900">
                    My Articles
                  </Link>
                )}
                {user.role === 'reviewer' && (
                  <Link to="/reviews" className="text-gray-700 hover:text-gray-900">
                    My Reviews
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-gray-900">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;