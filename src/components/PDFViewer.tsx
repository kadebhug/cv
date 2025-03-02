import React, { useState, useEffect } from 'react';
import { PDFViewer as ReactPDFViewer } from '@react-pdf/renderer';
import { ResumeDocument } from './ResumeDocument';
import { ResumeData } from '../types/resume';
import { ColorTheme } from './ResumePreviewer';
import { PDFDownloadButton } from './PDFDownloadButton';

interface PDFViewerProps {
  resumeData: ResumeData;
  templateId: string;
  colorTheme: ColorTheme;
  fileName?: string;
  showToolbar?: boolean;
  height?: string;
  width?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  resumeData,
  templateId,
  colorTheme,
  fileName = 'resume',
  showToolbar = true,
  height = '100%',
  width = '100%',
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading time for the PDF
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [resumeData, templateId, colorTheme]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Resume Preview</h2>
        <PDFDownloadButton
          resumeData={resumeData}
          templateId={templateId}
          colorTheme={colorTheme}
          fileName={fileName}
        />
      </div>
      
      <div className="relative" style={{ height: height === '100%' ? 'calc(100vh - 200px)' : height }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-sm text-gray-600">Loading PDF preview...</p>
            </div>
          </div>
        )}
        
        {!isLoading && (
          <ReactPDFViewer
            style={{ width, height: '100%', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
            showToolbar={showToolbar}
          >
            <ResumeDocument
              resumeData={resumeData}
              templateId={templateId}
              colorTheme={colorTheme}
            />
          </ReactPDFViewer>
        )}
      </div>
    </div>
  );
}; 