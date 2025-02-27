import { useFieldArray, useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaGlobe, FaTrash, FaLinkedin, FaGithub, FaTwitter, FaInstagram, FaFacebook, FaLink, FaPlus } from 'react-icons/fa'

export function SocialLinksSection() {
  const { register, control, formState: { errors } } = useFormContext<ResumeData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
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

  // Social platform options with icons
  const socialPlatforms = [
    { value: 'linkedin', label: 'LinkedIn', icon: <FaLinkedin className="w-4 h-4" /> },
    { value: 'github', label: 'GitHub', icon: <FaGithub className="w-4 h-4" /> },
    { value: 'twitter', label: 'Twitter', icon: <FaTwitter className="w-4 h-4" /> },
    { value: 'instagram', label: 'Instagram', icon: <FaInstagram className="w-4 h-4" /> },
    { value: 'facebook', label: 'Facebook', icon: <FaFacebook className="w-4 h-4" /> },
    { value: 'website', label: 'Personal Website', icon: <FaGlobe className="w-4 h-4" /> },
    { value: 'other', label: 'Other', icon: <FaLink className="w-4 h-4" /> },
  ]

  // Get icon for platform
  const getPlatformIcon = (platform: string) => {
    const found = socialPlatforms.find(p => p.value === platform)
    return found ? found.icon : <FaLink className="w-4 h-4" />
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <FaGlobe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Social Links
            </h3>
            <p className="text-sm text-gray-500">
              Add your professional profiles and websites
            </p>
          </div>
        </div>
      </div>

      {/* Social Links Items */}
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
                  console.error('Error removing social link:', error);
                }
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1.5 hover:bg-red-200"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Platform</label>
                <select
                  {...register(`socialLinks.${index}.platform`)}
                  className={selectClass}
                >
                  <option value="">Select platform</option>
                  {socialPlatforms.map(platform => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
                {errors.socialLinks?.[index]?.platform && (
                  <p className={errorClass}>{errors.socialLinks[index]?.platform?.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>URL</label>
                <div className={inputGroupClass}>
                  <div className="absolute left-3 top-3.5 text-gray-400 z-10">
                    {getPlatformIcon(field.platform)}
                  </div>
                  <input
                    type="url"
                    {...register(`socialLinks.${index}.url`)}
                    placeholder={`https://${field.platform || 'example'}.com/yourprofile`}
                    className={inputWithIconClass}
                  />
                </div>
                {errors.socialLinks?.[index]?.url && (
                  <p className={errorClass}>{errors.socialLinks[index]?.url?.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Social Link Button */}
      <button
        type="button"
        onClick={() => {
          try {
            append({
              platform: '',
              url: ''
            });
          } catch (error) {
            console.error('Error adding social link:', error);
          }
        }}
        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <FaPlus className="w-4 h-4 mr-2" />
        Add Social Link
      </button>

      {/* Empty State */}
      {fields.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-3">
            <FaGlobe className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">
            No social links added yet. Click the button above to add your professional profiles.
          </p>
        </div>
      )}
    </div>
  )
} 