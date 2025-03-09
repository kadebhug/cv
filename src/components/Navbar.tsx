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
    <div className="sticky top-0 z-40">
      {/* Modern navbar container - single level of elevation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-indigo-100">
                  <FaFileAlt className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="text-xl font-bold text-indigo-700">ResumeBuilder</span>
              </Link>
            </div>
            
            {/* Navigation items */}
            <div className="flex items-center space-x-2">
              <Link
                to="/landing"
                className="group p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out flex items-center text-gray-600 hover:text-indigo-600"
                title="About"
              >
                <div className="mr-2 text-gray-400 group-hover:text-indigo-500">
                  <FaInfoCircle className="h-4 w-4" />
                </div>
                <span className="hidden sm:inline text-sm font-medium">About</span>
              </Link>
              
              {currentUser ? (
                <>
                  <Link
                    to="/dashboard"
                    className="group p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out flex items-center text-gray-600 hover:text-indigo-600"
                    title="Dashboard"
                  >
                    <div className="mr-2 text-gray-400 group-hover:text-indigo-500">
                      <FaHome className="h-4 w-4" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">Dashboard</span>
                  </Link>
                  
                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="group p-2 hover:bg-red-50 rounded-lg transition-all duration-300 ease-in-out flex items-center text-gray-600 hover:text-red-600"
                    title="Sign Out"
                  >
                    <div className="mr-2 text-gray-400 group-hover:text-red-500">
                      <FaSignOutAlt className="h-4 w-4" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">Sign Out</span>
                  </button>
                  
                  <Link
                    to="/create-resume"
                    className="ml-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 flex items-center"
                  >
                    <FaPlus className="mr-2 h-3 w-3" />
                    <span className="text-sm font-medium">Create</span>
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="group p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out flex items-center text-gray-600 hover:text-indigo-600"
                  title="Sign In"
                >
                  <div className="mr-2 text-gray-400 group-hover:text-indigo-500">
                    <FaUser className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">Sign In</span>
                </Link>
              )}
              
              <a 
                href="https://github.com/kadeesterline/resume-builder" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 text-gray-500 hover:text-gray-700"
                title="View on GitHub"
              >
                <FaGithub className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Color accent line under the navbar */}
      <div className="h-1 bg-indigo-600"></div>
    </div>
  )
} 