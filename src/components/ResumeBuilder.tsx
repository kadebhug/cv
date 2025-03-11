import { useState, useEffect, useCallback, useRef } from 'react'
import { ResumeForm } from './ResumeForm'
import { ResumePreviewer, ColorTheme } from './ResumePreviewer'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resumeSchema } from '../schemas/resumeSchemas'
import { ResumeData } from '../types/resume'
import { FaUser, FaFileAlt, FaBriefcase, FaGraduationCap, FaTools, FaLink, FaPuzzlePiece, FaHeart, FaChevronLeft, FaChevronRight, FaBars, FaTimes, FaPalette, FaCheck, FaRobot, FaLightbulb, FaLayerGroup, FaEdit, FaLinkedin, FaSpinner, FaSave, FaCertificate, FaProjectDiagram, FaTrophy, FaPlus, FaMinus, FaChartLine, FaAngleDown, FaAngleUp, FaEye } from 'react-icons/fa'
import { ResumeFeedback } from './ResumeFeedback'
import { ATSOptimizer } from './ATSOptimizer'
import { TemplateSelector } from './TemplateSelector'
import { LinkedInImport } from './LinkedInImport'
import { useAuth } from '../contexts/AuthContext'
import { saveResume, updateResume, getResume } from '../services/resumeService'
import { useParams, useNavigate } from 'react-router-dom'
import { colorThemes, getColorThemeById } from '../utils/themeUtils'

// Core sections that are always shown
const coreSections = [
  { id: 'personal', title: 'Personal Details', icon: FaUser, description: 'Basic information about you' },
  { id: 'summary', title: 'Professional Summary', icon: FaFileAlt, description: 'Brief overview of your professional background' },
  { id: 'experience', title: 'Employment History', icon: FaBriefcase, description: 'Your work history and achievements' },
  { id: 'education', title: 'Education', icon: FaGraduationCap, description: 'Your academic background' },
  { id: 'social', title: 'Social Links', icon: FaLink, description: 'Your professional online presence' },
  { id: 'skills', title: 'Skills', icon: FaTools, description: 'Your technical and soft skills' },
] as const;

// Optional sections that can be toggled
const optionalSections = [
  { id: 'certifications', title: 'Certifications & Licenses', icon: FaCertificate, description: 'Your professional certifications and licenses' },
  { id: 'projects', title: 'Projects', icon: FaProjectDiagram, description: 'Your personal or professional projects' },
  { id: 'achievements', title: 'Achievements & Awards', icon: FaTrophy, description: 'Your notable achievements and awards' },
  { id: 'hobbies', title: 'Hobbies', icon: FaHeart, description: 'Your interests and activities' },
  { id: 'custom', title: 'Custom Sections', icon: FaPuzzlePiece, description: 'Add custom sections to your resume' },
  { id: 'linkedin', title: 'LinkedIn Import', icon: FaLinkedin, description: 'Import your profile from LinkedIn' },
] as const;

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
  { id: 'general', name: 'General' },
  { id: 'creative', name: 'Creative' },
  { id: 'business', name: 'Business' },
  { id: 'tech', name: 'Technology' },
  { id: 'education', name: 'Education' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'legal', name: 'Legal' }
];

// Preview Dialog Component
interface PreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  templateId: string;
  colorTheme: ColorTheme;
}

