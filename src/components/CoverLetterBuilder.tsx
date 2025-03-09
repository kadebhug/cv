import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaChevronLeft, FaSave, FaDownload, FaSpinner, FaMagic } from 'react-icons/fa';
import { useForm, Controller } from 'react-hook-form';
import { saveCoverLetter, getCoverLetter } from '../services/coverLetterService';
import { getUserResumes } from '../services/resumeService';
import { generateCoverLetter } from '../services/geminiService';
import { FirebaseError } from 'firebase/app';
import { SignatureSelector } from './SignatureSelector';
import { useTheme } from '../contexts/ThemeContext';
import { JobDescriptionModal } from './JobDescriptionModal';
import { ResumeData, Skill, Experience } from '../types/resume';

interface CoverLetterData {
  id?: string;
  name: string;
  recipientName: string;
  recipientCompany: string;
  position: string;
  introduction: string;
  body: string;
  conclusion: string;
  signature: string;
  address: string;
  phone: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
}

// Helper function to parse Firebase error messages
const getFirebaseErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    // Handle specific Firebase error codes
    switch (error.code) {
      case 'permission-denied':
        return 'You do not have permission to perform this action. Please check if you are logged in.';
      case 'unavailable':
        return 'The service is currently unavailable. Please try again later.';
      default:
        return `Firebase error: ${error.message}`;
    }
  }
  
  // Generic error handling
  return error instanceof Error ? error.message : 'An unknown error occurred';
};

