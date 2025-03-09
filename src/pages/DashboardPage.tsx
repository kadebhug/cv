import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserResumes, deleteResume } from '../services/resumeService';
import { getUserCoverLetters, deleteCoverLetter } from '../services/coverLetterService';
import { ResumeData } from '../types/resume';
import { FaPlus, FaEdit, FaTrash, FaEye, FaFileDownload, FaSpinner, FaBriefcase, FaFileAlt, FaEnvelope, FaCalendarCheck, FaSearch, FaUserTie } from 'react-icons/fa';
import { ResumePreviewModal } from '../components/ResumePreviewModal';
import { CoverLetterPreviewModal } from '../components/CoverLetterPreviewModal';
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
  const [previewCoverLetterId, setPreviewCoverLetterId] = useState<string | null>(null);
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

  const handleCoverLetterPreviewClick = (coverId: string) => {
    setPreviewCoverLetterId(coverId);
  };

  const closeCoverLetterPreviewModal = () => {
    setPreviewCoverLetterId(null);
  };

  if (loading && activeTab === 'resumes') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="p-8 flex flex-col items-center">
          <FaSpinner className="animate-spin h-12 w-12 text-indigo-600 mb-4" />
          <p className="text-gray-700 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

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
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {coverLetterError}
        </div>
      );
    }

    if (coverLetters.length === 0) {
      return (
        <div className="p-10 text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-indigo-100 mb-4">
            <FaEnvelope className="h-8 w-8 text-indigo-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No cover letters yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Create custom cover letters for your job applications.
          </p>
          <div className="mt-6">
            <Link
              to="/create-cover-letter"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
            >
              <FaPlus className="-ml-1 mr-2 h-4 w-4" />
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
              className="border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-300 transition-colors duration-300"
            >
              <div className="px-4 py-5 sm:px-6 bg-white border-b border-gray-200">
                <h3 className="text-lg font-medium text-indigo-700 truncate">
                  {letter.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 truncate">
                  {letter.position} at {letter.recipientCompany}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Last updated: {letter.updatedAt?.toLocaleDateString() || 'N/A'}
                </p>
              </div>
              <div className="px-4 py-4 sm:px-6 bg-gray-50">
                <div className="flex justify-between space-x-3">
                  <Link
                    to={`/edit-cover-letter/${letter.id}`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-300"
                  >
                    <FaEdit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => letter.id && handleCoverLetterPreviewClick(letter.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-purple-600 hover:bg-purple-50 hover:border-purple-200 transition-all duration-300"
                  >
                    <FaEye className="mr-2 h-4 w-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => letter.id && setDeleteCoverLetterConfirm(letter.id)}
                    className="inline-flex items-center justify-center p-2 bg-white border border-gray-200 rounded-lg text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-300"
                  >
                    <FaTrash className="h-4 w-4" />
                  </button>
                </div>
                
                {deleteCoverLetterConfirm === letter.id && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700 mb-3">
                      Are you sure you want to delete this cover letter? This action cannot be undone.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => letter.id && handleDeleteCoverLetter(letter.id)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-300"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setDeleteCoverLetterConfirm(null)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
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

      {previewCoverLetterId && (
        <CoverLetterPreviewModal
          coverId={previewCoverLetterId}
          onClose={closeCoverLetterPreviewModal}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          
          {/* User welcome card */}
          <div className="w-full mb-8 bg-indigo-600 rounded-lg">
            <div className="px-6 py-8 flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-8">
                <div className="w-16 h-16 rounded-full bg-indigo-700 flex items-center justify-center text-white">
                  <FaUserTie className="h-8 w-8" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">
                  {currentUser?.email ? currentUser.email.split('@')[0] : 'User'}
                </h2>
                <p className="text-indigo-100 mb-4">
                  Build your professional career with our tools
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1 bg-indigo-700 rounded-full text-xs text-white">
                    {resumes.length} {resumes.length === 1 ? 'Resume' : 'Resumes'}
                  </div>
                  <div className="px-3 py-1 bg-indigo-700 rounded-full text-xs text-white">
                    {coverLetters.length} {coverLetters.length === 1 ? 'Cover Letter' : 'Cover Letters'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {/* Dashboard Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap">
              <button
                onClick={() => setActiveTab('resumes')}
                className={`py-4 px-6 font-medium text-sm flex items-center justify-center transition-all duration-300 border-b-2 ${
                  activeTab === 'resumes'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-300'
                }`}
              >
                <FaFileAlt className="mr-2 h-4 w-4" />
                Resumes
              </button>
              <button
                onClick={() => setActiveTab('coverLetters')}
                className={`py-4 px-6 font-medium text-sm flex items-center justify-center transition-all duration-300 border-b-2 ${
                  activeTab === 'coverLetters'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-300'
                }`}
              >
                <FaEnvelope className="mr-2 h-4 w-4" />
                Cover Letters
              </button>
              <button
                onClick={() => setActiveTab('jobSearch')}
                className={`py-4 px-6 font-medium text-sm flex items-center justify-center transition-all duration-300 border-b-2 ${
                  activeTab === 'jobSearch'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-300'
                }`}
              >
                <FaBriefcase className="mr-2 h-4 w-4" />
                Job Search
              </button>
              
              <button
                onClick={() => setActiveTab('interviews')}
                className={`py-4 px-6 font-medium text-sm flex items-center justify-center transition-all duration-300 border-b-2 ${
                  activeTab === 'interviews'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-300'
                }`}
              >
                <FaCalendarCheck className="mr-2 h-4 w-4" />
                Interviews
              </button>
            </nav>
          </div>

          {error && activeTab === 'resumes' && (
            <div className="m-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Resumes Section */}
          {activeTab === 'resumes' && (
            <div>
              <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">My Resumes</h2>
                <Link
                  to="/create-resume"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
                >
                  <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                  Create New Resume
                </Link>
              </div>
              
              {resumes.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-indigo-100 mb-4">
                    <FaFileAlt className="h-8 w-8 text-indigo-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No resumes yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new resume.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/create-resume"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
                    >
                      <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                      Create New Resume
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {resumes.map((resume) => (
                      <div
                        key={resume.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-300 transition-colors duration-300"
                      >
                        <div className="px-4 py-5 sm:px-6 bg-white border-b border-gray-200">
                          <h3 className="text-lg font-medium text-indigo-700 truncate">
                            {resume.name || `${resume.personal?.firstName || ''} ${resume.personal?.lastName || ''}'s Resume`}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500">
                            Last updated: {resume.updatedAt?.toLocaleDateString() || 'N/A'}
                          </p>
                        </div>
                        <div className="px-4 py-4 sm:px-6 bg-gray-50">
                          <div className="flex justify-between space-x-3">
                            <Link
                              to={`/edit/${resume.id}`}
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-300"
                            >
                              <FaEdit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                            <button
                              onClick={() => resume.id && handlePreviewClick(resume.id)}
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-white border border-gray-200 rounded-lg text-purple-600 hover:bg-purple-50 hover:border-purple-200 transition-all duration-300"
                            >
                              <FaEye className="mr-2 h-4 w-4" />
                              Preview
                            </button>
                            <button
                              onClick={() => resume.id && setDeleteConfirm(resume.id)}
                              className="inline-flex items-center justify-center p-2 bg-white border border-gray-200 rounded-lg text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-300"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>
                          
                          {deleteConfirm === resume.id && (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                              <p className="text-sm text-red-700 mb-3">
                                Are you sure you want to delete this resume? This action cannot be undone.
                              </p>
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => resume.id && handleDeleteResume(resume.id)}
                                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-all duration-300"
                                >
                                  Confirm Delete
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300"
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
            <div>
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Job Search</h2>
                <p className="text-sm text-gray-600">
                  Find and apply for jobs that match your skills and experience
                </p>
              </div>
              <div className="p-6">
                {resumes.length > 0 ? (
                  <JobSearch resumeData={resumes[0]} />
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-indigo-100 mb-4">
                      <FaBriefcase className="h-8 w-8 text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No resume found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You need to create a resume before you can search for jobs.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/create-resume"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
                      >
                        <FaPlus className="-ml-1 mr-2 h-4 w-4" />
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
            <div>
              <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Cover Letters</h2>
                <Link
                  to="/create-cover-letter"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
                >
                  <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                  Create Cover Letter
                </Link>
              </div>
              {renderCoverLettersSection()}
            </div>
          )}

          {/* Interviews Section */}
          {activeTab === 'interviews' && (
            <div>
              <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Interviews</h2>
                <Link
                  to="/create-resume"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
                >
                  <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                  Schedule Interview
                </Link>
              </div>
              <div className="p-10 text-center">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-indigo-100 mb-4">
                  <FaCalendarCheck className="h-8 w-8 text-indigo-500" />
                </div>
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
    </div>
  );
} 