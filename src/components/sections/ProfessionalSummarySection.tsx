import { useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaEdit, FaInfoCircle } from 'react-icons/fa'

export function ProfessionalSummarySection() {
  const { register, formState: { errors } } = useFormContext<ResumeData>()

  // Common styling classes
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"
  const textareaClass = "w-full rounded-lg border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 placeholder:text-gray-400 text-gray-700 resize-none"
  const inputGroupClass = "relative"
  const iconClass = "absolute left-3 top-3.5 text-gray-400 z-10"
  const textareaWithIconClass = "w-full rounded-lg border-gray-300 bg-white pl-10 pr-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 placeholder:text-gray-400 text-gray-700 resize-none"
  const errorClass = "mt-1.5 text-sm text-red-600"

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <FaEdit className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Professional Summary
            </h3>
            <p className="text-sm text-gray-500">
              Write a short, compelling summary of your skills and experience
            </p>
          </div>
        </div>
      </div>

      {/* Summary Input */}
      <div>
        <label className={labelClass}>
          Professional Summary
        </label>
        <div className={inputGroupClass}>
          <FaEdit className={iconClass} />
          <textarea
            {...register('professionalSummary')}
            rows={6}
            placeholder="Example: Dedicated and efficient full stack developer with 8+ years experience in application layers, presentation layers, and databases. Certified in both F/E and B/E technologies. Spearheaded successful transition from MEAN stack to MERN stack. Decreased load times by 30% and increased user satisfaction by 40%."
            className={textareaWithIconClass}
          />
        </div>
        {errors.professionalSummary && (
          <p className={errorClass}>{errors.professionalSummary.message}</p>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="text-blue-500 mt-0.5">
            <FaInfoCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">Tips for a great summary</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
              <li>Keep it concise (3-5 sentences)</li>
              <li>Highlight your most relevant skills and achievements</li>
              <li>Tailor it to the job you're applying for</li>
              <li>Use keywords from the job description</li>
              <li>Quantify your achievements with numbers when possible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 