import { useState, useEffect, useCallback } from 'react'
import { ResumeForm } from './ResumeForm'
import { ResumePreviewer, ColorTheme } from './ResumePreviewer'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resumeSchema } from '../schemas/resumeSchemas'
import { ResumeData } from '../types/resume'
import { FaUser, FaFileAlt, FaBriefcase, FaGraduationCap, FaTools, FaLink, FaPuzzlePiece, FaHeart, FaChevronLeft, FaChevronRight, FaBars, FaTimes, FaPalette, FaCheck, FaRobot, FaLightbulb, FaLayerGroup, FaEdit, FaLinkedin, FaSave } from 'react-icons/fa'
import { ResumeFeedback } from './ResumeFeedback'
import { ATSOptimizer } from './ATSOptimizer'
import { TemplateSelector } from './TemplateSelector'
import { JobSearch } from './JobSearch'
import { LinkedInImport } from './LinkedInImport'
import { SaveResumeModal } from './SaveResumeModal'
import { PDFViewer } from './PDFViewer'

const sections = [
  { id: 'personal', title: 'Personal Details', icon: FaUser, description: 'Basic information about you' },
  { id: 'summary', title: 'Professional Summary', icon: FaFileAlt, description: 'Brief overview of your professional background' },
  { id: 'experience', title: 'Work Experience', icon: FaBriefcase, description: 'Your work history and achievements' },
  { id: 'education', title: 'Education', icon: FaGraduationCap, description: 'Your academic background' },
  { id: 'skills', title: 'Skills', icon: FaTools, description: 'Your technical and soft skills' },
  { id: 'social', title: 'Social Links', icon: FaLink, description: 'Your professional online presence' },
  { id: 'custom', title: 'Custom Sections', icon: FaPuzzlePiece, description: 'Add custom sections to your resume' },
  { id: 'hobbies', title: 'Hobbies', icon: FaHeart, description: 'Your interests and activities' },
  { id: 'feedback', title: 'Feedback & Optimization', icon: FaLightbulb, description: 'Get feedback and optimize your resume' },
  { id: 'jobs', title: 'Job Search', icon: FaBriefcase, description: 'Search and apply for jobs with your resume' },
] as const

// Available templates
const templates = [
  { 
    id: 'modern', 
    name: 'Modern', 
    description: 'Clean and contemporary design suitable for most industries',
    category: 'general',
    popular: true
  },
  { 
    id: 'professional', 
    name: 'Professional', 
    description: 'Traditional layout with a professional appearance',
    category: 'general',
    popular: true
  },
  { 
    id: 'creative', 
    name: 'Creative', 
    description: 'Unique design for creative industries and portfolios',
    category: 'creative',
    popular: true
  },
  { 
    id: 'executive', 
    name: 'Executive', 
    description: 'Sophisticated design for senior positions and leadership roles',
    category: 'business',
    popular: false
  },
  { 
    id: 'minimalist', 
    name: 'Minimalist', 
    description: 'Simple and elegant with focus on content over design',
    category: 'general',
    popular: true
  },
  { 
    id: 'tech', 
    name: 'Tech', 
    description: 'Modern design optimized for IT and technology positions',
    category: 'tech',
    popular: true
  },
  { 
    id: 'academic', 
    name: 'Academic', 
    description: 'Formal layout for academic and research positions',
    category: 'education',
    popular: false
  },
  { 
    id: 'medical', 
    name: 'Medical', 
    description: 'Specialized format for healthcare professionals',
    category: 'healthcare',
    popular: false
  },
  { 
    id: 'legal', 
    name: 'Legal', 
    description: 'Structured format for legal professionals',
    category: 'legal',
    popular: false
  },
  { 
    id: 'engineering', 
    name: 'Engineering', 
    description: 'Technical layout for engineering and manufacturing roles',
    category: 'tech',
    popular: false
  },
  { 
    id: 'finance', 
    name: 'Finance', 
    description: 'Professional design for banking and finance positions',
    category: 'business',
    popular: false
  },
  { 
    id: 'sales', 
    name: 'Sales', 
    description: 'Results-focused layout for sales and marketing professionals',
    category: 'business',
    popular: false
  }
];

// Template categories for filtering
const templateCategories = [
  { id: 'all', name: 'All Templates' },
  { id: 'general', name: 'General' },
  { id: 'creative', name: 'Creative' },
  { id: 'tech', name: 'Technology' },
  { id: 'business', name: 'Business' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'education', name: 'Education' },
  { id: 'legal', name: 'Legal' }
];

