import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ResumeDocument } from './ResumeDocument';
import { ResumeData } from '../types/resume';
import { ColorTheme } from './ResumePreviewer';
import { FaDownload } from 'react-icons/fa';
import { saveAs } from 'file-saver';

interface PDFDownloadButtonProps {
  resumeData: ResumeData;
  templateId: string;
  colorTheme: ColorTheme;
  fileName?: string;
  className?: string;
  buttonText?: string;
}

export const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  resumeData,
  templateId,
  colorTheme,
  fileName = 'resume',
  className = '',
  buttonText = 'Download PDF'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Create the PDF document
      const element = React.createElement(ResumeDocument, {
        resumeData,
        templateId,
        colorTheme
      });
      
      // Generate the PDF blob
      const blob = await pdf(element).toBlob();
      
      // Download the PDF
      saveAs(blob, `${fileName}.pdf`);
      
      setIsGenerating(false);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF');
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
    >
      {isGenerating ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating PDF...
        </span>
      ) : error ? (
        <span className="flex items-center text-white">
          <span className="mr-2">⚠️</span>
          {error}
        </span>
      ) : (
        <span className="flex items-center">
          <FaDownload className="mr-2" />
          {buttonText}
        </span>
      )}
    </button>
  );
}; 