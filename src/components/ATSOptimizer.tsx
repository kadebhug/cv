import { useState, useEffect } from 'react';
import { ResumeData } from '../types/resume';
import { FaRobot, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaSearch, FaInfoCircle } from 'react-icons/fa';

interface ATSOptimizerProps {
  resumeData: ResumeData;
  jobDescription?: string;
  onJobDescriptionChange?: (description: string) => void;
}

type ATSIssue = {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  suggestion?: string;
};

export function ATSOptimizer({ resumeData, jobDescription, onJobDescriptionChange }: ATSOptimizerProps) {
  const [jobKeywords, setJobKeywords] = useState<string[]>([]);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [atsIssues, setAtsIssues] = useState<ATSIssue[]>([]);
  const [jobDescInput, setJobDescInput] = useState(jobDescription || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showKeywordInput, setShowKeywordInput] = useState(false);
  const [manualKeyword, setManualKeyword] = useState('');
  const [manualKeywords, setManualKeywords] = useState<string[]>([]);

  useEffect(() => {
    // Ensure resumeData is valid before processing
    if (!resumeData || typeof resumeData !== 'object') {
      return;
    }
    
    if (jobDescription) {
      analyzeJobDescription(jobDescription);
      setJobDescInput(jobDescription);
    }
    checkATSCompatibility(resumeData);
  }, [resumeData, jobDescription]);

  const analyzeJobDescription = (description: string) => {
    if (!description.trim()) return;
    
    setIsAnalyzing(true);
    
    // Common keywords to ignore
    const stopWords = new Set([
      'and', 'the', 'of', 'to', 'a', 'in', 'for', 'is', 'on', 'that', 'by', 'this', 'with', 'i', 'you', 'it',
      'not', 'or', 'be', 'are', 'from', 'at', 'as', 'your', 'have', 'more', 'an', 'was', 'we', 'will', 'can',
      'all', 'about', 'which', 'they', 'our', 'has', 'would', 'there', 'their', 'what', 'so', 'up', 'out',
      'if', 'who', 'get', 'go', 'me', 'when', 'make', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
      'people', 'into', 'year', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now',
      'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'first',
      'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
    ]);

    // Extract potential keywords (nouns, technical terms, skills)
    const words = description
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    // Count word frequency
    const wordFrequency: Record<string, number> = {};
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    // Extract multi-word phrases (potential technical terms or job titles)
    const phrases: string[] = [];
    const descriptionLower = description.toLowerCase();
    
    // Common technical skills and job-related terms to look for
    const commonTerms = [
      'project management', 'agile', 'scrum', 'waterfall', 'kanban', 'lean', 'six sigma',
      'data analysis', 'data science', 'machine learning', 'artificial intelligence', 'deep learning',
      'front end', 'back end', 'full stack', 'devops', 'cloud computing', 'aws', 'azure', 'gcp',
      'react', 'angular', 'vue', 'node.js', 'javascript', 'typescript', 'python', 'java', 'c#', 'c++',
      'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'oracle', 'database', 'data warehouse',
      'business intelligence', 'tableau', 'power bi', 'excel', 'microsoft office',
      'customer service', 'sales', 'marketing', 'digital marketing', 'seo', 'sem', 'content marketing',
      'social media', 'product management', 'ux', 'ui', 'user experience', 'user interface',
      'leadership', 'team management', 'strategic planning', 'budget management', 'forecasting',
      'communication', 'presentation', 'negotiation', 'problem solving', 'critical thinking',
      'time management', 'organization', 'detail oriented', 'multitasking', 'teamwork',
      'collaboration', 'interpersonal skills', 'verbal communication', 'written communication'
    ];
    
    commonTerms.forEach(term => {
      if (descriptionLower.includes(term)) {
        phrases.push(term);
      }
    });
    
    // Combine single words and phrases, prioritizing by frequency
    const allKeywords = [
      ...Object.entries(wordFrequency)
        .filter(([_, count]) => count >= 2) // Only include words that appear at least twice
        .map(([word]) => word),
      ...phrases
    ];
    
    // Remove duplicates and limit to top keywords
    const uniqueKeywords = Array.from(new Set(allKeywords)).slice(0, 20);
    
    setJobKeywords(uniqueKeywords);
    checkKeywordMatches(resumeData, uniqueKeywords);
    setIsAnalyzing(false);
  };

  const checkKeywordMatches = (data: ResumeData, keywords: string[]) => {
    // Convert resume to searchable text
    const resumeText = getResumeFullText(data).toLowerCase();
    
    // Find matched and missing keywords
    const matched: string[] = [];
    const missing: string[] = [];
    
    keywords.forEach(keyword => {
      if (resumeText.includes(keyword.toLowerCase())) {
        matched.push(keyword);
      } else {
        missing.push(keyword);
      }
    });
    
    setMatchedKeywords(matched);
    setMissingKeywords(missing);
  };

  const getResumeFullText = (data: ResumeData): string => {
    if (!data) return '';
    
    const sections: string[] = [];
    
    // Personal info
    if (data.personal) {
      const firstName = data.personal.firstName || '';
      const lastName = data.personal.lastName || '';
      const jobTitle = data.personal.jobTitle || '';
      sections.push(`${firstName} ${lastName} ${jobTitle}`);
    }
    
    // Professional summary
    if (data.professionalSummary) {
      sections.push(data.professionalSummary);
    }
    
    // Experience
    if (Array.isArray(data.experience)) {
      data.experience.forEach(exp => {
        if (exp) {
          const jobTitle = exp.jobTitle || '';
          const employer = exp.employer || '';
          const description = exp.description || '';
          sections.push(`${jobTitle} ${employer} ${description}`);
        }
      });
    }
    
    // Education
    if (Array.isArray(data.education)) {
      data.education.forEach(edu => {
        if (edu) {
          const degree = edu.degree || '';
          const school = edu.school || '';
          const description = edu.description || '';
          sections.push(`${degree} ${school} ${description}`);
        }
      });
    }
    
    // Skills
    if (Array.isArray(data.skills)) {
      data.skills.forEach(skill => {
        if (skill && skill.name) {
          sections.push(skill.name);
        }
      });
    }
    
    return sections.join(' ');
  };

  const checkATSCompatibility = (data: ResumeData) => {
    if (!data) return;
    
    const issues: ATSIssue[] = [];
    
    // Check for file format issues (not applicable in this web app, but good to mention)
    issues.push({
      id: 'file-format',
      type: 'success',
      message: 'Your resume is in a web-based format that can be exported as PDF or DOCX, which is ATS-friendly.',
    });
    
    // Check for complex formatting
    if (data.personal && data.personal.photo) {
      issues.push({
        id: 'has-photo',
        type: 'warning',
        message: 'Your resume contains a photo, which may cause issues with some ATS systems.',
        suggestion: 'Consider removing the photo for ATS submissions, or have a version without it.',
      });
    }
    
    // Check for contact information
    if (!data.personal || !data.personal.email || !data.personal.phone) {
      issues.push({
        id: 'missing-contact',
        type: 'error',
        message: 'Missing essential contact information (email or phone).',
        suggestion: 'Ensure both email and phone number are included and properly formatted.',
      });
    }
    
    // Check for job title
    if (!data.personal || !data.personal.jobTitle) {
      issues.push({
        id: 'missing-job-title',
        type: 'warning',
        message: 'No job title specified.',
        suggestion: 'Include a clear job title that matches the position you\'re applying for.',
      });
    }
    
    // Check for professional summary
    if (!data.professionalSummary || data.professionalSummary.length < 50) {
      issues.push({
        id: 'weak-summary',
        type: 'warning',
        message: 'Professional summary is missing or too brief.',
        suggestion: 'Include a strong summary with relevant keywords for the position.',
      });
    }
    
    // Check for experience descriptions
    if (Array.isArray(data.experience)) {
      const weakDescriptions = data.experience.filter(exp => 
        exp && (!exp.description || exp.description.length < 50)
      );
      if (weakDescriptions.length > 0) {
        issues.push({
          id: 'weak-experience',
          type: 'warning',
          message: `${weakDescriptions.length} job experience(s) have brief descriptions.`,
          suggestion: 'Expand job descriptions with relevant achievements and responsibilities using keywords.',
        });
      }
    } else {
      issues.push({
        id: 'missing-experience',
        type: 'warning',
        message: 'Work experience section is missing.',
        suggestion: 'Add your relevant work history with detailed descriptions.',
      });
    }
    
    // Check for skills
    if (!Array.isArray(data.skills) || data.skills.length < 5) {
      issues.push({
        id: 'few-skills',
        type: 'warning',
        message: 'Few skills listed or skills section is missing.',
        suggestion: 'Include more relevant skills, especially those mentioned in job descriptions.',
      });
    }
    
    setAtsIssues(issues);
  };

  const addManualKeyword = () => {
    if (manualKeyword.trim() && !manualKeywords.includes(manualKeyword.trim().toLowerCase())) {
      const newKeyword = manualKeyword.trim().toLowerCase();
      const updatedManualKeywords = [...manualKeywords, newKeyword];
      setManualKeywords(updatedManualKeywords);
      
      // Check if this keyword is in the resume
      const resumeText = getResumeFullText(resumeData).toLowerCase();
      if (resumeText.includes(newKeyword)) {
        setMatchedKeywords([...matchedKeywords, newKeyword]);
      } else {
        setMissingKeywords([...missingKeywords, newKeyword]);
      }
      
      setManualKeyword('');
    }
  };

  const getIssueIcon = (type: string) => {
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

  const getKeywordMatchRate = () => {
    const totalKeywords = [...jobKeywords, ...manualKeywords].length;
    if (totalKeywords === 0) return 0;
    return Math.round((matchedKeywords.length / totalKeywords) * 100);
  };

  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setJobDescInput(newValue);
    if (onJobDescriptionChange) {
      onJobDescriptionChange(newValue);
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <div className="flex items-center mb-6">
        <FaRobot className="text-blue-500 text-2xl mr-3" />
        <h2 className="text-xl font-semibold text-gray-800">ATS Optimization</h2>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">ATS Compatibility Check</h3>
        <div className="space-y-3 mb-4">
          {atsIssues.map(issue => (
            <div key={issue.id} className="flex items-start p-3 bg-gray-50 rounded-md">
              <span className="mt-0.5 mr-3">{getIssueIcon(issue.type)}</span>
              <div>
                <p className="text-gray-800">{issue.message}</p>
                {issue.suggestion && (
                  <p className="text-gray-600 text-sm mt-1">{issue.suggestion}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-6 mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Keyword Optimization</h3>
        
        <div className="mb-4">
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Paste Job Description
          </label>
          <div className="flex">
            <textarea
              id="jobDescription"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Paste the job description here to extract relevant keywords..."
              value={jobDescInput}
              onChange={handleJobDescriptionChange}
            />
          </div>
          <div className="mt-2 flex justify-between">
            <button
              type="button"
              onClick={() => analyzeJobDescription(jobDescInput)}
              disabled={isAnalyzing || !jobDescInput.trim()}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Keywords'}
            </button>
            
            <button
              type="button"
              onClick={() => setShowKeywordInput(!showKeywordInput)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {showKeywordInput ? 'Hide' : 'Add Custom Keywords'}
            </button>
          </div>
        </div>
        
        {showKeywordInput && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <label htmlFor="manualKeyword" className="block text-sm font-medium text-gray-700 mb-1">
              Add Custom Keyword
            </label>
            <div className="flex">
              <input
                type="text"
                id="manualKeyword"
                className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter a keyword..."
                value={manualKeyword}
                onChange={(e) => setManualKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addManualKeyword()}
              />
              <button
                type="button"
                onClick={addManualKeyword}
                disabled={!manualKeyword.trim()}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {manualKeywords.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Custom keywords:</p>
                <div className="flex flex-wrap gap-1">
                  {manualKeywords.map((keyword, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {(jobKeywords.length > 0 || manualKeywords.length > 0) && (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-md font-medium text-gray-700">Keyword Match Rate</h4>
                <span className={`text-lg font-bold ${
                  getKeywordMatchRate() >= 70 ? 'text-green-600' : 
                  getKeywordMatchRate() >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {getKeywordMatchRate()}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className={`h-2.5 rounded-full ${
                    getKeywordMatchRate() >= 70 ? 'bg-green-600' : 
                    getKeywordMatchRate() >= 50 ? 'bg-yellow-500' : 'bg-red-600'
                  }`} 
                  style={{ width: `${getKeywordMatchRate()}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {getKeywordMatchRate() >= 70 ? 'Great keyword match! Your resume is well-optimized for this job.' : 
                 getKeywordMatchRate() >= 50 ? 'Good keyword match. Consider adding more relevant keywords.' : 
                 'Low keyword match. Try to incorporate more job-specific keywords.'}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2 flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Matched Keywords ({matchedKeywords.length})
                </h4>
                {matchedKeywords.length > 0 ? (
                  <div className="bg-green-50 border border-green-100 rounded-md p-3">
                    <div className="flex flex-wrap gap-1">
                      {matchedKeywords.map((keyword, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No keywords matched yet.</p>
                )}
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-2 flex items-center">
                  <FaTimesCircle className="text-red-500 mr-2" />
                  Missing Keywords ({missingKeywords.length})
                </h4>
                {missingKeywords.length > 0 ? (
                  <div className="bg-red-50 border border-red-100 rounded-md p-3">
                    <div className="flex flex-wrap gap-1">
                      {missingKeywords.map((keyword, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          {keyword}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Consider adding these keywords to your resume where relevant.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No missing keywords!</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="border-t pt-4">
        <h3 className="text-md font-medium text-gray-700 mb-2">ATS Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            Use a clean, simple format with standard section headings (Experience, Education, Skills).
          </li>
          <li className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            Avoid tables, headers/footers, images, and complex formatting that ATS may not parse correctly.
          </li>
          <li className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            Include keywords from the job description in your resume, especially in your skills and experience sections.
          </li>
          <li className="flex items-start">
            <FaInfoCircle className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            Spell out acronyms at least once, as some ATS systems may search for both forms.
          </li>
        </ul>
      </div>
    </div>
  );
} 