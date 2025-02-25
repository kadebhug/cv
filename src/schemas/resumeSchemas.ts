import { z } from 'zod'

export const personalSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  photo: z.string().optional(),
})

export const experienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  employer: z.string().min(1, 'Employer is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().min(1, 'Description is required'),
})

export const educationSchema = z.object({
  school: z.string().min(1, 'School is required'),
  degree: z.string().min(1, 'Degree is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean(),
  description: z.string().optional(),
})

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
})

export const resumeSchema = z.object({
  personal: personalSchema,
  professionalSummary: z.string().min(1, 'Professional summary is required'),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(skillSchema),
  socialLinks: z.array(z.object({
    platform: z.string().min(1, 'Platform is required'),
    url: z.string().url('Invalid URL'),
  })),
}) 