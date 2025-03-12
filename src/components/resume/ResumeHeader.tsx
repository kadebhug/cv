import { FaLayerGroup, FaSave, FaSpinner } from 'react-icons/fa';
import { useResumeContext } from './ResumeContext';

export function ResumeHeader() {
  const { 
    isSaving, 
    saveSuccess, 
    saveError, 
    handleSaveResume, 
    setShowTemplateSelector 
  } = useResumeContext();

  return (
    <>
      {/* Header with Save Button */}
      <div className="hidden md:flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="btn btn-secondary flex items-center"
          >
            <FaLayerGroup className="mr-2" size={16} />
            Change Template
          </button>
          <button
            onClick={handleSaveResume}
            disabled={isSaving}
            className="btn btn-primary flex items-center"
          >
            {isSaving ? (
              <>
                <FaSpinner className="animate-spin mr-2" size={16} />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" size={16} />
                Save Resume
              </>
            )}
          </button>
        </div>
      </div>
      
      {saveSuccess && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
          Resume saved successfully!
        </div>
      )}
      
      {saveError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {saveError}
        </div>
      )}
    </>
  );
} 