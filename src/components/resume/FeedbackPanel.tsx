import { FaLightbulb, FaRobot, FaTimes } from 'react-icons/fa';
import { ResumeFeedback } from '../ResumeFeedback';
import { ATSOptimizer } from '../ATSOptimizer';
import { useResumeContext } from './ResumeContext';

export function FeedbackPanel() {
  const { 
    activeSection,
    setActiveSection,
    feedbackTab,
    setFeedbackTab,
    formData,
    sectionRefs,
    jobDescription,
    setJobDescription
  } = useResumeContext();

  if (activeSection !== 'feedback-panel') return null;

  return (
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
  );
} 