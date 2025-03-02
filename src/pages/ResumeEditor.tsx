import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResumeBuilder } from '../components/ResumeBuilder';
import { getResume } from '../services/resume';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft, FaSpinner } from 'react-icons/fa';

export const ResumeEditor: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<any>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId || !currentUser) return;

      try {
        const resume = await getResume(resumeId);
        
        if (!resume) {
          setError('Resume not found');
          return;
        }

        // Check if the resume belongs to the current user
        if (resume.userId !== currentUser.uid) {
          setError('You do not have permission to edit this resume');
          return;
        }

        setResumeData(resume);
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError('Failed to load the resume. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId, currentUser]);

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resume Not Found</h2>
          <p className="text-gray-700 mb-6">The resume you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={handleBackToDashboard}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Editing: {resumeData.name}</h1>
        </div>
      </div>
      
      <ResumeBuilder 
        initialData={resumeData.data} 
        initialTemplate={resumeData.templateId} 
        initialColorTheme={resumeData.colorThemeId}
        existingResumeId={resumeId}
        existingResumeName={resumeData.name}
      />
    </div>
  );
}; 