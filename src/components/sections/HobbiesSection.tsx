import { useFieldArray, useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaHeart, FaTrash, FaPlus, FaLightbulb } from 'react-icons/fa'

export function HobbiesSection() {
  const { register, control, formState: { errors }, setValue, getValues } = useFormContext<ResumeData>()
  
  // Initialize customSections if it doesn't exist
  const customSections = getValues('customSections') || []
  
  // Find or create the hobbies section
  let hobbiesSectionIndex = customSections.findIndex(section => section.title === 'Hobbies & Interests')
  
  if (hobbiesSectionIndex === -1) {
    // Create the section if it doesn't exist
    setValue('customSections', [
      ...customSections,
      { title: 'Hobbies & Interests', items: [] }
    ])
    hobbiesSectionIndex = customSections.length
  }
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: `customSections.${hobbiesSectionIndex}.items` as const,
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
            <FaHeart className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Hobbies & Interests
            </h3>
            <p className="text-sm text-gray-500">
              Add your personal interests and activities
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
            <h4 className="text-sm font-medium text-amber-800 mb-1">Tips for adding hobbies</h4>
            <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
              <li>Include hobbies that demonstrate valuable skills or qualities</li>
              <li>Be specific rather than generic (e.g., "Mountain biking" instead of just "Sports")</li>
              <li>Consider including hobbies that show teamwork, leadership, or creativity</li>
              <li>Only include genuine interests that you can discuss comfortably</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hobbies List */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="group relative bg-white rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:shadow-md flex items-center"
          >
            <button
              type="button"
              onClick={() => {
                try {
                  remove(index);
                } catch (error) {
                  console.error('Error removing hobby:', error);
                }
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
            
            <div className="flex-grow">
              <div className={inputGroupClass}>
                <FaHeart className={iconClass} />
                <input
                  type="text"
                  {...register(`customSections.${hobbiesSectionIndex}.items.${index}.title` as const)}
                  placeholder="e.g. Photography, Chess, Hiking"
                  className={inputWithIconClass}
                />
              </div>
              {errors.customSections?.[hobbiesSectionIndex]?.items?.[index]?.title && (
                <p className={errorClass}>{errors.customSections?.[hobbiesSectionIndex]?.items?.[index]?.title?.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Hobby Button */}
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
            console.error('Error adding hobby:', error);
          }
        }}
        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <FaPlus className="w-4 h-4 mr-2" />
        Add Hobby
      </button>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-3">
            <FaHeart className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">
            No hobbies added yet. Click the button above to add your first hobby.
          </p>
        </div>
      )}
    </div>
  )
} 