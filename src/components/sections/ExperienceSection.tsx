import { useFieldArray, useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaBriefcase, FaTrash } from 'react-icons/fa'

export function ExperienceSection() {
  const { register, control } = useFormContext<ResumeData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience',
    shouldUnregister: true
  })

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <FaBriefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Work Experience
            </h3>
            <p className="text-sm text-gray-500">
              Add your relevant work experience, starting with the most recent position
            </p>
          </div>
        </div>
      </div>

      {/* Experience Items */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="group relative bg-white rounded-lg border border-gray-200 p-6 transition-all duration-200 hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => {
                try {
                  remove(index);
                } catch (error) {
                  console.error('Error removing experience:', error);
                }
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  {...register(`experience.${index}.jobTitle`)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                <input
                  type="text"
                  {...register(`experience.${index}.employer`)}
                  placeholder="e.g. Google"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  {...register(`experience.${index}.city`)}
                  placeholder="e.g. San Francisco"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  {...register(`experience.${index}.country`)}
                  placeholder="e.g. United States"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  {...register(`experience.${index}.startDate`)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  {...register(`experience.${index}.endDate`)}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  disabled={field.current}
                />
                <div className="mt-2">
                  <label className="inline-flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      {...register(`experience.${index}.current`)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 mr-2"
                    />
                    I currently work here
                  </label>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  {...register(`experience.${index}.description`)}
                  rows={4}
                  placeholder="Describe your responsibilities and achievements..."
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Experience Button */}
      <button
        type="button"
        onClick={() => {
          try {
            append({
              jobTitle: '',
              employer: '',
              city: '',
              country: '',
              startDate: '',
              endDate: '',
              current: false,
              description: ''
            });
          } catch (error) {
            console.error('Error adding experience:', error);
          }
        }}
        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <FaBriefcase className="w-4 h-4 mr-2" />
        Add Work Experience
      </button>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="text-center py-6">
          <div className="text-gray-400 mb-2">
            <FaBriefcase className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">
            No work experience added yet. Click the button above to add your first position.
          </p>
        </div>
      )}
    </div>
  )
} 