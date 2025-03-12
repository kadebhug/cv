import { ResumePreviewer } from '../ResumePreviewer';
import { useResumeContext } from './ResumeContext';
import { ResumeData } from '../../types/resume';

export function ResumePreview() {
  const { 
    isLargeScreen, 
    formData, 
    selectedTemplate, 
    selectedColorTheme, 
    isChangingTemplate 
  } = useResumeContext();

  if (!isLargeScreen) return null;

  return (
    <div className="lg:w-1/2 lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:overflow-y-auto bg-gray-100">
      <div className="h-full flex items-center justify-center p-4 overflow-hidden">
        <div className={`transition-opacity duration-300 ${isChangingTemplate ? 'opacity-0' : 'opacity-100'} max-w-full w-full h-full max-h-[calc(100vh-40px)] overflow-auto transform scale-90 md:scale-95 lg:scale-100 p-4`}>
          <ResumePreviewer 
            data={formData as ResumeData} 
            templateId={selectedTemplate}
            colorTheme={selectedColorTheme}
            showSampleData={false}
          />
        </div>
      </div>
    </div>
  );
} 