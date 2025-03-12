import { ResumeProvider, useResumeContext } from './ResumeContext';
import { PreviewDialog } from './PreviewDialog';
import { ResumeScore } from './ResumeScore';
import { FeedbackPanel } from './FeedbackPanel';
import { OptionalSections } from './OptionalSections';
import { ColorThemeSelector } from './ColorThemeSelector';
import { ResumeHeader } from './ResumeHeader';
import { MobileHeader } from './MobileHeader';
import { FloatingActionButton } from './FloatingActionButton';
import { ResumeContent } from './ResumeContent';
import { ResumePreview } from './ResumePreview';
import { templates, templateCategories, coreSections, optionalSections } from './sectionDefinitions';
import { TemplateSelector } from '../TemplateSelector';
import { ResumeData } from '../../types/resume';

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
    <div className="min-h-screen bg-gray-50">
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

export function ResumeBuilder() {
  return (
    <ResumeProvider>
      <ResumeBuilderContent />
    </ResumeProvider>
  );
}

export {
  ResumeProvider,
  useResumeContext,
  PreviewDialog,
  ResumeScore,
  FeedbackPanel,
  OptionalSections,
  ColorThemeSelector,
  ResumeHeader,
  MobileHeader,
  FloatingActionButton,
  ResumeContent,
  ResumePreview,
  templates,
  templateCategories,
  coreSections,
  optionalSections
}; 