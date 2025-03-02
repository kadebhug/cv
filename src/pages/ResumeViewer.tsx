import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFViewer } from '../components/PDFViewer';
import { getResumeById } from '../services/resumeService';
import { useAuth } from '../contexts/AuthContext';
import { ResumeData } from '../types/resume';
import { DEFAULT_THEMES } from '../components/ResumePreviewer';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';

export const ResumeViewer: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId || !currentUser) {
        setError('Resume not found');
        setLoading(false);
        return;
      }

      try {
        const resumeData = await getResumeById(resumeId, currentUser.uid);
        if (!resumeData) {
          setError('Resume not found');
        } else {
          setResume(resumeData);
        }
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError('Failed to load resume');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId, currentUser]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleEditResume = () => {
    if (resumeId) {
      navigate(`/resume/edit/${resumeId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-3 text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Resume not found'}</p>
          <button
            onClick={handleBackToDashboard}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Get the color theme from the resume or use a default
  const colorTheme = DEFAULT_THEMES[resume.theme?.color || 'blue'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBackToDashboard}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </button>
        
        <button
          onClick={handleEditResume}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <FaEdit className="mr-2" />
          Edit Resume
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <PDFViewer
          resumeData={resume}
          templateId={resume.theme?.template || 'modern'}
          colorTheme={colorTheme}
          fileName={`${resume.personal.firstName}_${resume.personal.lastName}_Resume`}
          showToolbar={true}
        />
      </div>
    </div>
  );
}; 