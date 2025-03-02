import React from 'react';
import { ResumeData } from '../types/resume';

export interface ColorTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export const DEFAULT_THEMES: Record<string, ColorTheme> = {
  blue: {
    primary: '#2563eb',
    secondary: '#dbeafe',
    background: '#ffffff',
    text: '#1e293b',
  },
  green: {
    primary: '#059669',
    secondary: '#d1fae5',
    background: '#ffffff',
    text: '#1e293b',
  },
  purple: {
    primary: '#7c3aed',
    secondary: '#ede9fe',
    background: '#ffffff',
    text: '#1e293b',
  },
  red: {
    primary: '#dc2626',
    secondary: '#fee2e2',
    background: '#ffffff',
    text: '#1e293b',
  },
  gray: {
    primary: '#4b5563',
    secondary: '#f3f4f6',
    background: '#ffffff',
    text: '#1e293b',
  },
};

interface ResumePreviewerProps {
  resumeData: ResumeData;
  templateId: string;
  colorTheme: ColorTheme;
}

export const ResumePreviewer: React.FC<ResumePreviewerProps> = ({
  resumeData,
  templateId,
  colorTheme,
}) => {
  // Check if resumeData is undefined or null
  if (!resumeData) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
        <div className="p-8 border border-gray-200 rounded-md flex items-center justify-center">
          <p className="text-gray-500">No resume data available. Please fill out the form to see a preview.</p>
        </div>
      </div>
    );
  }

  // Render different templates based on templateId
  const renderTemplate = () => {
    switch (templateId) {
      case 'modern':
        return renderModernTemplate();
      case 'professional':
        return renderProfessionalTemplate();
      case 'creative':
        return renderCreativeTemplate();
      case 'minimalist':
        return renderMinimalistTemplate();
      default:
        return renderModernTemplate(); // Default to modern template
    }
  };

  // Modern template layout
  const renderModernTemplate = () => (
    <div 
      className="p-8 border border-gray-200 rounded-md" 
      style={{ 
        backgroundColor: colorTheme.background,
        color: colorTheme.text,
      }}
    >
      {/* Header */}
      <div className="mb-6 pb-4" style={{ borderBottom: `2px solid ${colorTheme.primary}` }}>
        <h1 className="text-3xl font-bold mb-1" style={{ color: colorTheme.primary }}>
          {resumeData?.personal?.firstName || ''} {resumeData?.personal?.lastName || ''}
        </h1>
        {resumeData?.personal?.jobTitle && (
          <p className="text-lg text-gray-600 mb-2">{resumeData.personal.jobTitle}</p>
        )}
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          {resumeData?.personal?.email && <span>{resumeData.personal.email}</span>}
          {resumeData?.personal?.phone && <span>{resumeData.personal.phone}</span>}
          {resumeData?.personal?.city && resumeData?.personal?.country && (
            <span>{resumeData.personal.city}, {resumeData.personal.country}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {resumeData?.professionalSummary && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2" style={{ color: colorTheme.primary }}>Summary</h2>
          <p className="text-sm text-gray-600">{resumeData.professionalSummary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData?.experience && resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3" style={{ color: colorTheme.primary }}>Experience</h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="pb-3 border-b border-gray-100 last:border-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-md font-medium">{exp.jobTitle}</h3>
                  <span className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{exp.employer}, {exp.city}</p>
                <p className="text-sm text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData?.education && resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3" style={{ color: colorTheme.primary }}>Education</h2>
          <div className="space-y-4">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="pb-3 border-b border-gray-100 last:border-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-md font-medium">{edu.degree}</h3>
                  <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate || 'Present'}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{edu.school}, {edu.city}</p>
                {edu.description && <p className="text-sm text-gray-600">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resumeData?.skills && resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3" style={{ color: colorTheme.primary }}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-3 py-1 text-xs rounded-full" 
                style={{ 
                  backgroundColor: colorTheme.secondary,
                  color: colorTheme.primary 
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resumeData?.certifications && resumeData.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2" style={{ color: colorTheme.primary }}>
            Certifications
          </h2>
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              <h3 className="text-md font-medium">{cert.name}</h3>
              <p className="text-sm text-gray-600">{cert.issuer}</p>
              {cert.date && <p className="text-xs text-gray-500">{cert.date}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Hobbies */}
      {resumeData?.hobbies && resumeData.hobbies.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2" style={{ color: colorTheme.primary }}>
            Hobbies
          </h2>
          <p className="text-sm">{resumeData.hobbies.join(', ')}</p>
        </div>
      )}
    </div>
  );

  // Professional template layout
  const renderProfessionalTemplate = () => (
    <div 
      className="p-8 border border-gray-200 rounded-md" 
      style={{ 
        backgroundColor: colorTheme.background,
        color: colorTheme.text,
      }}
    >
      {/* Header - Professional style */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold uppercase mb-1" style={{ color: colorTheme.primary }}>
          {resumeData?.personal?.firstName || ''} {resumeData?.personal?.lastName || ''}
        </h1>
        {resumeData?.personal?.jobTitle && (
          <p className="text-lg mb-2">{resumeData.personal.jobTitle}</p>
        )}
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-500 mt-2">
          {resumeData?.personal?.email && <span>{resumeData.personal.email}</span>}
          {resumeData?.personal?.phone && <span>{resumeData.personal.phone}</span>}
          {resumeData?.personal?.city && resumeData?.personal?.country && (
            <span>{resumeData.personal.city}, {resumeData.personal.country}</span>
          )}
        </div>
        <div className="w-24 h-1 mx-auto mt-4" style={{ backgroundColor: colorTheme.primary }}></div>
      </div>

      {/* Two column layout for professional template */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column */}
        <div className="w-full md:w-2/3">
          {/* Summary */}
          {resumeData?.professionalSummary && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 uppercase" style={{ color: colorTheme.primary }}>
                Professional Summary
              </h2>
              <p className="text-sm text-gray-600">{resumeData.professionalSummary}</p>
            </div>
          )}

          {/* Experience */}
          {resumeData?.experience && resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 uppercase" style={{ color: colorTheme.primary }}>
                Professional Experience
              </h2>
              <div className="space-y-4">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="pb-3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-md font-bold">{exp.jobTitle}</h3>
                      <span className="text-xs font-medium" style={{ color: colorTheme.primary }}>
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-1">{exp.employer}, {exp.city}</p>
                    <p className="text-sm text-gray-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="w-full md:w-1/3">
          {/* Education */}
          {resumeData?.education && resumeData.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 uppercase" style={{ color: colorTheme.primary }}>
                Education
              </h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="pb-3">
                    <h3 className="text-md font-bold">{edu.degree}</h3>
                    <p className="text-sm font-medium">{edu.school}, {edu.city}</p>
                    <p className="text-xs mb-1" style={{ color: colorTheme.primary }}>
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </p>
                    {edu.description && <p className="text-sm text-gray-600">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {resumeData?.skills && resumeData.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 uppercase" style={{ color: colorTheme.primary }}>
                Skills
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                {resumeData.skills.map((skill, index) => (
                  <li key={index} className="text-sm">
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications */}
          {resumeData?.certifications && resumeData.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 uppercase" style={{ color: colorTheme.primary }}>
                Certifications
              </h2>
              <ul className="space-y-2">
                {resumeData.certifications.map((cert, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">{cert.name}</span>
                    <div className="text-xs text-gray-600">{cert.issuer}, {cert.date}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Creative template layout
  const renderCreativeTemplate = () => (
    <div 
      className="p-8 border border-gray-200 rounded-md" 
      style={{ 
        backgroundColor: colorTheme.background,
        color: colorTheme.text,
      }}
    >
      {/* Header with accent background */}
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: colorTheme.secondary }}>
        <h1 className="text-4xl font-bold mb-2" style={{ color: colorTheme.primary }}>
          {resumeData?.personal?.firstName || ''} {resumeData?.personal?.lastName || ''}
        </h1>
        {resumeData?.personal?.jobTitle && (
          <p className="text-xl mb-4" style={{ color: colorTheme.primary }}>
            {resumeData.personal.jobTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-4 text-sm">
          {resumeData?.personal?.email && (
            <span className="flex items-center">
              <span className="mr-1">✉</span> {resumeData.personal.email}
            </span>
          )}
          {resumeData?.personal?.phone && (
            <span className="flex items-center">
              <span className="mr-1">☎</span> {resumeData.personal.phone}
            </span>
          )}
          {resumeData?.personal?.city && resumeData?.personal?.country && (
            <span className="flex items-center">
              <span className="mr-1">📍</span> {resumeData.personal.city}, {resumeData.personal.country}
            </span>
          )}
        </div>
      </div>

      {/* Summary with accent border */}
      {resumeData?.professionalSummary && (
        <div className="mb-8 pl-4" style={{ borderLeft: `4px solid ${colorTheme.primary}` }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: colorTheme.primary }}>About Me</h2>
          <p className="text-sm">{resumeData.professionalSummary}</p>
        </div>
      )}

      {/* Experience with timeline style */}
      {resumeData?.experience && resumeData.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: colorTheme.primary }}>Work Experience</h2>
          <div className="space-y-6">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="relative pl-8">
                {/* Timeline dot */}
                <div 
                  className="absolute left-0 top-0 w-4 h-4 rounded-full" 
                  style={{ backgroundColor: colorTheme.primary }}
                ></div>
                {/* Timeline line */}
                {index < (resumeData.experience?.length || 0) - 1 && (
                  <div 
                    className="absolute left-2 top-4 w-0.5 h-full" 
                    style={{ backgroundColor: colorTheme.secondary }}
                  ></div>
                )}
                <div>
                  <h3 className="text-lg font-bold">{exp.jobTitle}</h3>
                  <p className="text-sm font-medium mb-1">
                    {exp.employer}, {exp.city}
                  </p>
                  <p className="text-xs mb-2" style={{ color: colorTheme.primary }}>
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                  <p className="text-sm">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills with creative display */}
      {resumeData?.skills && resumeData.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4" style={{ color: colorTheme.primary }}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-4 py-2 text-sm rounded-lg" 
                style={{ 
                  backgroundColor: colorTheme.secondary,
                  color: colorTheme.primary,
                  border: `1px solid ${colorTheme.primary}`
                }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education with cards */}
      {resumeData?.education && resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4" style={{ color: colorTheme.primary }}>Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumeData.education.map((edu, index) => (
              <div 
                key={index} 
                className="p-4 rounded-lg" 
                style={{ backgroundColor: colorTheme.secondary, border: `1px solid ${colorTheme.primary}` }}
              >
                <h3 className="text-md font-bold" style={{ color: colorTheme.primary }}>{edu.degree}</h3>
                <p className="text-sm font-medium">{edu.school}, {edu.city}</p>
                <p className="text-xs mb-1">
                  {edu.startDate} - {edu.endDate || 'Present'}
                </p>
                {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Minimalist template layout
  const renderMinimalistTemplate = () => (
    <div 
      className="p-8 border border-gray-200 rounded-md" 
      style={{ 
        backgroundColor: colorTheme.background,
        color: colorTheme.text,
      }}
    >
      {/* Simple header */}
      <div className="mb-8">
        <h1 className="text-2xl font-normal mb-1">
          {resumeData?.personal?.firstName || ''} {resumeData?.personal?.lastName || ''}
        </h1>
        {resumeData?.personal?.jobTitle && (
          <p className="text-md text-gray-600 mb-2">{resumeData.personal.jobTitle}</p>
        )}
        <div className="text-sm text-gray-500 space-y-1">
          {resumeData?.personal?.email && <div>{resumeData.personal.email}</div>}
          {resumeData?.personal?.phone && <div>{resumeData.personal.phone}</div>}
          {resumeData?.personal?.city && resumeData?.personal?.country && (
            <div>{resumeData.personal.city}, {resumeData.personal.country}</div>
          )}
        </div>
      </div>

      {/* Clean divider */}
      <div className="w-full h-px bg-gray-200 mb-6"></div>

      {/* Summary */}
      {resumeData?.professionalSummary && (
        <div className="mb-6">
          <h2 className="text-md font-medium mb-2 uppercase tracking-wider">Profile</h2>
          <p className="text-sm text-gray-600">{resumeData.professionalSummary}</p>
        </div>
      )}

      {/* Experience */}
      {resumeData?.experience && resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-md font-medium mb-3 uppercase tracking-wider">Experience</h2>
          <div className="space-y-4">
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="pb-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium">{exp.jobTitle} | {exp.employer}</h3>
                  <span className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || 'Present'}</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{exp.city}</p>
                <p className="text-xs text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resumeData?.education && resumeData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-md font-medium mb-3 uppercase tracking-wider">Education</h2>
          <div className="space-y-3">
            {resumeData.education.map((edu, index) => (
              <div key={index} className="pb-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium">{edu.degree} | {edu.school}</h3>
                  <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate || 'Present'}</span>
                </div>
                <p className="text-xs text-gray-600">{edu.city}</p>
                {edu.description && <p className="text-xs text-gray-600 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills as simple comma-separated list */}
      {resumeData?.skills && resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-md font-medium mb-2 uppercase tracking-wider">Skills</h2>
          <p className="text-sm text-gray-600">
            {resumeData.skills.map(skill => skill.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      {/* Template indicator */}
      <div className="mb-4 flex justify-between items-center">
        <div className="px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-700 inline-flex items-center">
          <span className="mr-1">Template:</span>
          <span className="font-medium capitalize">{templateId}</span>
        </div>
      </div>
      
      {/* Render the selected template */}
      {renderTemplate()}
    </div>
  );
}; 