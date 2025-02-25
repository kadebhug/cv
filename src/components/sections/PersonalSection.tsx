import { useFormContext } from 'react-hook-form'
import { ResumeData } from '../../types/resume'
import { FaUser } from 'react-icons/fa'

export function PersonalSection() {
  const { register, formState: { errors } } = useFormContext<ResumeData>()

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
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

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input
            type="text"
            {...register('personal.jobTitle')}
            placeholder="e.g. Senior Software Engineer"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
          {errors.personal?.jobTitle && (
            <p className="mt-1 text-sm text-red-600">{errors.personal.jobTitle.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            {...register('personal.firstName')}
            placeholder="e.g. John"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            {...register('personal.lastName')}
            placeholder="e.g. Doe"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('personal.email')}
            placeholder="e.g. john.doe@example.com"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            {...register('personal.phone')}
            placeholder="e.g. +1 234 567 890"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <input
            type="text"
            {...register('personal.country')}
            placeholder="e.g. United States"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            type="text"
            {...register('personal.city')}
            placeholder="e.g. San Francisco"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            {...register('personal.address')}
            placeholder="e.g. 123 Main St"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
          <input
            type="text"
            {...register('personal.postalCode')}
            placeholder="e.g. 94105"
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>
    </div>
  )
} 