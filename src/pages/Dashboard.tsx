import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserResumes, deleteResume, SavedResume } from '../services/resume';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSignOutAlt, FaUser } from 'react-icons/fa';

export const Dashboard: React.FC = () => {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      if (!currentUser) return;
      
      try {
        const userResumes = await getUserResumes(currentUser.uid);
        setResumes(userResumes);
      } catch (err) {
        console.error('Error fetching resumes:', err);
        setError('Failed to load your resumes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [currentUser]);

  const handleDeleteResume = async (resumeId: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await deleteResume(resumeId);
      setResumes(resumes.filter(resume => resume.id !== resumeId));
    } catch (err) {
      console.error('Error deleting resume:', err);
      setError('Failed to delete the resume. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-700">
              <FaUser className="mr-2" />
              {currentUser?.displayName || currentUser?.email}
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <FaSignOutAlt className="mr-1" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Your Saved Resumes</h2>
          <Link
            to="/resume/new"
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Create New Resume
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first resume to get started with your job search journey.
            </p>
            <Link
              to="/resume/new"
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="mr-2" />
              Create New Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{resume.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Last updated: {resume.updatedAt.toDate().toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2">
                    <Link
                      to={`/resume/edit/${resume.id}`}
                      className="flex-1 flex items-center justify-center bg-blue-100 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <FaEdit className="mr-1" />
                      Edit
                    </Link>
                    <Link
                      to={`/resume/view/${resume.id}`}
                      className="flex-1 flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <FaEye className="mr-1" />
                      View
                    </Link>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      className="flex items-center justify-center bg-red-100 text-red-700 px-3 py-2 rounded-md hover:bg-red-200 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}; 