import { useFieldArray, useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaProjectDiagram, FaTrash, FaCalendarAlt, FaLink, FaLightbulb } from 'react-icons/fa'

export function ProjectsSection() {
  const { register, control, formState: { errors }, setValue, getValues } = useFormContext<ResumeData>()
  
  // Ensure projects array exists
  if (!getValues('projects')) {
    setValue('projects', [])
  }
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
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
            <FaProjectDiagram className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Projects
            </h3>
            <p className="text-sm text-gray-500">
              Add your personal or professional projects
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
            <h4 className="text-sm font-medium text-amber-800 mb-1">Tips for adding projects</h4>
            <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
              <li>Include projects that demonstrate relevant skills for your target position</li>
              <li>Add links to live demos, repositories, or project websites when available</li>
              <li>Focus on your role, technologies used, and measurable outcomes</li>
              <li>For team projects, highlight your specific contributions</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Project Items */}
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
                  console.error('Error removing project:', error);
                }
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Project Name</label>
                <div className={inputGroupClass}>
                  <FaProjectDiagram className={iconClass} />
                  <input
                    type="text"
                    {...register(`projects.${index}.name`)}
                    placeholder="e.g. E-commerce Website"
                    className={inputWithIconClass}
                  />
                </div>
                {errors.projects?.[index]?.name && (
                  <p className={errorClass}>{errors.projects?.[index]?.name?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Project URL (Optional)</label>
                <div className={inputGroupClass}>
                  <FaLink className={iconClass} />
                  <input
                    type="text"
                    {...register(`projects.${index}.url`)}
                    placeholder="e.g. https://github.com/username/project"
                    className={inputWithIconClass}
                  />
                </div>
                {errors.projects?.[index]?.url && (
                  <p className={errorClass}>{errors.projects?.[index]?.url?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Start Date</label>
                <div className={inputGroupClass}>
                  <FaCalendarAlt className={iconClass} />
                  <input
                    type="text"
                    {...register(`projects.${index}.startDate`)}
                    placeholder="e.g. June 2022"
                    className={inputWithIconClass}
                  />
                </div>
                {errors.projects?.[index]?.startDate && (
                  <p className={errorClass}>{errors.projects?.[index]?.startDate?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>End Date</label>
                <div className="flex items-center space-x-2">
                  <div className={`${inputGroupClass} flex-grow`}>
                    <FaCalendarAlt className={iconClass} />
                    <input
                      type="text"
                      {...register(`projects.${index}.endDate`)}
                      placeholder="e.g. Present"
                      className={inputWithIconClass}
                      disabled={!!fields[index].current}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`current-project-${index}`}
                      {...register(`projects.${index}.current`)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`current-project-${index}`} className="ml-2 text-sm text-gray-600">
                      Current
                    </label>
                  </div>
                </div>
                {errors.projects?.[index]?.endDate && (
                  <p className={errorClass}>{errors.projects?.[index]?.endDate?.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea
                  {...register(`projects.${index}.description`)}
                  placeholder="Describe the project, your role, technologies used, and outcomes achieved"
                  className={inputClass}
                  rows={4}
                />
                {errors.projects?.[index]?.description && (
                  <p className={errorClass}>{errors.projects?.[index]?.description?.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Project Button */}
      <button
        type="button"
        onClick={() => {
          try {
            append({
              name: '',
              description: '',
              url: '',
              startDate: '',
              endDate: '',
              current: false
            });
          } catch (error) {
            console.error('Error adding project:', error);
          }
        }}
        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <FaProjectDiagram className="w-4 h-4 mr-2" />
        Add Project
      </button>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-3">
            <FaProjectDiagram className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">
            No projects added yet. Click the button above to add your first project.
          </p>
        </div>
      )}
    </div>
  )
} 