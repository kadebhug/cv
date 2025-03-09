import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaSpinner, FaTimes } from 'react-icons/fa';

interface JobDescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobDescription: string) => void;
  isLoading: boolean;
}

export function JobDescriptionModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  isLoading 
}: JobDescriptionModalProps) {
  const { theme } = useTheme();
  const [jobDescription, setJobDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }
    
    if (jobDescription.trim().length < 50) {
      setError('Please provide a more detailed job description (at least 50 characters)');
      return;
    }
    
    setError(null);
    onSubmit(jobDescription);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-500'} opacity-75`}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div 
          className={`inline-block align-bottom ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full`}
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="modal-headline"
        >
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-500'} focus:outline-none`}
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <FaTimes className="h-5 w-5" />
            </button>
          </div>
          
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 
                  className={`text-lg leading-6 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} 
                  id="modal-headline"
                >
                  Job Description
                </h3>
                <div className="mt-2">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    Paste the job description below to generate a tailored cover letter.
                  </p>
                  
                  {error && (
                    <div className={`mt-2 ${theme === 'dark' ? 'bg-red-900 border-l-4 border-red-600 p-4' : 'bg-red-50 border-l-4 border-red-400 p-4'}`}>
                      <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                        {error}
                      </p>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="mt-4">
                    <textarea
                      className={`w-full px-3 py-2 text-base ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                          : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                      } rounded-md transition-colors`}
                      rows={10}
                      placeholder="Paste the job description here..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      disabled={isLoading}
                    />
                    
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                          theme === 'dark'
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
                        } text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                          isLoading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Generating...
                          </>
                        ) : (
                          'Generate Cover Letter'
                        )}
                      </button>
                      <button
                        type="button"
                        className={`mt-3 w-full inline-flex justify-center rounded-md border ${
                          theme === 'dark'
                            ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        } shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm`}
                        onClick={onClose}
                        disabled={isLoading}
                      >
                        Cancel
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
} 