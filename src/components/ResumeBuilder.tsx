import { useState, useEffect, useCallback } from 'react'
import { ResumeForm } from './ResumeForm'
import { ResumePreviewer, ColorTheme } from './ResumePreviewer'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resumeSchema } from '../schemas/resumeSchemas'
import { ResumeData } from '../types/resume'
import { FaUser, FaFileAlt, FaBriefcase, FaGraduationCap, FaTools, FaLink, FaPuzzlePiece, FaHeart, FaChevronLeft, FaChevronRight, FaBars, FaTimes, FaPalette, FaCheck } from 'react-icons/fa'

const sections = [
  { id: 'personal', title: 'Personal Details', icon: FaUser, description: 'Basic information about you' },
  { id: 'summary', title: 'Professional Summary', icon: FaFileAlt, description: 'Brief overview of your professional background' },
  { id: 'experience', title: 'Work Experience', icon: FaBriefcase, description: 'Your work history and achievements' },
  { id: 'education', title: 'Education', icon: FaGraduationCap, description: 'Your academic background' },
  { id: 'skills', title: 'Skills', icon: FaTools, description: 'Your technical and soft skills' },
  { id: 'social', title: 'Social Links', icon: FaLink, description: 'Your professional online presence' },
  { id: 'custom', title: 'Custom Sections', icon: FaPuzzlePiece, description: 'Add custom sections to your resume' },
  { id: 'hobbies', title: 'Hobbies', icon: FaHeart, description: 'Your interests and activities' },
] as const

// Available templates
const templates = [
  { id: 'modern', name: 'Modern' },
  { id: 'professional', name: 'Professional' },
  { id: 'creative', name: 'Creative' },
];

// Available color themes
const colorThemes: ColorTheme[] = [
  { id: 'blue', name: 'Blue', primary: '#3b82f6', secondary: '#93c5fd' },
  { id: 'green', name: 'Green', primary: '#10b981', secondary: '#a7f3d0' },
  { id: 'purple', name: 'Purple', primary: '#8b5cf6', secondary: '#c4b5fd' },
  { id: 'red', name: 'Red', primary: '#ef4444', secondary: '#fca5a5' },
  { id: 'amber', name: 'Amber', primary: '#f59e0b', secondary: '#fcd34d' },
  { id: 'gray', name: 'Gray', primary: '#4b5563', secondary: '#d1d5db' },
];

export function ResumeBuilder() {
  const [activeSection, setActiveSection] = useState<string>('personal')
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [selectedColorTheme, setSelectedColorTheme] = useState<ColorTheme>(colorThemes[0])
  const [isChangingTemplate, setIsChangingTemplate] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
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
      postalCode: ''
    },
    professionalSummary: '',
    experience: [],
    education: [],
    skills: [],
    socialLinks: [],
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
        postalCode: ''
      },
      professionalSummary: '',
      experience: [],
      education: [],
      skills: [],
      socialLinks: [],
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

  return (
    <div className="min-h-screen bg-gray-50">
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
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Choose Template
                  </h2>
                )}
                <div className={`${isMobile ? 'grid grid-cols-3 gap-2' : sidebarCollapsed ? 'space-y-2' : 'space-y-2'}`}>
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateChange(template.id)}
                      className={`w-full flex items-center justify-center py-2.5 px-3 border rounded-md transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                      title={sidebarCollapsed && !isMobile ? template.name : ''}
                    >
                      {sidebarCollapsed && !isMobile ? (
                        <span className="text-lg font-medium">{template.name.charAt(0)}</span>
                      ) : (
                        <span>{template.name}</span>
                      )}
                    </button>
                  ))}
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
                <div className={`${isMobile ? 'grid grid-cols-3 gap-2' : sidebarCollapsed ? 'flex flex-col items-center space-y-2' : 'grid grid-cols-3 gap-2'}`}>
                  {colorThemes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => handleColorThemeChange(theme)}
                      className={`relative flex items-center justify-center p-2 rounded-md transition-all duration-200 ${
                        selectedColorTheme.id === theme.id
                          ? 'ring-2 ring-offset-2 ring-gray-400'
                          : 'hover:ring-1 hover:ring-gray-300'
                      }`}
                      title={theme.name}
                    >
                      <span className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.primary }}></span>
                      {selectedColorTheme.id === theme.id && (
                        <FaCheck className="absolute text-white" size={12} />
                      )}
                    </button>
                  ))}
                </div>
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
          <div 
            className={`
              flex-1 transition-all duration-300 
              ${isMobile ? 'ml-0 mt-14' : sidebarCollapsed ? 'ml-20' : 'ml-64'}
            `}
          >
            <div className="p-4 md:p-6">
              <FormProvider {...methods}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Form Section */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-sm p-4 md:p-5 transition-all duration-300 hover:shadow-md">
                      <div className="mb-5">
                        <h2 className="text-xl font-semibold text-gray-900">
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
                        onClick={() => {
                          const currentIndex = sections.findIndex(s => s.id === activeSection);
                          if (currentIndex > 0) {
                            setActiveSection(sections[currentIndex - 1].id);
                          }
                        }}
                        className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={activeSection === sections[0].id}
                      >
                        <div className="flex items-center">
                          <FaChevronLeft className="mr-1 md:mr-2 h-3 w-3" />
                          <span className="hidden xs:inline">Previous</span>
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          const currentIndex = sections.findIndex(s => s.id === activeSection);
                          if (currentIndex < sections.length - 1) {
                            setActiveSection(sections[currentIndex + 1].id);
                          }
                        }}
                        className="px-3 md:px-4 py-2 md:py-2.5 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                        disabled={activeSection === sections[sections.length - 1].id}
                      >
                        <div className="flex items-center">
                          <span className="hidden xs:inline">Next</span>
                          <FaChevronRight className="ml-1 md:ml-2 h-3 w-3" />
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Preview Section */}
                  <div className="lg:sticky lg:top-4">
                    {!isChangingTemplate && (
                      <ResumePreviewer 
                        data={formData as ResumeData} 
                        templateId={selectedTemplate}
                        colorTheme={selectedColorTheme}
                      />
                    )}
                  </div>
                </div>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 