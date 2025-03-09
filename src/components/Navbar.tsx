import { Link, useNavigate } from 'react-router-dom'
import { FaFileAlt, FaGithub, FaHome, FaInfoCircle, FaUser, FaSignOutAlt, FaPlus, FaCog } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'
import { signOut } from '../services/authService'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export function Navbar() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
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
    <div className="sticky top-0 z-40">
      {/* Modern navbar container - single level of elevation */}
      <nav className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-800'} border-b sticky top-0 z-30`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                  <FaFileAlt className={`h-6 w-6 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} />
                </div>
                <span className={`text-xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>ResumeBuilder</span>
              </Link>
            </div>
            
            {/* Navigation items */}
            <div className="flex items-center space-x-2">
              <Link
                to="/landing"
                className={`group p-2 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-all duration-300 ease-in-out flex items-center ${theme === 'dark' ? 'text-gray-300 hover:text-indigo-300' : 'text-gray-600 hover:text-indigo-600'}`}
                title="About"
              >
                <div className={`mr-2 ${theme === 'dark' ? 'text-gray-500 group-hover:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-500'}`}>
                  <FaInfoCircle className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline text-sm font-medium">About</span>
              </Link>
              
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className={`group p-2 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-all duration-300 ease-in-out flex items-center ${theme === 'dark' ? 'text-gray-300 hover:text-indigo-300' : 'text-gray-600 hover:text-indigo-600'}`}
                    title="Dashboard"
                  >
                    <div className={`mr-2 ${theme === 'dark' ? 'text-gray-500 group-hover:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-500'}`}>
                      <FaHome className="h-4 w-4" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
                  </Link>
                  
                  <Link
                    to="/settings"
                    className={`group p-2 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-all duration-300 ease-in-out flex items-center ${theme === 'dark' ? 'text-gray-300 hover:text-indigo-300' : 'text-gray-600 hover:text-indigo-600'}`}
                    title="Settings"
                  >
                    <div className={`mr-2 ${theme === 'dark' ? 'text-gray-500 group-hover:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-500'}`}>
                      <FaCog className="h-4 w-4" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">Settings</span>
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className={`group p-2 ${theme === 'dark' ? 'hover:bg-red-900' : 'hover:bg-red-50'} rounded-lg transition-all duration-300 ease-in-out flex items-center ${theme === 'dark' ? 'text-gray-300 hover:text-red-300' : 'text-gray-600 hover:text-red-600'}`}
                    title="Sign Out"
                  >
                    <div className={`mr-2 ${theme === 'dark' ? 'text-gray-500 group-hover:text-red-400' : 'text-gray-400 group-hover:text-red-500'}`}>
                      <FaSignOutAlt className="h-4 w-4" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={`group p-2 ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-lg transition-all duration-300 ease-in-out flex items-center ${theme === 'dark' ? 'text-gray-300 hover:text-indigo-300' : 'text-gray-600 hover:text-indigo-600'}`}
                  title="Sign In"
                >
                  <div className={`mr-2 ${theme === 'dark' ? 'text-gray-500 group-hover:text-indigo-400' : 'text-gray-400 group-hover:text-indigo-500'}`}>
                    <FaUser className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    
      <div className="h-0.5 bg-indigo-600"></div>
    </div>
  )
} 