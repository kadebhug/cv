import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeSchema } from '../../schemas/resumeSchemas';
import { ResumeData } from '../../types/resume';
import { ColorTheme } from '../ResumePreviewer';
import { getColorThemeById } from '../../utils/themeUtils';
import { saveResume, updateResume, getResume } from '../../services/resumeService';
import { useAuth } from '../../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { colorThemes } from '../../utils/themeUtils';
import { optionalSections } from './sectionDefinitions';

interface ResumeContextType {
  // Form state
  methods: ReturnType<typeof useForm<ResumeData>>;
  formData: Partial<ResumeData>;
  
  // UI state
  isMobile: boolean;
  isLargeScreen: boolean;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  sectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  scrollToSection: (sectionId: string) => void;
  
  // Template state
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  selectedColorTheme: ColorTheme;
  setSelectedColorTheme: (theme: ColorTheme) => void;
  isChangingTemplate: boolean;
  showTemplateSelector: boolean;
  setShowTemplateSelector: (show: boolean) => void;
  handleTemplateChange: (templateId: string) => void;
  handleColorThemeChange: (theme: ColorTheme) => void;
  
  // Optional sections
  enabledOptionalSections: string[];
  toggleOptionalSection: (sectionId: string) => void;
  
  // Preview
  showPreviewDialog: boolean;
  setShowPreviewDialog: (show: boolean) => void;
  togglePreviewDialog: () => void;
  
  // Feedback
  resumeScore: number;
  improvementSuggestions: string[];
  feedbackExpanded: boolean;
  setFeedbackExpanded: (expanded: boolean) => void;
  feedbackTab: 'feedback' | 'ats';
  setFeedbackTab: (tab: 'feedback' | 'ats') => void;
  jobDescription: string;
  setJobDescription: (description: string) => void;
  
  // Save state
  isSaving: boolean;
  saveSuccess: boolean;
  saveError: string;
  handleSaveResume: () => Promise<void>;
  
  // LinkedIn import
  handleLinkedInImport: (linkedInData: Partial<ResumeData>) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Form state
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
  
  // Watch for form changes
  const formValues = useWatch({
    control: methods.control
  });
  
  // State
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
  const handleTemplateChange = (templateId: string) => {
    setIsChangingTemplate(true);
    // Small delay to ensure clean unmount of previous template
    setTimeout(() => {
      setSelectedTemplate(templateId);
      setIsChangingTemplate(false);
    }, 100);
  };

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
    <ResumeContext.Provider value={{
      // Form state
      methods,
      formData,
      
      // UI state
      isMobile,
      isLargeScreen,
      activeSection,
      setActiveSection,
      sectionRefs,
      scrollToSection,
      
      // Template state
      selectedTemplate,
      setSelectedTemplate,
      selectedColorTheme,
      setSelectedColorTheme,
      isChangingTemplate,
      showTemplateSelector,
      setShowTemplateSelector,
      handleTemplateChange,
      handleColorThemeChange,
      
      // Optional sections
      enabledOptionalSections,
      toggleOptionalSection,
      
      // Preview
      showPreviewDialog,
      setShowPreviewDialog,
      togglePreviewDialog,
      
      // Feedback
      resumeScore,
      improvementSuggestions,
      feedbackExpanded,
      setFeedbackExpanded,
      feedbackTab,
      setFeedbackTab,
      jobDescription,
      setJobDescription,
      
      // Save state
      isSaving,
      saveSuccess,
      saveError,
      handleSaveResume,
      
      // LinkedIn import
      handleLinkedInImport,
    }}>
      <FormProvider {...methods}>
        {children}
      </FormProvider>
    </ResumeContext.Provider>
  );
}

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
} 