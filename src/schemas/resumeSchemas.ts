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

export const courseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  institution: z.string().min(1, 'Institution is required'),
  date: z.string().min(1, 'Date is required'),
  description: z.string().optional(),
})

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().optional(),
  description: z.string().optional(),
})

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Description is required'),
  url: z.string().url('Invalid URL').optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
})

export const organizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
})

export const customSectionItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
})

export const customSectionSchema = z.object({
  title: z.string().min(1, 'Section title is required'),
  items: z.array(customSectionItemSchema),
})

export const themeSchema = z.object({
  template: z.string().min(1, 'Template is required'),
  color: z.string().min(1, 'Color is required'),
  font: z.string().optional(),
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
  courses: z.array(courseSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  projects: z.array(projectSchema).optional(),
  organizations: z.array(organizationSchema).optional(),
  customSections: z.array(customSectionSchema).optional(),
  hobbies: z.array(z.string()).optional(),
  theme: themeSchema.optional(),
}) 