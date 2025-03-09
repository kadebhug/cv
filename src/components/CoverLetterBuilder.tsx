import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaChevronLeft, FaSave, FaDownload, FaSpinner } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { saveCoverLetter, getCoverLetter } from '../services/coverLetterService';
import { FirebaseError } from 'firebase/app';

interface CoverLetterData {
  id?: string;
  name: string;
  recipientName: string;
  recipientCompany: string;
  recipientAddress?: string;
  position: string;
  introduction: string;
  body: string;
  conclusion: string;
  signature: string;
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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<CoverLetterData>({
    defaultValues: {
      name: '',
      recipientName: '',
      recipientCompany: '',
      recipientAddress: '',
      position: '',
      introduction: '',
      body: '',
      conclusion: '',
      signature: '',
      userId: currentUser?.uid || ''
    }
  });
  
  useEffect(() => {
    // Load existing cover letter if editing
    if (coverId && currentUser) {
      const loadCoverLetter = async () => {
        try {
          setLoading(true);
          const coverLetterData = await getCoverLetter(coverId);
          if (coverLetterData && coverLetterData.userId === currentUser.uid) {
            console.log('Loaded cover letter:', coverLetterData);
            reset(coverLetterData);
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
  }, [coverId, currentUser, navigate, reset]);
  
  const onSubmit = async (data: CoverLetterData) => {
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin h-10 w-10 text-indigo-600" />
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            <FaChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {coverId ? 'Edit Cover Letter' : 'Create a Cover Letter'}
          </h1>
        </div>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={saving || !isDirty}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {saving ? (
            <>
              <FaSpinner className="animate-spin mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              <FaSave className="mr-2 h-4 w-4" />
              Save Cover Letter
            </>
          )}
        </button>
      </div>
      
      {saveSuccess && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Cover letter saved successfully!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {saveError && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {saveError}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Cover Letter Details</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Basic information for your cover letter.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Cover Letter Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.name ? 'border-red-300' : ''}`}
                    placeholder="Software Engineer Application"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                  Position Applied For
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="position"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.position ? 'border-red-300' : ''}`}
                    placeholder="Software Engineer"
                    {...register('position', { required: 'Position is required' })}
                  />
                  {errors.position && (
                    <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700">
                  Recipient Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="recipientName"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.recipientName ? 'border-red-300' : ''}`}
                    placeholder="John Smith"
                    {...register('recipientName', { required: 'Recipient name is required' })}
                  />
                  {errors.recipientName && (
                    <p className="mt-1 text-sm text-red-600">{errors.recipientName.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="recipientCompany" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="recipientCompany"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.recipientCompany ? 'border-red-300' : ''}`}
                    placeholder="ABC Company"
                    {...register('recipientCompany', { required: 'Company name is required' })}
                  />
                  {errors.recipientCompany && (
                    <p className="mt-1 text-sm text-red-600">{errors.recipientCompany.message}</p>
                  )}
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700">
                  Company Address (Optional)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="recipientAddress"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="123 Main St, City, State ZIP"
                    {...register('recipientAddress')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Cover Letter Content</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Write your cover letter content here.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6">
              <div>
                <label htmlFor="introduction" className="block text-sm font-medium text-gray-700">
                  Introduction
                </label>
                <div className="mt-1">
                  <textarea
                    id="introduction"
                    rows={3}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.introduction ? 'border-red-300' : ''}`}
                    placeholder="I am writing to express my interest in the Software Engineer position at ABC Company that I saw advertised on your website."
                    {...register('introduction', { required: 'Introduction is required' })}
                  />
                  {errors.introduction && (
                    <p className="mt-1 text-sm text-red-600">{errors.introduction.message}</p>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Introduce yourself and state the position you're applying for.
                </p>
              </div>
              
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                  Body
                </label>
                <div className="mt-1">
                  <textarea
                    id="body"
                    rows={8}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.body ? 'border-red-300' : ''}`}
                    placeholder="With over 5 years of experience in software development, I have developed strong skills in JavaScript, React, and Node.js. In my previous role at XYZ Company, I successfully led a team of developers to deliver a complex web application that improved customer engagement by 30%."
                    {...register('body', { required: 'Body content is required' })}
                  />
                  {errors.body && (
                    <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Highlight your relevant experience, skills, and achievements.
                </p>
              </div>
              
              <div>
                <label htmlFor="conclusion" className="block text-sm font-medium text-gray-700">
                  Conclusion
                </label>
                <div className="mt-1">
                  <textarea
                    id="conclusion"
                    rows={3}
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.conclusion ? 'border-red-300' : ''}`}
                    placeholder="I am excited about the opportunity to bring my skills and experience to ABC Company. I would welcome the chance to discuss how I can contribute to your team. Thank you for considering my application."
                    {...register('conclusion', { required: 'Conclusion is required' })}
                  />
                  {errors.conclusion && (
                    <p className="mt-1 text-sm text-red-600">{errors.conclusion.message}</p>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Conclude with a call to action and express your interest in an interview.
                </p>
              </div>
              
              <div>
                <label htmlFor="signature" className="block text-sm font-medium text-gray-700">
                  Signature
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="signature"
                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.signature ? 'border-red-300' : ''}`}
                    placeholder="Sincerely, John Doe"
                    {...register('signature', { required: 'Signature is required' })}
                  />
                  {errors.signature && (
                    <p className="mt-1 text-sm text-red-600">{errors.signature.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || !isDirty}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2 h-4 w-4" />
                Save Cover Letter
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 