export function CoverLetterBuilder() {
  const { coverId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [signatureImage, setSignatureImage] = useState<string>('');
  const [isJobDescriptionModalOpen, setIsJobDescriptionModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userResumes, setUserResumes] = useState<ResumeData[]>([]);
  
  const { register, handleSubmit, reset, control, formState: { errors, isDirty, isValid }, setValue, watch, trigger } = useForm<CoverLetterData>({
    defaultValues: {
      name: '',
      recipientName: '',
      recipientCompany: '',
      position: '',
      introduction: '',
      body: '',
      conclusion: '',
      signature: '',
      address: '',
      phone: '',
      email: currentUser?.email || '',
      userId: currentUser?.uid || ''
    },
    mode: 'onTouched'
  });

  // Watch the signature field
  const signatureValue = watch('signature');
  
  // Log form errors when they change
  useEffect(() => {
    console.log('Form errors:', errors);
    console.log('Form state:', { isDirty, isValid });
  }, [errors, isDirty, isValid]);

  useEffect(() => {
    // Load existing cover letter if editing
    if (coverId && currentUser) {
      const loadCoverLetter = async () => {
        try {
          setLoading(true);
          const coverLetterData = await getCoverLetter(coverId);
          if (coverLetterData && coverLetterData.userId === currentUser.uid) {
            console.log('Loaded cover letter:', coverLetterData);
            
            // Ensure backward compatibility with existing cover letters
            const completeData = {
              ...coverLetterData,
              address: coverLetterData.address || '',
              phone: coverLetterData.phone || '',
              email: coverLetterData.email || currentUser.email || ''
            };
            
            reset(completeData);
            
            // If there's a signature image URL in the signature field, set it
            if (coverLetterData.signature && coverLetterData.signature.startsWith('data:image')) {
              setSignatureImage(coverLetterData.signature);
            }
          } else {
            console.error('Cover letter not found or unauthorized');
            navigate('/dashboard');
          }
        } catch (error) {
          console.error('Error loading cover letter:', error);
          setSaveError(getFirebaseErrorMessage(error));
        } finally {
          setLoading(false);
        }
      };
      
      loadCoverLetter();
    }
    
    // Load user resumes to get skills and experience
    if (currentUser) {
      const loadUserResumes = async () => {
        try {
          const resumes = await getUserResumes(currentUser.uid);
          setUserResumes(resumes);
        } catch (error) {
          console.error('Error loading user resumes:', error);
        }
      };
      
      loadUserResumes();
    }
  }, [coverId, currentUser, navigate, reset]);

  // Handle signature change
  const handleSignatureChange = (value: string) => {
    setSignatureImage(value);
    setValue('signature', value, { shouldDirty: true });
  };
  
  const onSubmit = async (data: CoverLetterData) => {
    console.log('Form submission triggered', { data, isDirty, isValid, errors });
    
    if (!currentUser) {
      setSaveError('You must be logged in to save a cover letter');
      return;
    }
    
    // Clear previous error/success states
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      setSaving(true);
      
      // Add user ID to the data
      data.userId = currentUser.uid;
      
      console.log('Saving cover letter:', { coverId, data });
      
      // Save to Firestore
      const savedId = await saveCoverLetter(coverId, data);
      
      setSaveSuccess(true);
      console.log('Cover letter saved successfully with ID:', savedId);
      
      // Reset success message after a delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
      // If creating a new cover letter, navigate to the dashboard
      if (!coverId) {
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error saving cover letter:', error);
      setSaveError(getFirebaseErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };
  
  // Handle job description submission
  const handleJobDescriptionSubmit = async (jobDescription: string) => {
    if (!currentUser) {
      setSaveError('You must be logged in to generate a cover letter');
      setIsJobDescriptionModalOpen(false);
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Get the most recent resume for user profile data
      const mostRecentResume = userResumes.length > 0 ? userResumes[0] : null;
      
      if (!mostRecentResume) {
        setSaveError('You need to create a resume first to generate a cover letter');
        setIsJobDescriptionModalOpen(false);
        setIsGenerating(false);
        return;
      }
      
      // Extract skills from resume
      const skills = mostRecentResume.skills?.map(skill => skill.name) || [];
      
      // Extract experience from resume
      const experienceText = mostRecentResume.experience?.map(exp => 
        `${exp.jobTitle} at ${exp.employer} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || 'N/A'}): ${exp.description}`
      ).join('\n\n') || '';
      
      // Prepare user profile for Gemini API
      const userProfile = {
        name: `${mostRecentResume.personal.firstName} ${mostRecentResume.personal.lastName}`,
        email: mostRecentResume.personal.email,
        phone: mostRecentResume.personal.phone,
        address: [
          mostRecentResume.personal.address,
          mostRecentResume.personal.city,
          mostRecentResume.personal.state,
          mostRecentResume.personal.zipCode,
          mostRecentResume.personal.country
        ].filter(Boolean).join(', '),
        skills: skills,
        experience: experienceText || mostRecentResume.professionalSummary || ''
      };
      
      // Generate cover letter with Gemini API
      const generatedContent = await generateCoverLetter(jobDescription, userProfile);
      
      // Update form with generated content
      setValue('recipientName', generatedContent.recipientName || 'Hiring Manager', { shouldDirty: true });
      setValue('recipientCompany', generatedContent.recipientCompany || '', { shouldDirty: true });
      setValue('position', generatedContent.position || '', { shouldDirty: true });
      setValue('introduction', generatedContent.introduction || '', { shouldDirty: true });
      setValue('body', generatedContent.body || '', { shouldDirty: true });
      setValue('conclusion', generatedContent.conclusion || '', { shouldDirty: true });
      
      // Set a default name for the cover letter based on position
      if (!watch('name') && generatedContent.position) {
        setValue('name', `Cover Letter - ${generatedContent.position}`, { shouldDirty: true });
      }
      
      // Close modal and show success message
      setIsJobDescriptionModalOpen(false);
      setSaveSuccess(true);
      
      // Reset success message after a delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error generating cover letter:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to generate cover letter');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Create a manual submit function that bypasses the isDirty check
  const handleManualSubmit = async () => {
    console.log('Manual submit triggered');
    
    // Trigger validation on all fields
    const isFormValid = await trigger();
    console.log('Form validation result:', isFormValid);
    
    if (isFormValid) {
      // Get current form values
      const formValues = {
        name: watch('name'),
        recipientName: watch('recipientName'),
        recipientCompany: watch('recipientCompany'),
        position: watch('position'),
        introduction: watch('introduction'),
        body: watch('body'),
        conclusion: watch('conclusion'),
        signature: watch('signature'),
        address: watch('address'),
        phone: watch('phone'),
        email: watch('email'),
        userId: currentUser?.uid || ''
      };
      
      // Call the onSubmit function directly
      await onSubmit(formValues);
    } else {
      console.log('Form has validation errors, cannot submit');
    }
  };
  
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
        <FaSpinner className={`animate-spin h-10 w-10 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
      </div>
    );
  }
  
  return (
    <div className={`max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : ''}`}>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary p-2.5 rounded-full flex items-center justify-center"
          >
            <FaChevronLeft className="h-5 w-5" />
          </button>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {coverId ? 'Edit Cover Letter' : 'Create a Cover Letter'}
          </h1>
        </div>
        
        {/* Add AI generation button */}
        <button
          type="button"
          onClick={() => setIsJobDescriptionModalOpen(true)}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
            theme === 'dark'
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
          disabled={isGenerating || !currentUser}
        >
          <FaMagic className="mr-2" />
          Generate with AI
        </button>
      </div>
      
      {saveSuccess && (
        <div className={`mb-6 ${theme === 'dark' ? 'bg-green-900 border-l-4 border-green-600 p-4' : 'bg-green-50 border-l-4 border-green-400 p-4'}`}>
          <div className="flex">
            <div className="ml-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                Cover letter saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {saveError && (
        <div className={`mb-6 ${theme === 'dark' ? 'bg-red-900 border-l-4 border-red-600 p-4' : 'bg-red-50 border-l-4 border-red-400 p-4'}`}>
          <div className="flex">
            <div className="ml-3">
              <p className={`text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                {saveError}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Add debug info */}
      {Object.keys(errors).length > 0 && (
        <div className={`mb-6 ${theme === 'dark' ? 'bg-yellow-900 border-l-4 border-yellow-600 p-4' : 'bg-yellow-50 border-l-4 border-yellow-400 p-4'}`}>
          <p className={`text-sm ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
            Please fix the following errors before saving:
          </p>
          <ul className={`list-disc pl-5 mt-2 text-sm ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{field}: {error.message as string}</li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden`}>
          <div className={`px-6 py-5 ${theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Cover Letter Details</h3>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Basic information for your cover letter.</p>
          </div>
          <div className={`px-6 py-6`}>
            <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Cover Letter Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="name"
                    className={`block w-full px-4 py-3 text-base ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                        : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md transition-colors ${errors.name ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : ''}`}
                    placeholder="Software Engineer Application"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="position" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Position Applied For
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="position"
                    className={`block w-full px-4 py-3 text-base ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                        : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md transition-colors ${errors.position ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : ''}`}
                    placeholder="Software Engineer"
                    {...register('position', { required: 'Position is required' })}
                  />
                  {errors.position && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.position && (
                  <p className="mt-2 text-sm text-red-600">{errors.position.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="recipientName" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Recipient Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="recipientName"
                    className={`block w-full px-4 py-3 text-base ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                        : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md transition-colors ${errors.recipientName ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : ''}`}
                    placeholder="John Smith"
                    {...register('recipientName', { required: 'Recipient name is required' })}
                  />
                  {errors.recipientName && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.recipientName && (
                  <p className="mt-2 text-sm text-red-600">{errors.recipientName.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="recipientCompany" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Company Name
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="recipientCompany"
                    className={`block w-full px-4 py-3 text-base ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                        : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md transition-colors ${errors.recipientCompany ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : ''}`}
                    placeholder="ABC Company"
                    {...register('recipientCompany', { required: 'Company name is required' })}
                  />
                  {errors.recipientCompany && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.recipientCompany && (
                  <p className="mt-2 text-sm text-red-600">{errors.recipientCompany.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden`}>
          <div className={`px-6 py-5 ${theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Your Contact Information</h3>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>This information will appear in your cover letter header.</p>
          </div>
          <div className={`px-6 py-6`}>
            <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="address"
                    className={`block w-full px-4 py-3 text-base ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                        : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md transition-colors ${errors.address ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : ''}`}
                    placeholder="123 Your Street, City, Country, Zip Code"
                    {...register('address', { required: 'Your address is required' })}
                  />
                  {errors.address && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.address && (
                  <p className="mt-2 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Phone Number
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="tel"
                    id="phone"
                    className={`block w-full px-4 py-3 text-base ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                        : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md transition-colors ${errors.phone ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : ''}`}
                    placeholder="(+27) 12-345-6789"
                    {...register('phone', { required: 'Phone number is required' })}
                  />
                  {errors.phone && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="email"
                    id="email"
                    className={`block w-full px-4 py-3 text-base ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                        : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md transition-colors ${errors.email ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : ''}`}
                    placeholder="email@example.com"
                    {...register('email', { 
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden`}>
          <div className={`px-6 py-5 ${theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Cover Letter Content</h3>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Write your cover letter content here.</p>
          </div>
          <div className={`px-6 py-6`}>
            <div className="grid grid-cols-1 gap-y-8">
              <div>
                <label htmlFor="introduction" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Introduction
                </label>
                <div className="relative rounded-md shadow-sm">
                  <textarea
                    id="introduction"
                    rows={4}
                    className={`block w-full px-4 py-3 text-base ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                        : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md transition-colors ${errors.introduction ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : ''}`}
                    placeholder="I am writing to express my interest in the Software Engineer position at ABC Company that I saw advertised on your website."
                    {...register('introduction', { required: 'Introduction is required' })}
                  />
                  {errors.introduction && (
                    <div className="absolute top-0 right-0 pr-3 pt-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.introduction && (
                  <p className="mt-2 text-sm text-red-600">{errors.introduction.message}</p>
                )}
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Introduce yourself and state the position you're applying for.
                </p>
              </div>
              
              <div>
                <label htmlFor="body" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Body
                </label>
                <div className="relative rounded-md shadow-sm">
                  <textarea
                    id="body"
                    rows={10}
                    className={`block w-full px-4 py-3 text-base ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                        : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md transition-colors ${errors.body ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : ''}`}
                    placeholder="With over 5 years of experience in software development, I have developed strong skills in JavaScript, React, and Node.js. In my previous role at XYZ Company, I successfully led a team of developers to deliver a complex web application that improved customer engagement by 30%."
                    {...register('body', { required: 'Body content is required' })}
                  />
                  {errors.body && (
                    <div className="absolute top-0 right-0 pr-3 pt-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.body && (
                  <p className="mt-2 text-sm text-red-600">{errors.body.message}</p>
                )}
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Highlight your relevant experience, skills, and achievements. You can use bullet points by starting lines with • or -.
                </p>
              </div>
              
              <div>
                <label htmlFor="conclusion" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Conclusion
                </label>
                <div className="relative rounded-md shadow-sm">
                  <textarea
                    id="conclusion"
                    rows={4}
                    className={`block w-full px-4 py-3 text-base ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500' 
                        : 'border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500'
                    } rounded-md transition-colors ${errors.conclusion ? (theme === 'dark' ? 'border-red-500' : 'border-red-300') : ''}`}
                    placeholder="I am excited about the opportunity to bring my skills and experience to ABC Company. I would welcome the chance to discuss how I can contribute to your team. Thank you for considering my application."
                    {...register('conclusion', { required: 'Conclusion is required' })}
                  />
                  {errors.conclusion && (
                    <div className="absolute top-0 right-0 pr-3 pt-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.conclusion && (
                  <p className="mt-2 text-sm text-red-600">{errors.conclusion.message}</p>
                )}
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Conclude with a call to action and express your interest in an interview.
                </p>
              </div>
              
              <div>
                <label htmlFor="signature" className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Signature
                </label>
                <div className="mt-1">
                  <Controller
                    name="signature"
                    control={control}
                    rules={{ required: 'Signature is required' }}
                    render={({ field }) => (
                      <SignatureSelector
                        value={signatureImage}
                        onChange={handleSignatureChange}
                      />
                    )}
                  />
                  {errors.signature && (
                    <p className="mt-2 text-sm text-red-600">{errors.signature.message}</p>
                  )}
                </div>
                <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  Draw or select your signature. This will appear at the bottom of your cover letter.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            disabled={saving}
            className="btn btn-primary flex items-center"
            onClick={handleManualSubmit}
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin mr-2 h-5 w-5" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2 h-5 w-5" />
                Save Cover Letter
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Job Description Modal */}
      <JobDescriptionModal
        isOpen={isJobDescriptionModalOpen}
        onClose={() => setIsJobDescriptionModalOpen(false)}
        onSubmit={handleJobDescriptionSubmit}
        isLoading={isGenerating}
      />
    </div>
  );
} 