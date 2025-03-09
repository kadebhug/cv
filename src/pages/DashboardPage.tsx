import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserResumes, deleteResume } from '../services/resumeService';
import { getUserCoverLetters, deleteCoverLetter } from '../services/coverLetterService';
import { ResumeData } from '../types/resume';
import { FaPlus, FaEdit, FaTrash, FaEye, FaFileDownload, FaSpinner, FaBriefcase, FaFileAlt, FaEnvelope, FaCalendarCheck } from 'react-icons/fa';
import { ResumePreviewModal } from '../components/ResumePreviewModal';
import { JobSearch } from '../components/JobSearch';

// Cover Letter Data Interface
interface CoverLetterData {
  id?: string;
  name: string;
  recipientName: string;
  recipientCompany: string;
  position: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [coverLettersLoading, setCoverLettersLoading] = useState(true);
  const [error, setError] = useState('');
  const [coverLetterError, setCoverLetterError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteCoverLetterConfirm, setDeleteCoverLetterConfirm] = useState<string | null>(null);
  const [previewResumeId, setPreviewResumeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'resumes' | 'jobSearch' | 'coverLetters' | 'interviews'>('resumes');
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to initialize before checking user
    if (authLoading) return;
    
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchResumes = async () => {
      try {
        console.log('Fetching resumes for user:', currentUser.uid);
        const userResumes = await getUserResumes(currentUser.uid);
        setResumes(userResumes);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        setError('Failed to load your resumes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCoverLetters = async () => {
      try {
        console.log('Fetching cover letters for user:', currentUser.uid);
        const userCoverLetters = await getUserCoverLetters(currentUser.uid);
        setCoverLetters(userCoverLetters);
      } catch (error) {
        console.error('Error fetching cover letters:', error);
        setCoverLetterError('Failed to load your cover letters. Please try again later.');
      } finally {
        setCoverLettersLoading(false);
      }
    };

    fetchResumes();
    fetchCoverLetters();
  }, [currentUser, navigate, authLoading]);

  const handleDeleteResume = async (resumeId: string) => {
    try {
      await deleteResume(resumeId);
      setResumes(resumes.filter(resume => resume.id !== resumeId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting resume:', error);
      setError('Failed to delete resume. Please try again.');
    }
  };

  const handleDeleteCoverLetter = async (coverId: string) => {
    try {
      await deleteCoverLetter(coverId);
      setCoverLetters(coverLetters.filter(letter => letter.id !== coverId));
      setDeleteCoverLetterConfirm(null);
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      setCoverLetterError('Failed to delete cover letter. Please try again.');
    }
  };

  const handlePreviewClick = (resumeId: string) => {
    setPreviewResumeId(resumeId);
  };

  const closePreviewModal = () => {
    setPreviewResumeId(null);
  };

  if (loading && activeTab === 'resumes') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  // ... rest of the component code

  {/* Cover Letters Section */}
  const renderCoverLettersSection = () => {
    if (coverLettersLoading) {
      return (
        <div className="flex justify-center py-8">
          <FaSpinner className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
          <p className="ml-3 text-gray-600">Loading your cover letters...</p>
        </div>
      );
    }

    if (coverLetterError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {coverLetterError}
        </div>
      );
    }

    if (coverLetters.length === 0) {
      return (
        <div className="p-10 text-center">
          <FaEnvelope className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No cover letters yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create custom cover letters for your job applications.
          </p>
          <div className="mt-6">
            <Link
              to="/create-cover-letter"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaPlus className="-ml-1 mr-2 h-5 w-5" />
              Create Cover Letter
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coverLetters.map((letter) => (
            <div
              key={letter.id}
              className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
            >
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {letter.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 truncate">
                  {letter.position} at {letter.recipientCompany}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Last updated: {letter.updatedAt?.toLocaleDateString() || 'N/A'}
                </p>
              </div>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex justify-between space-x-3">
                  <Link
                    to={`/edit-cover-letter/${letter.id}`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FaEdit className="-ml-0.5 mr-2 h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => letter.id && setDeleteCoverLetterConfirm(letter.id)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaTrash className="-ml-0.5 mr-2 h-4 w-4" />
                    Delete
                  </button>
                </div>
                
                {deleteCoverLetterConfirm === letter.id && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-sm text-red-700 mb-3">
                      Are you sure you want to delete this cover letter? This action cannot be undone.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => letter.id && handleDeleteCoverLetter(letter.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteCoverLetterConfirm(null)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {previewResumeId && (
        <ResumePreviewModal 
          resumeId={previewResumeId} 
          onClose={closePreviewModal} 
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
          
          {/* Dashboard Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('resumes')}
                className={`${
                  activeTab === 'resumes'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <FaFileAlt className="mr-2" />
                Resumes
              </button>
              <button
                onClick={() => setActiveTab('jobSearch')}
                className={`${
                  activeTab === 'jobSearch'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <FaBriefcase className="mr-2" />
                Job Search
              </button>
              <button
                onClick={() => setActiveTab('coverLetters')}
                className={`${
                  activeTab === 'coverLetters'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <FaEnvelope className="mr-2" />
                Cover Letters
              </button>
              <button
                onClick={() => setActiveTab('interviews')}
                className={`${
                  activeTab === 'interviews'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <FaCalendarCheck className="mr-2" />
                Interviews
              </button>
            </nav>
          </div>
        </div>

        {error && activeTab === 'resumes' && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Resumes Section */}
        {activeTab === 'resumes' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="p-4 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">My Resumes</h2>
              <Link
                to="/create-resume"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                Create New Resume
              </Link>
            </div>
            
            {resumes.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No resumes yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new resume.
                </p>
                <div className="mt-6">
                  <Link
                    to="/create-resume"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                    Create New Resume
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:px-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
                    >
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {resume.name || `${resume.personal?.firstName || ''} ${resume.personal?.lastName || ''}'s Resume`}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Last updated: {resume.updatedAt?.toLocaleDateString() || 'N/A'}
                        </p>
                      </div>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex justify-between space-x-3">
                          <Link
                            to={`/edit/${resume.id}`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <FaEdit className="-ml-0.5 mr-2 h-4 w-4" />
                            Edit
                          </Link>
                          <button
                            onClick={() => resume.id && handlePreviewClick(resume.id)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <FaEye className="-ml-0.5 mr-2 h-4 w-4" />
                            Preview
                          </button>
                          <button
                            onClick={() => resume.id && setDeleteConfirm(resume.id)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <FaTrash className="-ml-0.5 mr-2 h-4 w-4" />
                            Delete
                          </button>
                        </div>
                        
                        {deleteConfirm === resume.id && (
                          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-sm text-red-700 mb-3">
                              Are you sure you want to delete this resume? This action cannot be undone.
                            </p>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => resume.id && handleDeleteResume(resume.id)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                Confirm Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Job Search Section */}
        {activeTab === 'jobSearch' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="p-4 border-b border-gray-200 sm:px-6">
              <h2 className="text-xl font-medium text-gray-900">Job Search</h2>
              <p className="mt-1 text-sm text-gray-500">
                Find and apply for jobs that match your skills and experience
              </p>
            </div>
            <div className="p-4 sm:p-6">
              {resumes.length > 0 ? (
                <JobSearch resumeData={resumes[0]} />
              ) : (
                <div className="text-center py-8">
                  <FaBriefcase className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">No resume found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You need to create a resume before you can search for jobs.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/create-resume"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                      Create New Resume
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cover Letters Section */}
        {activeTab === 'coverLetters' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="p-4 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">Cover Letters</h2>
              <Link
                to="/create-cover-letter"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                Create Cover Letter
              </Link>
            </div>
            {renderCoverLettersSection()}
          </div>
        )}

        {/* Interviews Section */}
        {activeTab === 'interviews' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="p-4 border-b border-gray-200 sm:px-6 flex justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">Interviews</h2>
              <Link
                to="/create-resume"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                Schedule Interview
              </Link>
            </div>
            <div className="p-10 text-center">
              <FaCalendarCheck className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No interviews scheduled</h3>
              <p className="mt-1 text-sm text-gray-500">
                Track and prepare for your upcoming interviews.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Coming soon! This feature is under development.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 