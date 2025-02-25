import { useState, useEffect, useCallback } from 'react'
import { ResumeForm } from './ResumeForm'
import { ResumePreviewer } from './ResumePreviewer'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resumeSchema } from '../schemas/resumeSchemas'
import { ResumeData } from '../types/resume'
import { FaUser, FaFileAlt, FaBriefcase, FaGraduationCap, FaTools, FaLink, FaPuzzlePiece, FaHeart } from 'react-icons/fa'

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 min-h-screen bg-white shadow-lg fixed left-0 top-0 overflow-y-auto">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Resume Builder
              </h1>
              
              {/* Section Navigation */}
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="mr-3 h-5 w-5" />
                    {section.title}
                  </button>
                ))}
              </nav>
              
              {/* Template Selection */}
              <div className="mt-8">
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Choose Template
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateChange(template.id)}
                      className={`p-2 border rounded-md transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 ml-80">
            <div className="max-w-7xl mx-auto p-8">
              <FormProvider {...methods}>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* Form Section */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
                      <div className="mb-6">
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
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        disabled={activeSection === sections[0].id}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => {
                          const currentIndex = sections.findIndex(s => s.id === activeSection);
                          if (currentIndex < sections.length - 1) {
                            setActiveSection(sections[currentIndex + 1].id);
                          }
                        }}
                        className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                        disabled={activeSection === sections[sections.length - 1].id}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                  
                  {/* Preview Section */}
                  <div className="xl:sticky xl:top-8">
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