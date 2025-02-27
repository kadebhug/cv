import { useState, useEffect, useCallback } from 'react'
import { ResumeForm } from './ResumeForm'
import { ResumePreviewer } from './ResumePreviewer'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resumeSchema } from '../schemas/resumeSchemas'
import { ResumeData } from '../types/resume'
import { FaUser, FaFileAlt, FaBriefcase, FaGraduationCap, FaTools, FaLink, FaPuzzlePiece, FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

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

export function ResumeBuilder() {
  const [activeSection, setActiveSection] = useState<string>('personal')
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [isChangingTemplate, setIsChangingTemplate] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
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

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto">
        <div className="flex relative">
          {/* Sidebar */}
          <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} min-h-screen bg-white shadow-lg fixed left-0 top-0 overflow-y-auto transition-all duration-300 z-20`}>
            <div className={`p-4 ${sidebarCollapsed ? 'px-2' : 'p-5'}`}>
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
              
              {/* Section Navigation */}
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'px-3'} py-2.5 text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={sidebarCollapsed ? section.title : ''}
                  >
                    <section.icon className={`${sidebarCollapsed ? 'mr-0' : 'mr-3'} h-5 w-5`} />
                    {!sidebarCollapsed && section.title}
                  </button>
                ))}
              </nav>
              
              {/* Template Selection */}
              <div className="mt-8">
                {!sidebarCollapsed && (
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Choose Template
                  </h2>
                )}
                <div className={`${sidebarCollapsed ? 'space-y-2' : 'space-y-2'}`}>
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateChange(template.id)}
                      className={`w-full flex items-center justify-center py-2.5 px-3 border rounded-md transition-all duration-200 ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium shadow-sm'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                      title={sidebarCollapsed ? template.name : ''}
                    >
                      {sidebarCollapsed ? (
                        <span className="text-lg font-medium">{template.name.charAt(0)}</span>
                      ) : (
                        <span>{template.name}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
            <div className="p-4 lg:p-6">
              <FormProvider {...methods}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Form Section */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl shadow-sm p-5 transition-all duration-300 hover:shadow-md">
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
                        className="px-4 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={activeSection === sections[0].id}
                      >
                        <div className="flex items-center">
                          <FaChevronLeft className="mr-2 h-3 w-3" />
                          Previous
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          const currentIndex = sections.findIndex(s => s.id === activeSection);
                          if (currentIndex < sections.length - 1) {
                            setActiveSection(sections[currentIndex + 1].id);
                          }
                        }}
                        className="px-4 py-2.5 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                        disabled={activeSection === sections[sections.length - 1].id}
                      >
                        <div className="flex items-center">
                          Next
                          <FaChevronRight className="ml-2 h-3 w-3" />
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