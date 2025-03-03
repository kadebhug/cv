import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { ResumePreviewer } from './ResumePreviewer';
import { ResumeData } from '../types/resume';
import { getResume } from '../services/resumeService';
import { ColorTheme } from './ResumePreviewer';

interface ResumePreviewModalProps {
  resumeId: string;
  onClose: () => void;
}

export function ResumePreviewModal({ resumeId, onClose }: ResumePreviewModalProps) {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setLoading(true);
        const data = await getResume(resumeId);
        console.log('Resume data fetched in modal:', data);
        console.log('Education:', data?.education);
        console.log('Experience:', data?.experience);
        console.log('Skills:', data?.skills);
        setResumeData(data);
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError('Failed to load resume. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, [resumeId]);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Default color theme
  const defaultColorTheme: ColorTheme = {
    id: 'blue',
    name: 'Blue',
    primary: '#3b82f6',
    secondary: '#93c5fd',
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-semibold text-gray-800">Resume Preview</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-grow overflow-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          ) : resumeData ? (
            <ResumePreviewer 
              data={resumeData} 
              templateId={resumeData.theme?.template || 'modern'} 
              colorTheme={defaultColorTheme}
              showSampleData={false}
            />
          ) : (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-yellow-700">Resume not found.</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 