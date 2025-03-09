import { useState, useEffect, useCallback } from 'react'
import { ResumeForm } from './ResumeForm'
import { ResumePreviewer, ColorTheme } from './ResumePreviewer'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resumeSchema } from '../schemas/resumeSchemas'
import { ResumeData } from '../types/resume'
import { FaUser, FaFileAlt, FaBriefcase, FaGraduationCap, FaTools, FaLink, FaPuzzlePiece, FaHeart, FaChevronLeft, FaChevronRight, FaBars, FaTimes, FaPalette, FaCheck, FaRobot, FaLightbulb, FaLayerGroup, FaEdit, FaLinkedin, FaSpinner, FaSave } from 'react-icons/fa'
import { ResumeFeedback } from './ResumeFeedback'
import { ATSOptimizer } from './ATSOptimizer'
import { TemplateSelector } from './TemplateSelector'
import { LinkedInImport } from './LinkedInImport'
import { useAuth } from '../contexts/AuthContext'
import { saveResume, updateResume, getResume } from '../services/resumeService'
import { useParams, useNavigate } from 'react-router-dom'
import { colorThemes, getColorThemeById } from '../utils/themeUtils'

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
  { id: 'linkedin', title: 'LinkedIn Import', icon: FaLinkedin, description: 'Import your profile from LinkedIn' },
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

