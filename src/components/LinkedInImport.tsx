import React from 'react';
import { FaLinkedin, FaTimes } from 'react-icons/fa';
import { ResumeData } from '../types/resume';

interface LinkedInImportProps {
  onImportComplete: (data: Partial<ResumeData>) => void;
}

export function LinkedInImport({ onImportComplete }: LinkedInImportProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Import from LinkedIn</h3>
        <p className="text-sm text-gray-500 mb-6">
          LinkedIn integration is currently unavailable
        </p>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FaLinkedin className="text-gray-400" size={20} />
          </div>
          <p className="text-gray-600 font-medium">LinkedIn API integration is disabled</p>
          <p className="mt-2 text-sm text-gray-500">
            LinkedIn integration requires an API key and is currently disabled in this application.
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Please enter your resume information manually.
          </p>
        </div>
        
        <div className="mt-6 text-xs text-gray-500">
          <p>To enable LinkedIn integration, you would need to:</p>
          <ol className="mt-1 text-left list-decimal pl-5">
            <li>Register an application with LinkedIn Developer Platform</li>
            <li>Obtain API credentials</li>
            <li>Configure the OAuth flow</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 