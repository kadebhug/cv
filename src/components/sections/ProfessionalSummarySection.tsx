import { useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaFileAlt } from 'react-icons/fa'

export function ProfessionalSummarySection() {
  const { register } = useFormContext<ResumeData>()

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <FaFileAlt className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Professional Summary
            </h3>
            <p className="text-sm text-gray-500">
              Write a brief overview of your professional background and key achievements
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-lg">
        <textarea
          {...register('professionalSummary')}
          rows={8}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors resize-none"
          placeholder="Example: Results-driven software engineer with 5+ years of experience in developing scalable web applications. Proficient in React, Node.js, and cloud technologies. Led multiple successful projects and mentored junior developers..."
        />
        <p className="mt-2 text-sm text-gray-500">
          Tip: Keep it concise and focused on your most relevant achievements and skills
        </p>
      </div>
    </div>
  )
} 