export function ResumeBuilder() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [activeSection, setActiveSection] = useState<string>('personal')
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [selectedColorTheme, setSelectedColorTheme] = useState<ColorTheme>(colorThemes[0])
  const [isChangingTemplate, setIsChangingTemplate] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [jobDescription, setJobDescription] = useState<string>('');
  const [feedbackTab, setFeedbackTab] = useState<'feedback' | 'ats'>('feedback');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  
  // Initialize with empty values that match the ResumeData structure
  const [formData, setFormData] = useState<Partial<ResumeData>>({
    personal: {
      jobTitle: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      address: '',
      postalCode: '',
      photo: undefined
    },
    professionalSummary: '',
    experience: [],
    education: [],
    skills: [],
    socialLinks: [],
    courses: [],
    hobbies: [],
    certifications: [],
    projects: [],
    organizations: [],
    customSections: [],
    theme: {
      template: 'modern',
      color: 'blue'
    }
  })
  
  const methods = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personal: {
        jobTitle: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        city: '',
        address: '',
        postalCode: '',
        photo: undefined
      },
      professionalSummary: '',
      experience: [],
      education: [],
      skills: [],
      socialLinks: [],
      courses: [],
      hobbies: [],
      certifications: [],
      projects: [],
      organizations: [],
      customSections: [],
      theme: {
        template: 'modern',
        color: 'blue'
      }
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
  const handleColorThemeChange = (theme: ColorTheme) => {
    setSelectedColorTheme(theme);
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
        ...linkedInData.personal
      }
    };
    
    // Update form data with LinkedIn data
    methods.reset(mergedData as ResumeData);
    
    // Notify the user and navigate to the personal section to review imported data
    setActiveSection('personal');
  };

  // Load resume if editing an existing one
  useEffect(() => {
    const loadResume = async () => {
      if (resumeId) {
        try {
          const resumeData = await getResume(resumeId);
          if (resumeData) {
            // Check if the resume belongs to the current user
            if (currentUser && resumeData.userId === currentUser.uid) {
              methods.reset(resumeData);
            } else {
              // Redirect if the resume doesn't belong to the user
              navigate('/dashboard');
            }
          }
        } catch (error) {
          console.error('Error loading resume:', error);
        }
      }
    };

    if (resumeId) {
      loadResume();
    }
  }, [resumeId, currentUser, navigate, methods]);

  // Save resume to user's account
  const handleSaveResume = async () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      const formData = methods.getValues();
      
      // Ensure arrays are properly initialized
      const resumeData = {
        ...formData,
        userId: currentUser.uid,
        experience: formData.experience || [],
        education: formData.education || [],
        skills: formData.skills || [],
        socialLinks: formData.socialLinks || [],
        theme: {
          template: selectedTemplate,
          color: selectedColorTheme.id
        }
      };

      console.log('Saving resume data:', resumeData);
      console.log('Education:', resumeData.education);
      console.log('Experience:', resumeData.experience);
      console.log('Skills:', resumeData.skills);

      if (resumeId) {
        // Update existing resume
        await updateResume(resumeId, resumeData);
      } else {
        // Save new resume
        const newResumeId = await saveResume(resumeData);
        // Navigate to edit page with the new ID
        navigate(`/edit/${newResumeId}`);
      }

      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving resume:', error);
      setSaveError('Failed to save resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
                    className={`w-full flex items-start ${sidebarCollapsed && !isMobile ? 'justify-center' : 'px-3'} py-2.5 text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={sidebarCollapsed && !isMobile ? section.title : ''}
                  >
                    <section.icon className={`${sidebarCollapsed && !isMobile ? 'mr-0' : 'mr-3'} h-5 w-5 ${!sidebarCollapsed && 'mt-0.5'}`} />
                    {(!sidebarCollapsed || isMobile) && (
                      <span className="text-left">{section.title}</span>
                    )}
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
                  </div>
                )}
                
                {/* Current Template Display */}
                <div 
                  onClick={() => setShowTemplateSelector(true)}
                  className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-300 transition-colors mb-4"
                >
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
                
              </div>

              {/* Color Theme Selection */}
              <div className="mt-8">
                {(!sidebarCollapsed || isMobile) && (
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                    <FaPalette className="mr-1" size={14} />
                    Color Theme
                  </h2>
                )}
                <div className={`${isMobile ? 'grid grid-cols-4 gap-2' : 'flex flex-wrap gap-2'}`}>
                  {colorThemes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => handleColorThemeChange(theme)}
                      className={`relative rounded-full w-8 h-8 flex items-center justify-center border-2 transition-all duration-200 ${
                        selectedColorTheme.id === theme.id
                          ? 'border-gray-800 dark:border-white scale-110'
                          : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:scale-105'
                      }`}
                      style={{ backgroundColor: theme.primary }}
                      title={theme.name}
                    >
                      {selectedColorTheme.id === theme.id && (
                        <FaCheck className="text-white text-xs" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add save button */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleSaveResume}
                  disabled={isSaving}
                  className="btn btn-primary flex items-center"
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2 h-5 w-5" />
                      Save Resume
                    </>
                  )}
                </button>
                
                {saveSuccess && (
                  <div className="mt-2 text-sm text-green-600 text-center">
                    Resume saved successfully!
                  </div>
                )}
                
                {saveError && (
                  <div className="mt-2 text-sm text-red-600 text-center">
                    {saveError}
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
                    {activeSection !== 'feedback' && activeSection !== 'linkedin' ? (
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
                            className="btn btn-secondary flex items-center"
                            disabled={activeSection === sections[0].id}
                          >
                            <FaChevronLeft className="mr-2 h-3 w-3" />
                            <span>Previous</span>
                          </button>
                          <button
                            onClick={goToNextSection}
                            className="btn btn-primary flex items-center"
                            disabled={activeSection === sections[sections.length - 1].id}
                          >
                            <span>Next</span>
                            <FaChevronRight className="ml-2 h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ) : activeSection === 'feedback' ? (
                      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <div className="flex border-b">
                          <button
                            className={`flex-1 py-3 px-4 text-center font-medium ${
                              feedbackTab === 'feedback'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setFeedbackTab('feedback')}
                          >
                            <FaLightbulb className="inline-block mr-2" />
                            Resume Feedback
                          </button>
                          <button
                            className={`flex-1 py-3 px-4 text-center font-medium ${
                              feedbackTab === 'ats'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setFeedbackTab('ats')}
                          >
                            <FaRobot className="inline-block mr-2" />
                            ATS Optimization
                          </button>
                        </div>
                        
                        {feedbackTab === 'feedback' ? (
                          <ResumeFeedback resumeData={{
                            personal: formData.personal || {
                              jobTitle: '',
                              firstName: '',
                              lastName: '',
                              email: '',
                              phone: '',
                              country: '',
                              city: '',
                              address: '',
                              postalCode: ''
                            },
                            professionalSummary: formData.professionalSummary || '',
                            experience: Array.isArray(formData.experience) ? formData.experience : [],
                            education: Array.isArray(formData.education) ? formData.education : [],
                            skills: Array.isArray(formData.skills) ? formData.skills : [],
                            socialLinks: Array.isArray(formData.socialLinks) ? formData.socialLinks : [],
                            courses: Array.isArray(formData.courses) ? formData.courses : [],
                            hobbies: Array.isArray(formData.hobbies) ? formData.hobbies : [],
                            certifications: Array.isArray(formData.certifications) ? formData.certifications : [],
                            projects: Array.isArray(formData.projects) ? formData.projects : [],
                            organizations: Array.isArray(formData.organizations) ? formData.organizations : [],
                            customSections: Array.isArray(formData.customSections) ? formData.customSections : []
                          }} />
                        ) : (
                          <ATSOptimizer 
                            resumeData={{
                              personal: formData.personal || {
                                jobTitle: '',
                                firstName: '',
                                lastName: '',
                                email: '',
                                phone: '',
                                country: '',
                                city: '',
                                address: '',
                                postalCode: ''
                              },
                              professionalSummary: formData.professionalSummary || '',
                              experience: Array.isArray(formData.experience) ? formData.experience : [],
                              education: Array.isArray(formData.education) ? formData.education : [],
                              skills: Array.isArray(formData.skills) ? formData.skills : [],
                              socialLinks: Array.isArray(formData.socialLinks) ? formData.socialLinks : [],
                              courses: Array.isArray(formData.courses) ? formData.courses : [],
                              hobbies: Array.isArray(formData.hobbies) ? formData.hobbies : [],
                              certifications: Array.isArray(formData.certifications) ? formData.certifications : [],
                              projects: Array.isArray(formData.projects) ? formData.projects : [],
                              organizations: Array.isArray(formData.organizations) ? formData.organizations : [],
                              customSections: Array.isArray(formData.customSections) ? formData.customSections : []
                            }}
                            jobDescription={jobDescription}
                            onJobDescriptionChange={setJobDescription}
                          />
                        )}
                      </div>
                    ) : (
                      // LinkedIn Import Section
                      <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="mb-4">
                          <h2 className="text-xl font-semibold text-gray-800">
                            LinkedIn Import
                          </h2>
                          <p className="text-sm text-gray-500 mt-1">
                            Import your profile data from LinkedIn to quickly fill your resume
                          </p>
                        </div>
                        <LinkedInImport onImportComplete={handleLinkedInImport} />
                      </div>
                    )}
                  </FormProvider>
                </div>

                {/* Preview Section */}
                <div className="lg:sticky lg:top-8 h-auto min-h-screen space-y-6">
                  <div className={`transition-opacity duration-300 ${isChangingTemplate ? 'opacity-0' : 'opacity-100'}`}>
                    <ResumePreviewer 
                      data={formData as ResumeData} 
                      templateId={selectedTemplate}
                      colorTheme={selectedColorTheme}
                      showSampleData={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 