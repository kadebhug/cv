import { useFieldArray, useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaTrophy, FaTrash, FaCalendarAlt, FaLightbulb } from 'react-icons/fa'

export function AchievementsSection() {
  const { register, control, formState: { errors }, setValue, getValues } = useFormContext<ResumeData>()
  
  // Initialize customSections if it doesn't exist
  const customSections = getValues('customSections') || []
  
  // Find or create the achievements section
  let achievementsSectionIndex = customSections.findIndex(section => section.title === 'Achievements & Awards')
  
  if (achievementsSectionIndex === -1) {
    // Create the section if it doesn't exist
    setValue('customSections', [
      ...customSections,
      { title: 'Achievements & Awards', items: [] }
    ])
    achievementsSectionIndex = customSections.length
  }
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: `customSections.${achievementsSectionIndex}.items` as const,
  })

  // Common styling classes
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"
  const inputClass = "w-full rounded-lg border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 placeholder:text-gray-400 text-gray-700"
  const inputGroupClass = "relative"
  const iconClass = "absolute left-3 top-3.5 text-gray-400 z-10"
  const inputWithIconClass = "w-full rounded-lg border-gray-300 bg-white pl-10 pr-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 placeholder:text-gray-400 text-gray-700"
  const errorClass = "mt-1.5 text-sm text-red-600"

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <FaTrophy className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Achievements & Awards
            </h3>
            <p className="text-sm text-gray-500">
              Add your notable achievements, awards, and recognitions
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
            <h4 className="text-sm font-medium text-amber-800 mb-1">Tips for adding achievements</h4>
            <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
              <li>Include awards, honors, and recognitions that highlight your excellence</li>
              <li>Mention significant accomplishments that demonstrate your capabilities</li>
              <li>Quantify your achievements with numbers when possible</li>
              <li>Include the organization or entity that granted the award</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Achievement Items */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="group relative bg-white rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => {
                try {
                  remove(index);
                } catch (error) {
                  console.error('Error removing achievement:', error);
                }
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Title</label>
                <div className={inputGroupClass}>
                  <FaTrophy className={iconClass} />
                  <input
                    type="text"
                    {...register(`customSections.${achievementsSectionIndex}.items.${index}.title` as const)}
                    placeholder="e.g. Employee of the Year"
                    className={inputWithIconClass}
                  />
                </div>
                {errors.customSections?.[achievementsSectionIndex]?.items?.[index]?.title && (
                  <p className={errorClass}>{errors.customSections?.[achievementsSectionIndex]?.items?.[index]?.title?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Issuer/Organization</label>
                <div className={inputGroupClass}>
                  <input
                    type="text"
                    {...register(`customSections.${achievementsSectionIndex}.items.${index}.subtitle` as const)}
                    placeholder="e.g. ABC Corporation"
                    className={inputClass}
                  />
                </div>
                {errors.customSections?.[achievementsSectionIndex]?.items?.[index]?.subtitle && (
                  <p className={errorClass}>{errors.customSections?.[achievementsSectionIndex]?.items?.[index]?.subtitle?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Date</label>
                <div className={inputGroupClass}>
                  <FaCalendarAlt className={iconClass} />
                  <input
                    type="text"
                    {...register(`customSections.${achievementsSectionIndex}.items.${index}.date` as const)}
                    placeholder="e.g. May 2023"
                    className={inputWithIconClass}
                  />
                </div>
                {errors.customSections?.[achievementsSectionIndex]?.items?.[index]?.date && (
                  <p className={errorClass}>{errors.customSections?.[achievementsSectionIndex]?.items?.[index]?.date?.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Description (Optional)</label>
                <textarea
                  {...register(`customSections.${achievementsSectionIndex}.items.${index}.description` as const)}
                  placeholder="Describe the achievement, its significance, and any relevant details"
                  className={inputClass}
                  rows={3}
                />
                {errors.customSections?.[achievementsSectionIndex]?.items?.[index]?.description && (
                  <p className={errorClass}>{errors.customSections?.[achievementsSectionIndex]?.items?.[index]?.description?.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Achievement Button */}
      <button
        type="button"
        onClick={() => {
          try {
            append({
              title: '',
              subtitle: '',
              date: '',
              description: ''
            });
          } catch (error) {
            console.error('Error adding achievement:', error);
          }
        }}
        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <FaTrophy className="w-4 h-4 mr-2" />
        Add Achievement
      </button>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-3">
            <FaTrophy className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">
            No achievements added yet. Click the button above to add your first achievement.
          </p>
        </div>
      )}
    </div>
  )
} 