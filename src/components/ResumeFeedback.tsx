import { useState, useEffect } from 'react';
import { ResumeData } from '../types/resume';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

interface ResumeFeedbackProps {
  resumeData: ResumeData;
}

type FeedbackItem = {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  section: string;
  priority: number; // 1-10, 10 being highest priority
};

export function ResumeFeedback({ resumeData }: ResumeFeedbackProps) {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    // Ensure resumeData is valid before generating feedback
    if (!resumeData || typeof resumeData !== 'object') {
      setFeedback([]);
      return;
    }
    
    // Generate feedback whenever resume data changes
    const newFeedback = generateFeedback(resumeData);
    setFeedback(newFeedback);
  }, [resumeData]);

  const generateFeedback = (data: ResumeData): FeedbackItem[] => {
    const feedbackItems: FeedbackItem[] = [];

    // Ensure data and its properties exist
    if (!data) return feedbackItems;
    
    // Ensure personal data exists
    if (data.personal) {
      // Personal section feedback
      if (!data.personal.firstName || !data.personal.lastName) {
        feedbackItems.push({
          id: 'personal-name',
          type: 'error',
          message: 'Your name is missing. This is essential information for any resume.',
          section: 'personal',
          priority: 10,
        });
      }

      if (!data.personal.email) {
        feedbackItems.push({
          id: 'personal-email',
          type: 'error',
          message: 'Email address is missing. Employers need a way to contact you.',
          section: 'personal',
          priority: 10,
        });
      }

      if (!data.personal.phone) {
        feedbackItems.push({
          id: 'personal-phone',
          type: 'warning',
          message: 'Phone number is missing. Most employers prefer having multiple contact methods.',
          section: 'personal',
          priority: 8,
        });
      }

      if (!data.personal.jobTitle) {
        feedbackItems.push({
          id: 'personal-job-title',
          type: 'warning',
          message: 'Job title is missing. Adding your target role helps employers understand your career goals.',
          section: 'personal',
          priority: 7,
        });
      }
    } else {
      feedbackItems.push({
        id: 'personal-missing',
        type: 'error',
        message: 'Personal information section is missing. This is essential for any resume.',
        section: 'personal',
        priority: 10,
      });
    }

    // Professional summary feedback
    if (data.professionalSummary !== undefined) {
      if (!data.professionalSummary) {
        feedbackItems.push({
          id: 'summary-missing',
          type: 'error',
          message: 'Professional summary is missing. This is your chance to make a strong first impression.',
          section: 'summary',
          priority: 9,
        });
      } else if (data.professionalSummary.length < 50) {
        feedbackItems.push({
          id: 'summary-too-short',
          type: 'warning',
          message: 'Your professional summary is quite short. Consider expanding it to 3-5 sentences for better impact.',
          section: 'summary',
          priority: 6,
        });
      } else if (data.professionalSummary.length > 500) {
        feedbackItems.push({
          id: 'summary-too-long',
          type: 'warning',
          message: 'Your professional summary is quite long. Consider condensing it to 3-5 impactful sentences.',
          section: 'summary',
          priority: 5,
        });
      }
    } else {
      feedbackItems.push({
        id: 'summary-undefined',
        type: 'error',
        message: 'Professional summary section is missing. This is an important part of your resume.',
        section: 'summary',
        priority: 9,
      });
    }

    // Experience section feedback
    if (Array.isArray(data.experience)) {
      if (data.experience.length === 0) {
        feedbackItems.push({
          id: 'experience-missing',
          type: 'error',
          message: 'Work experience section is empty. Add your relevant work history.',
          section: 'experience',
          priority: 9,
        });
      } else {
        data.experience.forEach((exp, index) => {
          if (exp && (!exp.description || exp.description.length < 30)) {
            feedbackItems.push({
              id: `experience-${index}-description`,
              type: 'warning',
              message: `The description for "${exp.jobTitle || 'job'}" is too brief. Add specific achievements and responsibilities.`,
              section: 'experience',
              priority: 7,
            });
          }
          
          if (exp && exp.description) {
            // Check if description contains action verbs
            const actionVerbs = ['managed', 'led', 'developed', 'created', 'implemented', 'achieved', 'increased', 'reduced', 'improved', 'negotiated', 'coordinated', 'designed'];
            const hasActionVerbs = actionVerbs.some(verb => exp.description.toLowerCase().includes(verb));
            
            if (!hasActionVerbs && exp.description.length > 30) {
              feedbackItems.push({
                id: `experience-${index}-action-verbs`,
                type: 'info',
                message: `Consider using strong action verbs in your "${exp.jobTitle || 'job'}" description to highlight your achievements.`,
                section: 'experience',
                priority: 5,
              });
            }
          }
        });
      }
    } else {
      feedbackItems.push({
        id: 'experience-undefined',
        type: 'error',
        message: 'Work experience section is missing. This is a crucial part of your resume.',
        section: 'experience',
        priority: 9,
      });
    }

    // Education section feedback
    if (Array.isArray(data.education)) {
      if (data.education.length === 0) {
        feedbackItems.push({
          id: 'education-missing',
          type: 'warning',
          message: 'Education section is empty. Consider adding your educational background.',
          section: 'education',
          priority: 7,
        });
      }
    } else {
      feedbackItems.push({
        id: 'education-undefined',
        type: 'warning',
        message: 'Education section is missing. Consider adding your educational background.',
        section: 'education',
        priority: 7,
      });
    }

    // Skills section feedback
    if (Array.isArray(data.skills)) {
      if (data.skills.length === 0) {
        feedbackItems.push({
          id: 'skills-missing',
          type: 'warning',
          message: 'Skills section is empty. Highlight your relevant skills to stand out.',
          section: 'skills',
          priority: 8,
        });
      } else if (data.skills.length < 5) {
        feedbackItems.push({
          id: 'skills-few',
          type: 'info',
          message: 'You have listed few skills. Consider adding more relevant skills to showcase your capabilities.',
          section: 'skills',
          priority: 4,
        });
      }
    } else {
      feedbackItems.push({
        id: 'skills-undefined',
        type: 'warning',
        message: 'Skills section is missing. Highlighting your skills is important for standing out.',
        section: 'skills',
        priority: 8,
      });
    }

    // Overall resume feedback
    const totalSections = Object.keys(data).filter(key => {
      const value = data[key as keyof ResumeData];
      return Array.isArray(value) && value !== undefined && value !== null && value.length > 0;
    }).length;

    if (totalSections < 4) {
      feedbackItems.push({
        id: 'overall-incomplete',
        type: 'warning',
        message: 'Your resume appears incomplete. Consider filling out more sections for a comprehensive profile.',
        section: 'overall',
        priority: 9,
      });
    }

    // Sort feedback by priority (highest first)
    return feedbackItems.sort((a, b) => b.priority - a.priority);
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Group feedback by section
  const feedbackBySection = feedback.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, FeedbackItem[]>);

  const getSectionName = (key: string) => {
    const sectionNames: Record<string, string> = {
      personal: 'Personal Details',
      summary: 'Professional Summary',
      experience: 'Work Experience',
      education: 'Education',
      skills: 'Skills',
      social: 'Social Links',
      overall: 'Overall Resume',
    };
    return sectionNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getOverallScore = () => {
    if (feedback.length === 0) return 100;
    
    const errorCount = feedback.filter(item => item.type === 'error').length;
    const warningCount = feedback.filter(item => item.type === 'warning').length;
    const infoCount = feedback.filter(item => item.type === 'info').length;
    
    // Calculate score based on feedback types (errors have highest impact)
    const score = 100 - (errorCount * 15 + warningCount * 5 + infoCount * 1);
    return Math.max(0, Math.min(100, score));
  };

  const score = getOverallScore();
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Resume Feedback</h2>
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-gray-600 mb-2">Overall Resume Score</p>
          <div className="flex items-center">
            <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
            <span className="text-gray-500 ml-1">/100</span>
          </div>
        </div>
        <div className="w-32 h-32 relative">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="3"
              strokeDasharray="100, 100"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
            />
            <text x="18" y="20.5" textAnchor="middle" className="text-2xl font-bold">
              {score}%
            </text>
          </svg>
        </div>
      </div>
      
      {Object.keys(feedbackBySection).length === 0 ? (
        <div className="text-center py-8">
          <FaCheckCircle className="text-green-500 text-4xl mx-auto mb-3" />
          <p className="text-gray-600">Great job! Your resume looks complete and well-structured.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.keys(feedbackBySection).map(section => (
            <div key={section} className="border rounded-md overflow-hidden">
              <button
                onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <span className="font-medium text-gray-800">{getSectionName(section)}</span>
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-700">
                    {feedbackBySection[section].length}
                  </span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform ${
                    expandedSection === section ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedSection === section && (
                <div className="p-4 border-t">
                  <ul className="space-y-3">
                    {feedbackBySection[section].map(item => (
                      <li key={item.id} className="flex items-start">
                        <span className="mt-0.5 mr-3">{getFeedbackIcon(item.type)}</span>
                        <span className="text-gray-700">{item.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 