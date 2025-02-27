import { useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHome, FaMailBulk, FaBriefcase, FaGlobe } from 'react-icons/fa'
import { ImageUploader } from '../ImageUploader'

export function PersonalSection() {
  const { register, formState: { errors }, setValue, watch } = useFormContext<ResumeData>()
  
  const photo = watch('personal.photo')
  
  const handlePhotoChange = (value: string) => {
    setValue('personal.photo', value, { shouldValidate: true, shouldDirty: true })
  }

  // Common input field styling
  const inputClass = "w-full rounded-lg border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 placeholder:text-gray-400 text-gray-700"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"
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
            <FaUser className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700">
              Personal Details
            </h3>
            <p className="text-sm text-gray-500">
              Add your basic information to help employers contact you
            </p>
          </div>
        </div>
      </div>

      {/* Profile Photo */}
      <div className="flex justify-center">
        <div className="w-full max-w-xs">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
            Profile Photo
          </label>
          <ImageUploader 
            value={photo} 
            onChange={handlePhotoChange} 
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className={labelClass}>Job Title</label>
          <div className={inputGroupClass}>
            <FaBriefcase className={iconClass} />
            <input
              type="text"
              {...register('personal.jobTitle')}
              placeholder="e.g. Senior Software Developer"
              className={inputWithIconClass}
            />
          </div>
          {errors.personal?.jobTitle && (
            <p className={errorClass}>{errors.personal.jobTitle.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>First Name</label>
          <input
            type="text"
            {...register('personal.firstName')}
            placeholder="e.g. Sipho"
            className={inputClass}
          />
          {errors.personal?.firstName && (
            <p className={errorClass}>{errors.personal.firstName.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Last Name</label>
          <input
            type="text"
            {...register('personal.lastName')}
            placeholder="e.g. Nkosi"
            className={inputClass}
          />
          {errors.personal?.lastName && (
            <p className={errorClass}>{errors.personal.lastName.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <div className={inputGroupClass}>
            <FaEnvelope className={iconClass} />
            <input
              type="email"
              {...register('personal.email')}
              placeholder="e.g. sipho.nkosi@example.co.za"
              className={inputWithIconClass}
            />
          </div>
          {errors.personal?.email && (
            <p className={errorClass}>{errors.personal.email.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Phone</label>
          <div className={inputGroupClass}>
            <FaPhone className={iconClass} />
            <input
              type="tel"
              {...register('personal.phone')}
              placeholder="e.g. +27 83 123 4567"
              className={inputWithIconClass}
            />
          </div>
          {errors.personal?.phone && (
            <p className={errorClass}>{errors.personal.phone.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Country</label>
          <div className={inputGroupClass}>
            <FaGlobe className={iconClass} />
            <input
              type="text"
              {...register('personal.country')}
              placeholder="e.g. South Africa"
              className={inputWithIconClass}
            />
          </div>
          {errors.personal?.country && (
            <p className={errorClass}>{errors.personal.country.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>City</label>
          <div className={inputGroupClass}>
            <FaMapMarkerAlt className={iconClass} />
            <input
              type="text"
              {...register('personal.city')}
              placeholder="e.g. Cape Town"
              className={inputWithIconClass}
            />
          </div>
          {errors.personal?.city && (
            <p className={errorClass}>{errors.personal.city.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Address</label>
          <div className={inputGroupClass}>
            <FaHome className={iconClass} />
            <input
              type="text"
              {...register('personal.address')}
              placeholder="e.g. 123 Long Street"
              className={inputWithIconClass}
            />
          </div>
          {errors.personal?.address && (
            <p className={errorClass}>{errors.personal.address.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Postal Code</label>
          <div className={inputGroupClass}>
            <FaMailBulk className={iconClass} />
            <input
              type="text"
              {...register('personal.postalCode')}
              placeholder="e.g. 8001"
              className={inputWithIconClass}
            />
          </div>
          {errors.personal?.postalCode && (
            <p className={errorClass}>{errors.personal.postalCode.message}</p>
          )}
        </div>
      </div>
    </div>
  )
} 