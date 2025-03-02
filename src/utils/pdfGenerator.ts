import { pdf, Document } from '@react-pdf/renderer';
import { ResumeDocument } from '../components/ResumeDocument';
import { ResumeData } from '../types/resume';
import { ColorTheme } from '../components/ResumePreviewer';
import { saveAs } from 'file-saver';
import React from 'react';

/**
 * Generates a PDF from resume data
 * @param resumeData The resume data to generate PDF from
 * @param templateId The template ID to use for the PDF
 * @param colorTheme The color theme to use for the PDF
 */
export const generateResumePDF = async (
  resumeData: ResumeData,
  templateId: string,
  colorTheme: ColorTheme
): Promise<Blob> => {
  try {
    // Use the ResumeDocument component directly
    const element = React.createElement(ResumeDocument, {
      resumeData,
      templateId,
      colorTheme
    });
    
    // Generate the PDF blob
    const blob = await pdf(element).toBlob();
    return blob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

/**
 * Generates and downloads a PDF from resume data
 * @param resumeData The resume data to generate PDF from
 * @param templateId The template ID to use for the PDF
 * @param colorTheme The color theme to use for the PDF
 * @param fileName The name of the file to download (without extension)
 */
export const downloadResumePDF = async (
  resumeData: ResumeData,
  templateId: string,
  colorTheme: ColorTheme,
  fileName: string = 'resume'
): Promise<void> => {
  try {
    const blob = await generateResumePDF(resumeData, templateId, colorTheme);
    
    // Download the PDF
    saveAs(blob, `${fileName}.pdf`);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF');
  }
}; 