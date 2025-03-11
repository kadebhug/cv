import { useFieldArray, useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaCertificate, FaTrash, FaCalendarAlt, FaBuilding, FaLightbulb } from 'react-icons/fa'

export function CertificationsSection() {
  const { register, control, formState: { errors }, setValue, getValues } = useFormContext<ResumeData>()
  
  // Ensure certifications array exists
  if (!getValues('certifications')) {
    setValue('certifications', [])
  }
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications',
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
            <FaCertificate className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Certifications & Licenses
            </h3>
            <p className="text-sm text-gray-500">
              Add your professional certifications and licenses
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
            <h4 className="text-sm font-medium text-amber-800 mb-1">Tips for adding certifications</h4>
            <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
              <li>Include the full, official name of the certification</li>
              <li>Add the issuing organization and date received</li>
              <li>If relevant, include expiration dates or credential IDs</li>
              <li>Prioritize certifications relevant to your target position</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Certification Items */}
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
                  console.error('Error removing certification:', error);
                }
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Certification Name</label>
                <div className={inputGroupClass}>
                  <FaCertificate className={iconClass} />
                  <input
                    type="text"
                    {...register(`certifications.${index}.name`)}
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className={inputWithIconClass}
                  />
                </div>
                {errors.certifications?.[index]?.name && (
                  <p className={errorClass}>{errors.certifications?.[index]?.name?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Issuing Organization</label>
                <div className={inputGroupClass}>
                  <FaBuilding className={iconClass} />
                  <input
                    type="text"
                    {...register(`certifications.${index}.issuer`)}
                    placeholder="e.g. Amazon Web Services"
                    className={inputWithIconClass}
                  />
                </div>
                {errors.certifications?.[index]?.issuer && (
                  <p className={errorClass}>{errors.certifications?.[index]?.issuer?.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Date Received</label>
                <div className={inputGroupClass}>
                  <FaCalendarAlt className={iconClass} />
                  <input
                    type="text"
                    {...register(`certifications.${index}.date`)}
                    placeholder="e.g. May 2023"
                    className={inputWithIconClass}
                  />
                </div>
                {errors.certifications?.[index]?.date && (
                  <p className={errorClass}>{errors.certifications?.[index]?.date?.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Description (Optional)</label>
                <textarea
                  {...register(`certifications.${index}.description`)}
                  placeholder="Add any additional details about this certification"
                  className={inputClass}
                  rows={3}
                />
                {errors.certifications?.[index]?.description && (
                  <p className={errorClass}>{errors.certifications?.[index]?.description?.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Certification Button */}
      <button
        type="button"
        onClick={() => {
          try {
            append({
              name: '',
              issuer: '',
              date: '',
              description: ''
            });
          } catch (error) {
            console.error('Error adding certification:', error);
          }
        }}
        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <FaCertificate className="w-4 h-4 mr-2" />
        Add Certification
      </button>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-3">
            <FaCertificate className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">
            No certifications added yet. Click the button above to add your first certification.
          </p>
        </div>
      )}
    </div>
  )
} 