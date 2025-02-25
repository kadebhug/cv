import { useFieldArray, useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaLinkedin, FaGithub, FaGlobe, FaTwitter, FaLink } from 'react-icons/fa'

const socialPlatforms = [
  { id: 'LinkedIn', icon: FaLinkedin, color: '#0077B5' },
  { id: 'GitHub', icon: FaGithub, color: '#333333' },
  { id: 'Portfolio', icon: FaGlobe, color: '#4CAF50' },
  { id: 'Twitter', icon: FaTwitter, color: '#1DA1F2' },
  { id: 'Other', icon: FaLink, color: '#718096' },
] as const

export function SocialLinksSection() {
  const { register, control, formState: { errors } } = useFormContext<ResumeData>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks'
  })

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Add your professional profiles and websites
        </h3>
        <p className="text-sm text-gray-500">
          Include links to your portfolio, professional social media, or any other relevant websites.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div 
            key={field.id} 
            className="group relative bg-white rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  {...register(`socialLinks.${index}.platform`)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {socialPlatforms.map(platform => {
                    const Icon = platform.icon
                    return (
                      <option key={platform.id} value={platform.id}>
                        {platform.id}
                      </option>
                    )
                  })}
                </select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <div className="relative">
                  {socialPlatforms.map(platform => {
                    const Icon = platform.icon
                    return field.platform === platform.id && (
                      <Icon 
                        key={platform.id}
                        className="absolute left-3 top-1/2 -translate-y-1/2" 
                        style={{ color: platform.color }}
                      />
                    )
                  })}
                  <input
                    type="url"
                    {...register(`socialLinks.${index}.url`)}
                    placeholder="https://"
                    className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                {errors.socialLinks?.[index]?.url && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.socialLinks[index]?.url?.message}
                  </p>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => remove(index)}
                className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button
        type="button"
        onClick={() => append({ platform: 'LinkedIn', url: '' })}
        className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Social Link
      </button>

      {fields.length === 0 && (
        <div className="text-center py-6">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            No social links added yet. Click the button above to add one.
          </p>
        </div>
      )}
    </div>
  )
} 