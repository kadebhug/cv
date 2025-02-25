import { Link } from 'react-router-dom'

export function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">ResumeBuilder</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link
              to="/builder"
              className="ml-8 inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Resume
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 