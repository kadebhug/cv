import { FaSave, FaSpinner, FaLayerGroup } from 'react-icons/fa';
import { useResumeContext } from './ResumeContext';

export function MobileHeader() {
  const { isSaving, handleSaveResume, setShowTemplateSelector } = useResumeContext();

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-30 shadow-sm px-4 py-3 flex justify-between items-center">
      <h1 className="font-bold text-gray-900 text-lg">Resume Builder</h1>
      <div className="flex items-center space-x-2">
        <button 
          onClick={handleSaveResume}
          disabled={isSaving}
          className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSaving ? <FaSpinner className="animate-spin" size={18} /> : <FaSave size={18} />}
        </button>
        <button 
          onClick={() => setShowTemplateSelector(true)}
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
        >
          <FaLayerGroup size={18} />
        </button>
      </div>
    </div>
  );
} 