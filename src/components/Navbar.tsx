import { Link, useNavigate } from 'react-router-dom'
import { FaFileAlt, FaGithub, FaHome, FaInfoCircle, FaUser, FaSignOutAlt, FaPlus, FaCog, FaMoon, FaSun } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { signOut } from '../services/authService'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export function Navbar() {
  const { currentUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
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

  const isDark = theme === 'dark';

  return (
    <div className="sticky top-0 z-40">
      {/* Modern navbar container with updated styling */}
      <nav className={`${isDark ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-800'} border-b sticky top-0 z-30 shadow-sm`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo section with updated styling */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-primary-indigo bg-opacity-20' : 'bg-primary-indigo bg-opacity-10'}`}>
                  <FaFileAlt className={`h-6 w-6 ${isDark ? 'text-primary-indigo' : 'text-primary-indigo'}`} />
                </div>
                <span className={`text-xl font-bold ${isDark ? 'text-primary-indigo' : 'text-primary-indigo'}`}>ResumeBuilder</span>
              </Link>
            </div>
            
            {/* Navigation items with updated styling */}
            <div className="flex items-center space-x-2">
              {/* Theme toggle button */}
              <button
                onClick={toggleTheme}
                className="btn btn-secondary p-2 flex items-center justify-center"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <FaSun className="h-4 w-4" /> : <FaMoon className="h-4 w-4" />}
              </button>

              <Link
                to="/landing"
                className="btn btn-secondary p-2 flex items-center"
                title="About"
              >
                <FaInfoCircle className="mr-2 h-4 w-4" />
                <span className="hidden md:inline-block">About</span>
              </Link>

              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className="btn btn-secondary p-2 flex items-center"
                    title="Dashboard"
                  >
                    <FaHome className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline-block">Dashboard</span>
                  </Link>

                  <Link
                    to="/settings"
                    className="btn btn-secondary p-2 flex items-center"
                    title="Settings"
                  >
                    <FaCog className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline-block">Settings</span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="btn btn-danger p-2 flex items-center"
                    title="Sign Out"
                  >
                    <FaSignOutAlt className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline-block">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-secondary p-2 flex items-center"
                    title="Login"
                  >
                    <FaUser className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline-block">Login</span>
                  </Link>

                  <Link
                    to="/register"
                    className="btn btn-primary p-2 flex items-center"
                    title="Register"
                  >
                    <FaPlus className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline-block">Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    
      <div className="h-0.5 bg-indigo-600"></div>
    </div>
  )
} 