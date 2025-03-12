import { ResumeForm } from '../ResumeForm';
import { LinkedInImport } from '../LinkedInImport';
import { useResumeContext } from './ResumeContext';
import { coreSections, optionalSections } from './sectionDefinitions';
import { ResumeScore } from './ResumeScore';
import { FeedbackPanel } from './FeedbackPanel';
import { OptionalSections } from './OptionalSections';
import { ColorThemeSelector } from './ColorThemeSelector';
import { ResumeHeader } from './ResumeHeader';
import { BiTrash } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';

export function ResumeContent() {
  const { 
    sectionRefs, 
    enabledOptionalSections, 
    toggleOptionalSection,
    handleLinkedInImport
  } = useResumeContext();

  return (
    <div className="space-y-8">
      <ResumeHeader />
      <ResumeScore />
      <FeedbackPanel />

      {/* Core Sections */}
      {coreSections.map((section) => (
        <div 
          key={section.id}
          ref={el => sectionRefs.current[section.id] = el}
          className="bg-white shadow-sm rounded-lg p-6"
          id={`section-${section.id}`}
        >
          <ResumeForm section={section.id} />
        </div>
      ))}

      {/* Enabled Optional Sections */}
      {enabledOptionalSections.map((sectionId) => {
        const section = optionalSections.find(s => s.id === sectionId);
        if (!section) return null;
        
        return (
          <div 
            key={section.id}
            ref={el => sectionRefs.current[section.id] = el}
            className="bg-white shadow-sm rounded-lg p-6"
            id={`section-${section.id}`}
          >
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <section.icon className="mr-2" size={20} />
                  {section.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {section.description}
                </p>
              </div>
              <button
                onClick={() => toggleOptionalSection(section.id)}
                className="bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
                title="Remove section"
              >
                <FaTrash className="w-3.5 h-3.5" />
              </button>
            </div>

            <ResumeForm section={section.id} />

          </div>
        );
      })}

      {/* Optional Sections Toggle */}
      <OptionalSections />
      
      {/* Color Theme Selection */}
      <ColorThemeSelector />
    </div>
  );
} 