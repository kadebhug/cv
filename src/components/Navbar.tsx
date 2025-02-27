import { Link } from 'react-router-dom'
import { FaFileAlt, FaGithub } from 'react-icons/fa'

export function Navbar() {
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
            <a 
              href="https://github.com/yourusername/resume-builder" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="View on GitHub"
            >
              <FaGithub className="h-5 w-5" />
            </a>
            <Link
              to="/builder"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              Create Resume
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 