// Available color themes
const colorThemes = [
  { id: 'blue', name: 'Blue', theme: { primary: '#3b82f6', secondary: '#93c5fd', background: '#ffffff', text: '#1e293b' } },
  { id: 'green', name: 'Green', theme: { primary: '#10b981', secondary: '#a7f3d0', background: '#ffffff', text: '#1e293b' } },
  { id: 'purple', name: 'Purple', theme: { primary: '#8b5cf6', secondary: '#c4b5fd', background: '#ffffff', text: '#1e293b' } },
  { id: 'red', name: 'Red', theme: { primary: '#ef4444', secondary: '#fca5a5', background: '#ffffff', text: '#1e293b' } },
  { id: 'amber', name: 'Amber', theme: { primary: '#f59e0b', secondary: '#fcd34d', background: '#ffffff', text: '#1e293b' } },
  { id: 'gray', name: 'Gray', theme: { primary: '#4b5563', secondary: '#d1d5db', background: '#ffffff', text: '#1e293b' } },
];

interface ResumeBuilderProps {
  initialData?: Partial<ResumeData>;
  initialTemplate?: string;
  initialColorTheme?: string;
  existingResumeId?: string;
  existingResumeName?: string;
}

export function ResumeBuilder({
  initialData,
  initialTemplate = 'modern',
  initialColorTheme = 'blue',
  existingResumeId,
  existingResumeName
}: ResumeBuilderProps = {}) {
  const [activeSection, setActiveSection] = useState<string>('personal')
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate)
  const [selectedColorTheme, setSelectedColorTheme] = useState<ColorTheme>(
    colorThemes.find(theme => theme.id === 'blue')?.theme || 
    { primary: '#3b82f6', secondary: '#93c5fd', background: '#ffffff', text: '#1e293b' }
  )
  const [isChangingTemplate, setIsChangingTemplate] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [jobDescription, setJobDescription] = useState<string>('');
  const [feedbackTab, setFeedbackTab] = useState<'feedback' | 'ats'>('feedback');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [jobTab, setJobTab] = useState<'search' | 'import'>('search');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [previewMode, setPreviewMode] = useState<'template' | 'pdf'>('template');
  
  // Initialize with empty values or provided initialData
  const [formData, setFormData] = useState<Partial<ResumeData>>(initialData || {
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      jobTitle: '',
      website: '',
      summary: ''
    },
    professionalSummary: '',
    experience: [],
    education: [],
    skills: [],
    socialLinks: [],
    certifications: [],
    languages: [],
    hobbies: []
  })
  
  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: initialData || {
      personal: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        jobTitle: '',
        website: '',
        summary: ''
      },
      professionalSummary: '',
      experience: [],
      education: [],
      skills: [],
      socialLinks: [],
      certifications: [],
      languages: [],
      hobbies: []
    },
  })
  
  // Watch for form changes and update the preview
  const formValues = useWatch({
    control: methods.control
  });
  
  // Update formData when form values change
  useEffect(() => {
    if (formValues) {
      setFormData(formValues as Partial<ResumeData>);
    }
  }, [formValues]);

  // Safe template selection handler
  const handleTemplateChange = useCallback((templateId: string) => {
    if (templates.some(t => t.id === templateId)) {
      setIsChangingTemplate(true);
      // Small delay to ensure clean unmount of previous template
      setTimeout(() => {
        setSelectedTemplate(templateId);
        setIsChangingTemplate(false);
      }, 100);
    }
  }, []);

  // Handle color theme selection
  const handleColorThemeChange = (themeId: string) => {
    const theme = colorThemes.find(theme => theme.id === themeId);
    if (theme) {
      setSelectedColorTheme(theme.theme);
    }
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Toggle sidebar visibility on mobile
  const toggleMobileSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarVisible(false);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Handle section selection on mobile
  const handleSectionSelect = (sectionId: string) => {
    setActiveSection(sectionId);
    if (isMobile) {
      setSidebarVisible(false);
    }
  };

  // Navigate to previous section
  const goToPreviousSection = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1].id);
    }
  };

  // Navigate to next section
  const goToNextSection = () => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  // Handle LinkedIn import completion
  const handleLinkedInImport = (linkedInData: Partial<ResumeData>) => {
    // Merge LinkedIn data with existing form data
    const mergedData = {
      ...formData,
      ...linkedInData,
      personal: {
        ...formData.personal,
        ...linkedInData.personal,
      },
    };
    
    // Update form with merged data
    methods.reset(mergedData as ResumeData);
  };

  // Find the current color theme ID
  const getCurrentColorThemeId = () => {
    const foundTheme = colorThemes.find(theme => 
      JSON.stringify(theme.theme) === JSON.stringify(selectedColorTheme)
    );
    return foundTheme?.id || 'blue';
  };

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

      <div className="mx-auto">
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-30 shadow-sm px-4 py-3 flex justify-between items-center">
          <h1 className="font-bold text-gray-900 text-lg">Resume Builder</h1>
          <button 
            onClick={toggleMobileSidebar}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
            aria-label="Toggle menu"
          >
            {sidebarVisible ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>

        <div className="flex relative">
          {/* Sidebar - Desktop: Fixed, Mobile: Absolute */}
          <div 
            className={`
              ${isMobile ? 
                `fixed inset-0 z-40 bg-white transform ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out` 
                : 
                `${sidebarCollapsed ? 'w-20' : 'w-64'} min-h-screen bg-white shadow-lg fixed left-0 top-0 overflow-y-auto transition-all duration-300 z-20`
              }
            `}
          >
            <div className={`p-4 ${sidebarCollapsed && !isMobile ? 'px-2' : 'p-5'} ${isMobile ? 'pt-16' : ''}`}>
              {!isMobile && (
                <div className="flex items-center justify-between mb-6">
                  <h1 className={`font-bold text-gray-900 ${sidebarCollapsed ? 'text-sm' : 'text-xl'}`}>
                    {sidebarCollapsed ? 'RB' : 'Resume Builder'}
                  </h1>
                  <button 
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >
                    {sidebarCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
                  </button>
                </div>
              )}
              
              {/* Section Navigation */}
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionSelect(section.id)}
                    className={`w-full flex items-center ${sidebarCollapsed && !isMobile ? 'justify-center' : 'px-3'} py-2.5 text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={sidebarCollapsed && !isMobile ? section.title : ''}
                  >
                    <section.icon className={`${sidebarCollapsed && !isMobile ? 'mr-0' : 'mr-3'} h-5 w-5`} />
                    {(!sidebarCollapsed || isMobile) && section.title}
                  </button>
                ))}
              </nav>
              
              {/* Template Selection */}
              <div className="mt-8">
                {(!sidebarCollapsed || isMobile) && (
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider flex items-center">
                      <FaLayerGroup className="mr-1" size={14} />
                      Template
                    </h2>
                    <button 
                      onClick={() => setShowTemplateSelector(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FaEdit className="mr-1" size={12} />
                      Browse All
                    </button>
                  </div>
                )}
                
                {/* Current Template Display */}
                <div 
                  onClick={() => setShowTemplateSelector(true)}
                  className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-300 transition-colors mb-4"
                >
                  <div className="h-20 bg-gray-100 rounded flex items-center justify-center mb-2">
                    <span className="text-lg font-medium text-gray-500">{templates.find(t => t.id === selectedTemplate)?.name}</span>
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{templates.find(t => t.id === selectedTemplate)?.name}</span>
                      <button 
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTemplateSelector(true);
                        }}
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Popular Templates Quick Select */}
                {!sidebarCollapsed && (
                  <>
                    <div className="text-xs text-gray-500 mb-2">Popular Templates:</div>
                    <div className="grid grid-cols-3 gap-2">
                      {templates.filter(t => t.popular).slice(0, 6).map(template => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateChange(template.id)}
                          className={`p-1 border rounded transition-all ${
                            selectedTemplate === template.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                          }`}
                          title={template.name}
                        >
                          <div className="text-xs truncate">{template.name}</div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Color Theme Selection */}
              <div className="mt-8">
                {(!sidebarCollapsed || isMobile) && (
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Color Theme</h3>
                    <div className="flex space-x-2">
                      {colorThemes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => handleColorThemeChange(theme.id)}
                          className={`relative rounded-full w-8 h-8 flex items-center justify-center border-2 ${
                            JSON.stringify(selectedColorTheme) === JSON.stringify(theme.theme)
                              ? 'border-gray-800'
                              : 'border-transparent hover:border-gray-300'
                          }`}
                          style={{ backgroundColor: theme.theme.primary }}
                          title={theme.name}
                        >
                          {JSON.stringify(selectedColorTheme) === JSON.stringify(theme.theme) && (
                            <FaCheck className="text-white text-xs" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Overlay for mobile sidebar */}
          {isMobile && sidebarVisible && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30"
              onClick={toggleMobileSidebar}
            ></div>
          )}
          
          {/* Main Content */}
          <div className={`flex-1 transition-all duration-300 ${isMobile ? 'pt-16' : ''} ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Section */}
                <div className="space-y-6">
                  <FormProvider {...methods}>
                    {activeSection !== 'feedback' && activeSection !== 'jobs' ? (
                      <div className="space-y-4">
                        <div className="bg-white shadow-sm rounded-lg p-6">
                          <div className="mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                              {sections.find(s => s.id === activeSection)?.title}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                              {sections.find(s => s.id === activeSection)?.description}
                            </p>
                          </div>
                          <ResumeForm section={activeSection} />
                        </div>
                        
                        {/* Navigation Buttons */}
                        <div className="flex justify-between">
                          <button
                            onClick={goToPreviousSection}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={activeSection === sections[0].id}
                          >
                            <div className="flex items-center">
                              <FaChevronLeft className="mr-2 h-3 w-3" />
                              <span>Previous</span>
                            </div>
                          </button>
                          <button
                            onClick={goToNextSection}
                            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            disabled={activeSection === sections[sections.length - 1].id}
                          >
                            <div className="flex items-center">
                              <span>Next</span>
                              <FaChevronRight className="ml-2 h-3 w-3" />
                            </div>
                          </button>
                        </div>
                      </div>
                    ) : activeSection === 'feedback' ? (
                      <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="mb-4">
                          <h2 className="text-xl font-semibold text-gray-800">Resume Feedback</h2>
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => setFeedbackTab('feedback')}
                              className={`px-3 py-1 text-sm rounded-md ${
                                feedbackTab === 'feedback'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              General Feedback
                            </button>
                            <button
                              onClick={() => setFeedbackTab('ats')}
                              className={`px-3 py-1 text-sm rounded-md ${
                                feedbackTab === 'ats'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              ATS Optimization
                            </button>
                          </div>
                        </div>
                        
                        {feedbackTab === 'feedback' ? (
                          <ResumeFeedback resumeData={formData as ResumeData} />
                        ) : (
                          <ATSOptimizer 
                            resumeData={formData as ResumeData} 
                            jobDescription={jobDescription}
                            onJobDescriptionChange={setJobDescription}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="mb-4">
                          <h2 className="text-xl font-semibold text-gray-800">Job Search</h2>
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => setJobTab('search')}
                              className={`px-3 py-1 text-sm rounded-md ${
                                jobTab === 'search'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              Search Jobs
                            </button>
                            <button
                              onClick={() => setJobTab('import')}
                              className={`px-3 py-1 text-sm rounded-md ${
                                jobTab === 'import'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              Import from LinkedIn
                            </button>
                          </div>
                        </div>
                        
                        {jobTab === 'search' ? (
                          <JobSearch resumeData={formData as ResumeData} />
                        ) : (
                          <LinkedInImport onImportComplete={handleLinkedInImport} />
                        )}
                      </div>
                    )}
                  </FormProvider>
                </div>

                {/* Resume Preview */}
                <div className="lg:sticky lg:top-8 h-auto min-h-screen space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Resume Preview</h2>
                    <div className="flex space-x-2">
                      <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button
                          type="button"
                          onClick={() => setPreviewMode('template')}
                          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                            previewMode === 'template'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          } border border-gray-200`}
                        >
                          Template
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewMode('pdf')}
                          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                            previewMode === 'pdf'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          } border border-gray-200`}
                        >
                          PDF
                        </button>
                      </div>
                      <button
                        onClick={() => setShowSaveModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaSave className="mr-2" />
                        Save Resume
                      </button>
                    </div>
                  </div>
                  <div className={`transition-opacity duration-300 ${isChangingTemplate ? 'opacity-0' : 'opacity-100'}`}>
                    {previewMode === 'template' ? (
                      <ResumePreviewer 
                        resumeData={formData as ResumeData} 
                        templateId={selectedTemplate}
                        colorTheme={selectedColorTheme}
                      />
                    ) : (
                      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
                        <PDFViewer
                          resumeData={formData as ResumeData}
                          templateId={selectedTemplate}
                          colorTheme={selectedColorTheme}
                          height="600px"
                          showToolbar={false}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Save Resume Modal */}
      {showSaveModal && (
        <SaveResumeModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          resumeData={formData as ResumeData}
          templateId={selectedTemplate}
          colorThemeId={getCurrentColorThemeId()}
          existingResumeId={existingResumeId}
          existingResumeName={existingResumeName}
        />
      )}
    </div>
  )
} 