import { useFieldArray, useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaTools, FaTrash, FaStar, FaLightbulb, FaInfoCircle } from 'react-icons/fa'

const skillLevels = ['beginner', 'intermediate', 'advanced', 'expert'] as const

export function SkillsSection() {
  const { register, control, formState: { errors } } = useFormContext<ResumeData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
    shouldUnregister: true
  })

  // Common styling classes
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"
  const inputClass = "w-full rounded-lg border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 placeholder:text-gray-400 text-gray-700"
  const inputGroupClass = "relative"
  const iconClass = "absolute left-3 top-3.5 text-gray-400 z-10"
  const inputWithIconClass = "w-full rounded-lg border-gray-300 bg-white pl-10 pr-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 placeholder:text-gray-400 text-gray-700"
  const selectClass = "w-full rounded-lg border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 text-gray-700"
  const errorClass = "mt-1.5 text-sm text-red-600"

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm">
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

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="text-amber-500 mt-0.5">
            <FaLightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-amber-800 mb-1">Tips for adding skills</h4>
            <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
              <li>Include both technical skills (e.g., programming languages) and soft skills (e.g., leadership)</li>
              <li>Be honest about your proficiency level</li>
              <li>Prioritize skills that are relevant to the job you're applying for</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Skills Items */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="group relative bg-white rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:shadow-md flex items-center gap-4"
          >
            <button
              type="button"
              onClick={() => {
                try {
                  remove(index);
                } catch (error) {
                  console.error('Error removing skill:', error);
                }
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
            
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Skill Name</label>
                <div className={inputGroupClass}>
                  <FaTools className={iconClass} />
                  <input
                    type="text"
                    {...register(`skills.${index}.name`)}
                    placeholder="e.g. JavaScript, Project Management, etc."
                    className={inputWithIconClass}
                  />
                </div>
                {errors.skills?.[index]?.name && (
                  <p className={errorClass}>{errors.skills[index]?.name?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Proficiency Level</label>
                <div className={inputGroupClass}>
                  <FaStar className={iconClass} />
                  <select
                    {...register(`skills.${index}.level`)}
                    className={inputWithIconClass}
                  >
                    {skillLevels.map(level => (
                      <option key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.skills?.[index]?.level && (
                  <p className={errorClass}>{errors.skills[index]?.level?.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Button */}
      <button
        type="button"
        onClick={() => {
          try {
            append({
              name: '',
              level: 'intermediate'
            });
          } catch (error) {
            console.error('Error adding skill:', error);
          }
        }}
        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <FaTools className="w-4 h-4 mr-2" />
        Add Skill
      </button>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-3">
            <FaTools className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">
            No skills added yet. Click the button above to add your first skill.
          </p>
        </div>
      )}
    </div>
  )
} 