import { PDFViewer } from '@react-pdf/renderer'
import { ModernTemplate } from '../templates/ModernTemplate'
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate'
import { CreativeTemplate } from '../templates/CreativeTemplate'
import { ResumeData, Skill } from '../types/resume'
import { mergeWithSampleData } from '../utils/resumeUtils'
import { useState, useEffect } from 'react'

interface ResumePreviewerProps {
  data: ResumeData
  templateId: string
}

const TemplateComponents = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
} as const;

export function ResumePreviewer({ data, templateId }: ResumePreviewerProps) {
  const [showPlaceholders, setShowPlaceholders] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState(templateId);

  // Handle template changes
  useEffect(() => {
    if (templateId !== currentTemplateId) {
      setIsLoading(true);
      // Small delay to ensure clean unmount
      const timer = setTimeout(() => {
        setCurrentTemplateId(templateId);
        setIsLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [templateId, currentTemplateId]);

  // Safely get the template component
  const getTemplateComponent = () => {
    try {
      if (currentTemplateId in TemplateComponents) {
        return TemplateComponents[currentTemplateId as keyof typeof TemplateComponents];
      }
      console.warn(`Template ${currentTemplateId} not found, falling back to ModernTemplate`);
      return ModernTemplate;
    } catch (err) {
      console.error('Error getting template component:', err);
      setError('Failed to load template');
      return ModernTemplate;
    }
  };

  const TemplateComponent = getTemplateComponent();
  
  // Ensure data structure is correct for the template
  const normalizeData = (inputData: ResumeData): ResumeData => {
    try {
      const normalizedSkills = Array.isArray(inputData.skills) 
        ? inputData.skills.map(skill => 
            typeof skill === 'string' 
              ? { name: skill, level: 'intermediate' }
              : skill
          )
        : [];

      return {
        ...inputData,
        skills: normalizedSkills as Skill[],
        personal: {
          ...{  // Default values
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            country: '',
            city: '',
            address: '',
            postalCode: '',
            jobTitle: '',
          },
          ...inputData.personal,  // Overwrite defaults with actual data
        },
        experience: Array.isArray(inputData.experience) ? inputData.experience : [],
        education: Array.isArray(inputData.education) ? inputData.education : [],
        socialLinks: Array.isArray(inputData.socialLinks) ? inputData.socialLinks : [],
        professionalSummary: inputData.professionalSummary || '',
      };
    } catch (err) {
      console.error('Error normalizing data:', err);
      setError('Failed to process resume data');
      return inputData;
    }
  };

  // Merge user data with sample data if showPlaceholders is true and normalize it
  const displayData = normalizeData(
    showPlaceholders ? mergeWithSampleData(data) : data
  );

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Preview</h2>
        <div className="flex items-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showPlaceholders}
              onChange={() => setShowPlaceholders(!showPlaceholders)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              Show placeholders
            </span>
          </label>
        </div>
      </div>
      <div className="h-[800px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <PDFViewer width="100%" height="100%" className="rounded">
            <TemplateComponent data={displayData} />
          </PDFViewer>
        )}
      </div>
    </div>
  );
} 