import { useFieldArray, useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaGraduationCap, FaTrash, FaUniversity, FaMapMarkerAlt, FaGlobe, FaCalendarAlt, FaEdit } from 'react-icons/fa'

export function EducationSection() {
  const { register, control, formState: { errors } } = useFormContext<ResumeData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  })

  // Common styling classes
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"
  const inputClass = "w-full rounded-lg border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 placeholder:text-gray-400 text-gray-700"
  const inputGroupClass = "relative"
  const iconClass = "absolute left-3 top-3.5 text-gray-400 z-10"
  const inputWithIconClass = "w-full rounded-lg border-gray-300 bg-white pl-10 pr-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 placeholder:text-gray-400 text-gray-700"
  const textareaClass = "w-full rounded-lg border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 placeholder:text-gray-400 text-gray-700 resize-none"
  const errorClass = "mt-1.5 text-sm text-red-600"
  const checkboxClass = "rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 mr-2"

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <FaGraduationCap className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Education
            </h3>
            <p className="text-sm text-gray-500">
              Add your educational background, starting with the most recent
            </p>
          </div>
        </div>
      </div>

      {/* Education Items */}
      <div className="space-y-6">
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
                  console.error('Error removing education:', error);
                }
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>School</label>
                <div className={inputGroupClass}>
                  <FaUniversity className={iconClass} />
                  <input
                    type="text"
                    {...register(`education.${index}.school`)}
                    placeholder="e.g. University of Cape Town"
                    className={inputWithIconClass}
                  />
                </div>
                {errors.education?.[index]?.school && (
                  <p className={errorClass}>{errors.education[index]?.school?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Degree</label>
                <div className={inputGroupClass}>
                  <FaGraduationCap className={iconClass} />
                  <input
                    type="text"
                    {...register(`education.${index}.degree`)}
                    placeholder="e.g. Bachelor of Science in Computer Science"
                    className={inputWithIconClass}
                  />
                </div>
                {errors.education?.[index]?.degree && (
                  <p className={errorClass}>{errors.education[index]?.degree?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>City</label>
                <div className={inputGroupClass}>
                  <FaMapMarkerAlt className={iconClass} />
                  <input
                    type="text"
                    {...register(`education.${index}.city`)}
                    placeholder="e.g. Cape Town"
                    className={inputWithIconClass}
                  />
                </div>
                {errors.education?.[index]?.city && (
                  <p className={errorClass}>{errors.education[index]?.city?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Country</label>
                <div className={inputGroupClass}>
                  <FaGlobe className={iconClass} />
                  <input
                    type="text"
                    {...register(`education.${index}.country`)}
                    placeholder="e.g. South Africa"
                    className={inputWithIconClass}
                  />
                </div>
                {errors.education?.[index]?.country && (
                  <p className={errorClass}>{errors.education[index]?.country?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Start Date</label>
                <div className={inputGroupClass}>
                  <FaCalendarAlt className={iconClass} />
                  <input
                    type="date"
                    {...register(`education.${index}.startDate`)}
                    className={inputWithIconClass}
                  />
                </div>
                {errors.education?.[index]?.startDate && (
                  <p className={errorClass}>{errors.education[index]?.startDate?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>End Date</label>
                <div className={inputGroupClass}>
                  <FaCalendarAlt className={iconClass} />
                  <input
                    type="date"
                    {...register(`education.${index}.endDate`)}
                    className={`${inputWithIconClass} ${field.current ? 'bg-gray-100 text-gray-500' : ''}`}
                    disabled={field.current}
                  />
                </div>
                <div className="mt-2">
                  <label className="inline-flex items-center text-sm text-gray-600">
                    <input
                      type="checkbox"
                      {...register(`education.${index}.current`)}
                      className={checkboxClass}
                    />
                    I am currently studying here
                  </label>
                </div>
                {errors.education?.[index]?.endDate && !field.current && (
                  <p className={errorClass}>{errors.education[index]?.endDate?.message}</p>
                )}
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Description</label>
                <div className={inputGroupClass}>
                  <FaEdit className="absolute left-3 top-3.5 text-gray-400 z-10" />
                  <textarea
                    {...register(`education.${index}.description`)}
                    rows={4}
                    placeholder="Describe your studies, achievements, and relevant coursework..."
                    className={`${textareaClass} pl-10`}
                  />
                </div>
                {errors.education?.[index]?.description && (
                  <p className={errorClass}>{errors.education[index]?.description?.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Education Button */}
      <button
        type="button"
        onClick={() => {
          try {
            append({
              school: '',
              degree: '',
              city: '',
              country: '',
              startDate: '',
              endDate: '',
              current: false,
              description: ''
            });
          } catch (error) {
            console.error('Error adding education:', error);
          }
        }}
        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <FaGraduationCap className="w-4 h-4 mr-2" />
        Add Education
      </button>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-3">
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