import { FaChartLine, FaLightbulb, FaRobot, FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useResumeContext } from './ResumeContext';

export function ResumeScore() {
  const { 
    resumeScore, 
    improvementSuggestions, 
    feedbackExpanded, 
    setFeedbackExpanded,
    setFeedbackTab,
    setActiveSection
  } = useResumeContext();

  return (
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
  );
} 