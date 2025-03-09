import { PDFViewer } from '@react-pdf/renderer'
import { ModernTemplate } from '../templates/ModernTemplate'
import { ProfessionalTemplate } from '../templates/ProfessionalTemplate'
import { CreativeTemplate } from '../templates/CreativeTemplate'
import { ExecutiveTemplate } from '../templates/ExecutiveTemplate'
import { MinimalistTemplate } from '../templates/MinimalistTemplate'
import { TechTemplate } from '../templates/TechTemplate'
import { AcademicTemplate } from '../templates/AcademicTemplate'
import { ResumeData, Skill } from '../types/resume'
import { mergeWithSampleData } from '../utils/resumeUtils'
import { useState, useEffect } from 'react'
import { FaDownload, FaExpand, FaCompress, FaEye, FaEyeSlash, FaMobileAlt, FaDesktop } from 'react-icons/fa'
import { defaultColorTheme } from '../utils/themeUtils'
import { useTheme } from '../contexts/ThemeContext'

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
}

interface ResumePreviewerProps {
  data: ResumeData
  templateId: string
  colorTheme?: ColorTheme
  showSampleData?: boolean
}

const TemplateComponents = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  executive: ExecutiveTemplate,
  minimalist: MinimalistTemplate,
  tech: TechTemplate,
  academic: AcademicTemplate,
  medical: ProfessionalTemplate,
  legal: ExecutiveTemplate,
  engineering: TechTemplate,
  finance: ExecutiveTemplate,
  sales: ModernTemplate,
} as const;

export function ResumePreviewer({ 
  data, 
  templateId, 
  colorTheme = defaultColorTheme,
  showSampleData = false
}: ResumePreviewerProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [showSample, setShowSample] = useState(showSampleData);
  const [mobileView, setMobileView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    // Update showSample when showSampleData prop changes
    setShowSample(showSampleData);
  }, [showSampleData]);

  const getTemplateComponent = () => {
    const TemplateComponent = TemplateComponents[templateId as keyof typeof TemplateComponents] || TemplateComponents.modern;
    
    // Prepare data - use sample data if needed
    const resumeData = showSample ? mergeWithSampleData(data) : normalizeData(data);
    
    return <TemplateComponent data={resumeData} colorTheme={colorTheme} />;
  };

  const normalizeData = (inputData: ResumeData): ResumeData => {
    // Create a deep copy to avoid modifying the original
    const normalizedData = JSON.parse(JSON.stringify(inputData));
    
    // Ensure skills have a level if not specified
    if (normalizedData.skills) {
      normalizedData.skills = normalizedData.skills.map((skill: Skill) => {
        if (!skill.level) {
          return { ...skill, level: 'intermediate' };
        }
        return skill;
      });
    }
    
    // Ensure experience items have a description
    if (normalizedData.experience) {
      normalizedData.experience = normalizedData.experience.map((exp: any) => {
        if (!exp.description) {
          return { ...exp, description: '' };
        }
        return exp;
      });
    }
    
    return normalizedData;
  };

  const isDataMostlyEmpty = () => {
    // Check if most of the data is empty
    const { personal, experience, education, skills } = data;
    
    const hasPersonal = personal && (personal.firstName || personal.lastName);
    const hasExperience = experience && experience.length > 0;
    const hasEducation = education && education.length > 0;
    const hasSkills = skills && skills.length > 0;
    
    return !hasPersonal || (!hasExperience && !hasEducation && !hasSkills);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const toggleMobileView = () => {
    setMobileView(!mobileView);
  };

  const handleDownload = () => {
    // This would be handled by the PDF library
    console.log('Download functionality would be implemented here');
    // In a real implementation, you would trigger the PDF download
  };

  const getViewerHeight = () => {
    if (fullscreen) {
      return 'h-[calc(100vh-120px)]';
    } else if (isMobile) {
      return 'h-[500px]';
    } else {
      return 'h-[calc(100vh-200px)] min-h-[800px]';
    }
  };

  return (
    <div className={`resume-previewer ${fullscreen ? 'fixed inset-0 z-50 bg-gray-100 dark:bg-gray-900 p-4' : ''}`}>
      {/* Controls */}
      <div className={`flex justify-between items-center mb-3 ${fullscreen ? 'px-4' : ''}`}>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowSample(!showSample)}
            className="btn btn-secondary text-xs p-1.5 flex items-center"
            title={showSample ? "Hide sample data" : "Show with sample data"}
          >
            {showSample ? (
              <>
                <FaEyeSlash className="mr-1" size={12} />
                <span className="hidden sm:inline">Hide Sample</span>
              </>
            ) : (
              <>
                <FaEye className="mr-1" size={12} />
                <span className="hidden sm:inline">Show Sample</span>
              </>
            )}
          </button>
          
          <button 
            onClick={toggleMobileView}
            className="btn btn-secondary text-xs p-1.5 flex items-center"
            title={mobileView ? "Desktop view" : "Mobile view"}
          >
            {mobileView ? (
              <>
                <FaDesktop className="mr-1" size={12} />
                <span className="hidden sm:inline">Desktop</span>
              </>
            ) : (
              <>
                <FaMobileAlt className="mr-1" size={12} />
                <span className="hidden sm:inline">Mobile</span>
              </>
            )}
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={handleDownload}
            className="btn btn-primary text-xs p-1.5 flex items-center"
            title="Download PDF"
          >
            <FaDownload className="mr-1" size={12} />
            <span className="hidden sm:inline">Download</span>
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="btn btn-secondary text-xs p-1.5 flex items-center"
            title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {fullscreen ? (
              <>
                <FaCompress className="mr-1" size={12} />
                <span className="hidden sm:inline">Exit</span>
              </>
            ) : (
              <>
                <FaExpand className="mr-1" size={12} />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* PDF Viewer */}
      <div className={`${mobileView ? 'max-w-[400px]' : ''} mx-auto transition-all duration-300`}>
        {isDataMostlyEmpty() && !showSample ? (
          <div 
            className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 ${getViewerHeight()}`}
          >
            <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
              Your resume is empty. Add some information or enable sample data to see a preview.
            </p>
            <button 
              onClick={() => setShowSample(true)}
              className="btn btn-primary text-sm"
            >
              Show with sample data
            </button>
          </div>
        ) : (
          <PDFViewer 
            className={`w-full rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} ${getViewerHeight()}`}
          >
            {getTemplateComponent()}
          </PDFViewer>
        )}
      </div>
    </div>
  );
} 