function PreviewDialog({ isOpen, onClose, data, templateId, colorTheme }: PreviewDialogProps) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Resume Preview</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="mt-2 max-h-[70vh] overflow-auto">
              <ResumePreviewer 
                data={data} 
                templateId={templateId}
                colorTheme={colorTheme}
                showSampleData={false}
              />
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ResumeBuilder() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [selectedColorTheme, setSelectedColorTheme] = useState<ColorTheme>(colorThemes[0]);
  const [isChangingTemplate, setIsChangingTemplate] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [jobDescription, setJobDescription] = useState<string>('');
  const [feedbackTab, setFeedbackTab] = useState<'feedback' | 'ats'>('feedback');
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [enabledOptionalSections, setEnabledOptionalSections] = useState<string[]>([]);
  const [resumeScore, setResumeScore] = useState(0);
  const [feedbackExpanded, setFeedbackExpanded] = useState(false);
  const [improvementSuggestions, setImprovementSuggestions] = useState<string[]>([]);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  
  // Refs for scrolling to sections
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
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
  });
  
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
  });
  
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

  // Check if mobile and large screen on mount and window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Load resume data if editing an existing resume
  useEffect(() => {
    const loadResume = async () => {
      if (resumeId && currentUser) {
        try {
          const resumeData = await getResume(resumeId);
          
          if (resumeData) {
            // Set form values
            methods.reset(resumeData);
            
            // Set template and color theme
            if (resumeData.theme) {
              if (resumeData.theme.template) {
                setSelectedTemplate(resumeData.theme.template);
              }
              
              if (resumeData.theme.color) {
                const theme = getColorThemeById(resumeData.theme.color);
                if (theme) {
                  setSelectedColorTheme(theme);
                }
              }
            }
            
            // Enable optional sections that have data
            const sectionsToEnable = optionalSections
              .filter(section => {
                const sectionId = section.id;
                if (sectionId === 'certifications' && resumeData.certifications?.length) return true;
                if (sectionId === 'projects' && resumeData.projects?.length) return true;
                if (sectionId === 'achievements' && resumeData.achievements?.length) return true;
                if (sectionId === 'hobbies' && resumeData.hobbies?.length) return true;
                if (sectionId === 'custom' && resumeData.customSections?.length) return true;
                return false;
              })
              .map(section => section.id);
            
            setEnabledOptionalSections(sectionsToEnable);
          }
        } catch (error) {
          console.error('Error loading resume:', error);
        }
      }
    };
    
    loadResume();
  }, [resumeId, currentUser, methods]);

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

  // Toggle optional section
  const toggleOptionalSection = (sectionId: string) => {
    setEnabledOptionalSections(prev => {
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId);
      } else {
        return [...prev, sectionId];
      }
    });
  };

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const sectionElement = sectionRefs.current[sectionId];
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle LinkedIn import
  const handleLinkedInImport = (linkedInData: Partial<ResumeData>) => {
    // Merge LinkedIn data with existing form data
    const mergedData = {
      ...methods.getValues(),
      ...linkedInData,
    };
    
    methods.reset(mergedData);
    
    // Enable relevant optional sections based on imported data
    const sectionsToEnable = [...enabledOptionalSections];
    
    if (linkedInData.certifications?.length && !sectionsToEnable.includes('certifications')) {
      sectionsToEnable.push('certifications');
    }
    
    if (linkedInData.projects?.length && !sectionsToEnable.includes('projects')) {
      sectionsToEnable.push('projects');
    }
    
    setEnabledOptionalSections(sectionsToEnable);
    
    // Scroll to top after import
    window.scrollTo(0, 0);
  };

  // Save resume
  const handleSaveResume = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    
    try {
      const formData = methods.getValues();
      
      // Ensure arrays are properly initialized
      const resumeData = {
        ...formData,
        userId: currentUser?.uid,
        experience: formData.experience || [],
        education: formData.education || [],
        skills: formData.skills || [],
        socialLinks: formData.socialLinks || [],
        certifications: formData.certifications || [],
        projects: formData.projects || [],
        customSections: formData.customSections || [],
        theme: {
          template: selectedTemplate,
          color: selectedColorTheme.id
        }
      };

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

  // Calculate resume score based on completeness
  useEffect(() => {
    if (formValues) {
      let score = 0;
      const maxScore = 100;
      
      // Personal details (20%)
      if (formValues.personal) {
        const personal = formValues.personal;
        const personalFields = ['firstName', 'lastName', 'email', 'phone', 'jobTitle'];
        const filledFields = personalFields.filter(field => personal[field as keyof typeof personal]);
        score += (filledFields.length / personalFields.length) * 20;
      }
      
      // Professional summary (15%)
      if (formValues.professionalSummary && formValues.professionalSummary.length > 50) {
        score += 15;
      } else if (formValues.professionalSummary && formValues.professionalSummary.length > 0) {
        score += 7.5;
      }
      
      // Experience (25%)
      if (Array.isArray(formValues.experience) && formValues.experience.length > 0) {
        const experienceScore = Math.min(formValues.experience.length, 3) / 3 * 25;
        score += experienceScore;
      }
      
      // Education (15%)
      if (Array.isArray(formValues.education) && formValues.education.length > 0) {
        const educationScore = Math.min(formValues.education.length, 2) / 2 * 15;
        score += educationScore;
      }
      
      // Skills (15%)
      if (Array.isArray(formValues.skills) && formValues.skills.length > 0) {
        const skillsScore = Math.min(formValues.skills.length, 5) / 5 * 15;
        score += skillsScore;
      }
      
      // Additional sections (10%)
      const additionalSections = ['certifications', 'projects', 'achievements', 'hobbies'];
      let additionalSectionsCount = 0;
      
      additionalSections.forEach(section => {
        if (Array.isArray(formValues[section as keyof typeof formValues]) && 
            (formValues[section as keyof typeof formValues] as any[]).length > 0) {
          additionalSectionsCount++;
        }
      });
      
      score += (additionalSectionsCount / additionalSections.length) * 10;
      
      // Round to nearest integer
      setResumeScore(Math.round(score));
      
      // Generate improvement suggestions
      const suggestions: string[] = [];
      
      if (!formValues.personal?.jobTitle) {
        suggestions.push('Add a job title to your personal details');
      }
      
      if (!formValues.professionalSummary || formValues.professionalSummary.length < 50) {
        suggestions.push('Expand your professional summary (aim for 50-200 characters)');
      }
      
      if (!Array.isArray(formValues.experience) || formValues.experience.length === 0) {
        suggestions.push('Add at least one work experience entry');
      }
      
      if (!Array.isArray(formValues.education) || formValues.education.length === 0) {
        suggestions.push('Add your educational background');
      }
      
      if (!Array.isArray(formValues.skills) || formValues.skills.length < 5) {
        suggestions.push('Add more skills (aim for at least 5)');
      }
      
      if (additionalSectionsCount === 0) {
        suggestions.push('Consider adding optional sections like certifications or projects');
      }
      
      setImprovementSuggestions(suggestions);
    }
  }, [formValues]);

  // Toggle preview dialog
  const togglePreviewDialog = () => {
    setShowPreviewDialog(prev => !prev);
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
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-30 shadow-sm px-4 py-3 flex justify-between items-center">
          <h1 className="font-bold text-gray-900 text-lg">Resume Builder</h1>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleSaveResume}
              disabled={isSaving}
              className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? <FaSpinner className="animate-spin" size={18} /> : <FaSave size={18} />}
            </button>
            <button 
              onClick={() => setShowTemplateSelector(true)}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              <FaLayerGroup size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left Section - Scrollable Form */}
          <div className={`${isLargeScreen ? 'lg:w-1/2' : 'w-full'} ${isMobile ? 'pt-16' : ''} overflow-y-auto`}>
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
              <FormProvider {...methods}>
                {/* Header with Save Button */}
                <div className="hidden md:flex justify-between items-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setShowTemplateSelector(true)}
                      className="btn btn-secondary flex items-center"
                    >
                      <FaLayerGroup className="mr-2" size={16} />
                      Change Template
                    </button>
                    <button
                      onClick={handleSaveResume}
                      disabled={isSaving}
                      className="btn btn-primary flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" size={16} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-2" size={16} />
                          Save Resume
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {saveSuccess && (
                  <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
                    Resume saved successfully!
                  </div>
                )}
                
                {saveError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {saveError}
                  </div>
                )}

                {/* Resume Score Indicator */}
                <div className="bg-white shadow-sm rounded-lg p-4 mb-8 sticky top-0 z-10">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <FaChartLine className="mr-2 text-gray-600" size={18} />
                      <h2 className="text-lg font-semibold text-gray-800">Resume Score</h2>
                    </div>
                    <button 
                      onClick={() => setFeedbackExpanded(!feedbackExpanded)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      {feedbackExpanded ? <FaAngleUp size={18} /> : <FaAngleDown size={18} />}
                    </button>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div 
                      className={`h-2.5 rounded-full ${
                        resumeScore >= 70 ? 'bg-green-500' : 
                        resumeScore >= 40 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${resumeScore}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Score: {resumeScore}/100</span>
                    <span>{
                      resumeScore >= 70 ? 'Good' : 
                      resumeScore >= 40 ? 'Needs improvement' : 
                      'Incomplete'
                    }</span>
                  </div>
                  
                  {feedbackExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FaLightbulb className="mr-2 text-yellow-500" size={14} />
                        Improvement Suggestions
                      </h3>
                      
                      {improvementSuggestions.length > 0 ? (
                        <ul className="text-sm text-gray-600 space-y-2 pl-6 list-disc">
                          {improvementSuggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-green-600">
                          Great job! Your resume looks complete.
                        </p>
                      )}
                      
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={() => {
                            setFeedbackTab('feedback');
                            setActiveSection('feedback-panel');
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <FaLightbulb className="mr-1" size={12} />
                          Detailed Feedback
                        </button>
                        
                        <button
                          onClick={() => {
                            setFeedbackTab('ats');
                            setActiveSection('feedback-panel');
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <FaRobot className="mr-1" size={12} />
                          ATS Optimization
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Feedback Panel (shown when user clicks on detailed feedback or ATS optimization) */}
                {activeSection === 'feedback-panel' && (
                  <div 
                    ref={el => sectionRefs.current['feedback-panel'] = el}
                    className="bg-white shadow-sm rounded-lg p-6 mb-8"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        {feedbackTab === 'feedback' ? (
                          <>
                            <FaLightbulb className="mr-2" size={20} />
                            Resume Feedback
                          </>
                        ) : (
                          <>
                            <FaRobot className="mr-2" size={20} />
                            ATS Optimization
                          </>
                        )}
                      </h2>
                      <button
                        onClick={() => setActiveSection(null)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                        title="Close panel"
                      >
                        <FaTimes size={16} />
                      </button>
                    </div>
                    
                    <div className="bg-white rounded-lg overflow-hidden">
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
                  </div>
                )}

                {/* Core Sections */}
                <div className="space-y-8">
                  {coreSections.map((section) => (
                    <div 
                      key={section.id}
                      ref={el => sectionRefs.current[section.id] = el}
                      className="bg-white shadow-sm rounded-lg p-6"
                      id={`section-${section.id}`}
                    >
                      <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                          <section.icon className="mr-2" size={20} />
                          {section.title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          {section.description}
                        </p>
                      </div>
                      <ResumeForm section={section.id} />
                    </div>
                  ))}

                  {/* Enabled Optional Sections */}
                  {enabledOptionalSections.map((sectionId) => {
                    const section = optionalSections.find(s => s.id === sectionId);
                    if (!section) return null;
                    
                    return (
                      <div 
                        key={section.id}
                        ref={el => sectionRefs.current[section.id] = el}
                        className="bg-white shadow-sm rounded-lg p-6"
                        id={`section-${section.id}`}
                      >
                        <div className="mb-4 flex justify-between items-center">
                          <div>
                            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                              <section.icon className="mr-2" size={20} />
                              {section.title}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                              {section.description}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleOptionalSection(section.id)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                            title="Remove section"
                          >
                            <FaTimes size={16} />
                          </button>
                        </div>
                        
                        {section.id === 'linkedin' ? (
                          <LinkedInImport onImportComplete={handleLinkedInImport} />
                        ) : (
                          <ResumeForm section={section.id} />
                        )}
                      </div>
                    );
                  })}

                  {/* Optional Sections Toggle */}
                  <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Sections</h2>
                    <p className="text-sm text-gray-500 mb-4">
                      Add more sections to your resume to showcase additional qualifications and information.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {optionalSections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => toggleOptionalSection(section.id)}
                          className={`flex items-center justify-between p-3 rounded-md border transition-colors ${
                            enabledOptionalSections.includes(section.id)
                              ? 'border-blue-300 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            <section.icon className="mr-2" size={16} />
                            <span>{section.title}</span>
                          </div>
                          <div>
                            {enabledOptionalSections.includes(section.id) ? (
                              <FaMinus size={14} />
                            ) : (
                              <FaPlus size={14} />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Color Theme Selection */}
                  <div className="bg-white shadow-sm rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                      <FaPalette className="mr-2" size={20} />
                      Color Theme
                    </h2>
                    <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
                      {colorThemes.map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => handleColorThemeChange(theme)}
                          className={`relative rounded-full w-10 h-10 flex items-center justify-center border-2 transition-all duration-200 ${
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
                </div>
              </FormProvider>
            </div>
          </div>

          {/* Right Section - Fixed Preview (only visible on large screens) */}
          {isLargeScreen && (
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
          )}
        </div>
      </div>

      {/* Floating Action Button for Preview (only visible on screens smaller than lg) */}
      {!isLargeScreen && (
        <button
          onClick={togglePreviewDialog}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center z-40 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          aria-label="Preview Resume"
        >
          <FaEye size={24} />
        </button>
      )}
    </div>
  );
} 