import { useFieldArray, useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaGraduationCap, FaTrash } from 'react-icons/fa'

export function EducationSection() {
  const { register, control, formState: { errors } } = useFormContext<ResumeData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  })

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <FaGraduationCap className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Education
            </h3>
            <p className="text-sm text-gray-500">
              Add your educational background, starting with the most recent degree
            </p>
          </div>
        </div>
      </div>

      {/* Education Items */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="group relative bg-white rounded-lg border border-gray-200 p-6 transition-all duration-200 hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => remove(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                <input
                  type="text"
                  {...register(`education.${index}.school`)}
                  placeholder="e.g. Stanford University"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  {...register(`education.${index}.degree`)}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  {...register(`education.${index}.city`)}
                  placeholder="e.g. Stanford"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  {...register(`education.${index}.country`)}
                  placeholder="e.g. United States"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  {...register(`education.${index}.startDate`)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  {...register(`education.${index}.endDate`)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  disabled={field.current}
                />
                <div className="mt-2">
                  <label className="inline-flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      {...register(`education.${index}.current`)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 mr-2"
                    />
                    I am currently studying here
                  </label>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register(`education.${index}.description`)}
                  rows={4}
                  placeholder="Describe your academic achievements, relevant coursework, or extracurricular activities..."
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Education Button */}
      <button
        type="button"
        onClick={() => append({
          school: '',
          degree: '',
          city: '',
          country: '',
          startDate: '',
          endDate: '',
          current: false,
          description: ''
        })}
        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <FaGraduationCap className="w-4 h-4 mr-2" />
        Add Education
      </button>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="text-center py-6">
          <div className="text-gray-400 mb-2">
            <FaGraduationCap className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">
            No education added yet. Click the button above to add your educational background.
          </p>
        </div>
      )}
    </div>
  )
} 