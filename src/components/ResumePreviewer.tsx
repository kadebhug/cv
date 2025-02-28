import { PDFViewer } from '@react-pdf/renderer'
import { ModernTemplate } from '../templates/ModernTemplate'
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate'
import { CreativeTemplate } from '../templates/CreativeTemplate'
import { ExecutiveTemplate } from '../templates/ExecutiveTemplate'
import { MinimalistTemplate } from '../templates/MinimalistTemplate'
import { ResumeData, Skill } from '../types/resume'
import { mergeWithSampleData } from '../utils/resumeUtils'
import { useState, useEffect } from 'react'
import { FaDownload, FaExpand, FaCompress, FaEye, FaEyeSlash, FaMobileAlt, FaDesktop } from 'react-icons/fa'

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
}

const defaultColorTheme: ColorTheme = {
  id: 'blue',
  name: 'Blue',
  primary: '#3b82f6',
  secondary: '#93c5fd',
};

interface ResumePreviewerProps {
  data: ResumeData
  templateId: string
  colorTheme?: ColorTheme
}

const TemplateComponents = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  minimalist: MinimalistTemplate,
} as const;

export function ResumePreviewer({ data, templateId, colorTheme = defaultColorTheme }: ResumePreviewerProps) {
  const [showPlaceholders, setShowPlaceholders] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState(templateId);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

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

  // Toggle fullscreen preview
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Toggle mobile view
  const toggleMobileView = () => {
    setIsMobileView(!isMobileView);
  };

  // Handle download (placeholder for future implementation)
  const handleDownload = () => {
    alert('Download functionality will be implemented soon!');
    // Future implementation: Generate and download PDF
  };

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Calculate appropriate height based on screen size and fullscreen state
  const getViewerHeight = () => {
    if (isFullscreen) {
      return 'h-[calc(100vh-120px)]';
    } else if (isMobile) {
      return 'h-[500px]';
    } else {
      return 'h-full min-h-[700px]';
    }
  };

  return (
    <div className={`bg-white shadow-sm rounded-lg transition-all duration-300 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 p-4' : 'p-4 h-full'}`}>
      <div className="flex flex-wrap justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-2 sm:mb-0">Resume Preview</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowPlaceholders(!showPlaceholders)}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            title={showPlaceholders ? "Hide placeholders" : "Show placeholders"}
          >
            {showPlaceholders ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
          </button>
          <button 
            onClick={toggleMobileView}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            title={isMobileView ? "Desktop view" : "Mobile view"}
          >
            {isMobileView ? <FaDesktop size={14} /> : <FaMobileAlt size={14} />}
          </button>
          <button 
            onClick={handleDownload}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            title="Download PDF"
          >
            <FaDownload size={14} />
          </button>
          <button 
            onClick={toggleFullscreen}
            className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen preview"}
          >
            {isFullscreen ? <FaCompress size={14} /> : <FaExpand size={14} />}
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center mb-3 gap-3">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showPlaceholders}
            onChange={() => setShowPlaceholders(!showPlaceholders)}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-700">
            Show sample data
          </span>
        </label>
      </div>
      
      <div className={`${getViewerHeight()} ${isMobileView ? 'max-w-[375px] mx-auto' : 'w-full'} flex-grow`}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <PDFViewer 
            width="100%" 
            height="100%" 
            className="rounded border border-gray-200"
            showToolbar={!isMobile}
          >
            <TemplateComponent data={displayData} colorTheme={colorTheme} />
          </PDFViewer>
        )}
      </div>
    </div>
  );
} 