import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveResume, updateResume } from '../services/resume';
import { ResumeData } from '../types/resume';
import { FaSave, FaTimes } from 'react-icons/fa';

interface SaveResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: ResumeData;
  templateId: string;
  colorThemeId: string;
  existingResumeId?: string;
  existingResumeName?: string;
}

export const SaveResumeModal: React.FC<SaveResumeModalProps> = ({
  isOpen,
  onClose,
  resumeData,
  templateId,
  colorThemeId,
  existingResumeId,
  existingResumeName,
}) => {
  const [resumeName, setResumeName] = useState(existingResumeName || '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resumeName.trim()) {
      return setError('Please enter a name for your resume');
    }

    if (!currentUser) {
      return setError('You must be signed in to save a resume');
    }

    setLoading(true);

    try {
      if (existingResumeId) {
        // Update existing resume
        await updateResume(existingResumeId, {
          name: resumeName,
          data: resumeData,
          templateId,
          colorThemeId,
        });
        onClose();
      } else {
        // Save new resume
        const resumeId = await saveResume(
          currentUser.uid,
          resumeName,
          resumeData,
          templateId,
          colorThemeId
        );
        onClose();
        navigate(`/dashboard`);
      }
    } catch (err) {
      console.error('Error saving resume:', err);
      setError('Failed to save your resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center justify-between">
                  <span>{existingResumeId ? 'Update Resume' : 'Save Resume'}</span>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <FaTimes />
                  </button>
                </h3>
                
                {error && (
                  <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <div className="mt-4">
                  <form onSubmit={handleSave}>
                    <div className="mb-4">
                      <label htmlFor="resumeName" className="block text-sm font-medium text-gray-700 mb-1">
                        Resume Name
                      </label>
                      <input
                        type="text"
                        id="resumeName"
                        value={resumeName}
                        onChange={(e) => setResumeName(e.target.value)}
                        placeholder="e.g. Software Developer Resume"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <FaSave className="mr-2" />
                        {loading ? 'Saving...' : existingResumeId ? 'Update' : 'Save'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 