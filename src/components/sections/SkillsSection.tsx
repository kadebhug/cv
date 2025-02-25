import { useFieldArray, useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaTools, FaTrash } from 'react-icons/fa'

const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'] as const

export function SkillsSection() {
  const { register, control } = useFormContext<ResumeData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills'
  })

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <FaTools className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Skills
            </h3>
            <p className="text-sm text-gray-500">
              Add your technical and soft skills with proficiency levels
            </p>
          </div>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="group relative bg-white rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:shadow-md flex items-center gap-4"
          >
            <div className="flex-1">
              <input
                type="text"
                {...register(`skills.${index}.name`)}
                placeholder="e.g. React.js, Project Management, etc."
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              />
            </div>

            <select
              {...register(`skills.${index}.level`)}
              className="w-40 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
            >
              {skillLevels.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => remove(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Skill Button */}
      <button
        type="button"
        onClick={() => append({ name: '', level: 'intermediate' })}
        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <FaTools className="w-4 h-4 mr-2" />
        Add Skill
      </button>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="text-center py-6">
          <div className="text-gray-400 mb-2">
            <FaTools className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">
            No skills added yet. Click the button above to add your first skill.
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Tips for adding skills:</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Include both technical and soft skills</li>
          <li>Be specific with technical skills (e.g. "React.js" instead of just "JavaScript")</li>
          <li>Add relevant skills mentioned in job descriptions you're targeting</li>
          <li>Be honest with your proficiency levels</li>
        </ul>
      </div>
    </div>
  )
} 