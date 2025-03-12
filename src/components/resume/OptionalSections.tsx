import { FaPlus, FaMinus } from 'react-icons/fa';
import { optionalSections } from './sectionDefinitions';
import { useResumeContext } from './ResumeContext';

export function OptionalSections() {
  const { enabledOptionalSections, toggleOptionalSection } = useResumeContext();

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Sections</h2>
      <p className="text-sm text-gray-500 mb-4">
        Add more sections to your resume to showcase additional qualifications and information.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {optionalSections.map((section) => (
          <button
            key={section.id}
            onClick={() => toggleOptionalSection(section.id)}
            className={`flex items-center justify-between p-3 rounded-md border transition-colors ${
              enabledOptionalSections.includes(section.id)
                ? 'border-blue-300 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
            }`}
          >
            <div className="flex items-center">
              <section.icon className="mr-2" size={16} />
              <span>{section.title}</span>
            </div>
            <div>
              {enabledOptionalSections.includes(section.id) ? (
                <FaMinus size={14} />
              ) : (
                <FaPlus size={14} />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 