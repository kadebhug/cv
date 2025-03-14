import { TemplateSelector } from './TemplateSelector';
import { ResumeData } from '../types/resume';

// Import all the modular components we created
import {
  ResumeProvider,
  useResumeContext,
  PreviewDialog,
  MobileHeader,
  FloatingActionButton,
  ResumeContent,
  ResumePreview,
  templates,
  templateCategories
} from './resume';

/**
 * Main ResumeBuilder component that uses the modular components
 * This is a wrapper around the ResumeProvider to maintain backward compatibility
 */
export function ResumeBuilder() {
  return (
    <ResumeProvider>
      <ResumeBuilderContent />
    </ResumeProvider>
  );
}

/**
 * The main content of the ResumeBuilder
 * This component is wrapped by the ResumeProvider
 */
function ResumeBuilderContent() {
  const { 
    showTemplateSelector, 
    selectedTemplate, 
    handleTemplateChange, 
    selectedColorTheme,
    showPreviewDialog,
    setShowTemplateSelector,
    setShowPreviewDialog,
    formData,
    isLargeScreen,
    isMobile
  } = useResumeContext();

  return (
    <div className="max-h-screen bg-gray-50">
      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          templates={templates}
          categories={templateCategories}
          selectedTemplate={selectedTemplate}
          onSelectTemplate={(templateId) => {
            handleTemplateChange(templateId);
          }}
          onClose={() => setShowTemplateSelector(false)}
          colorTheme={selectedColorTheme}
        />
      )}

      {/* Preview Dialog */}
      <PreviewDialog
        isOpen={showPreviewDialog}
        onClose={() => setShowPreviewDialog(false)}
        data={formData as ResumeData}
        templateId={selectedTemplate}
        colorTheme={selectedColorTheme}
      />

      <div className="mx-auto">
        {/* Mobile Header */}
        <MobileHeader />

        <div className="flex flex-col lg:flex-row">
          {/* Left Section - Scrollable Form */}
          <div className={`${isLargeScreen ? 'lg:w-1/2' : 'w-full'} ${isMobile ? 'pt-16' : ''} overflow-y-auto`}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
              <ResumeContent />
            </div>
          </div>

          {/* Right Section - Fixed Preview */}
          <ResumePreview />
        </div>
      </div>

      {/* Floating Action Button for Preview */}
      <FloatingActionButton />
    </div>
  );
} 
