import { Link, useNavigate } from 'react-router-dom'
import { FaFileAlt, FaGithub, FaHome, FaInfoCircle, FaUser, FaSignOutAlt, FaPlus } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { signOut } from '../services/authService'
import { useState } from 'react'

export function Navbar() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaFileAlt className="h-6 w-6 text-indigo-600" />
              <span className="text-xl font-bold text-indigo-600">ResumeBuilder</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/landing"
              className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
              title="About"
            >
              <FaInfoCircle className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">About</span>
            </Link>
            
            {currentUser ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                  title="Dashboard"
                >
                  <FaHome className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                  title="Sign Out"
                >
                  <FaSignOutAlt className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
                title="Sign In"
              >
                <FaUser className="h-5 w-5 mr-1" />
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}
          
          </div>
        </div>
      </div>
    </nav>
  )
} 