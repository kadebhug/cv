export interface PersonalInfo {
  jobTitle: string
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
  city: string
  address: string
  postalCode: string
}

export interface SocialLink {
  platform: string
  url: string
}

export interface Experience {
  jobTitle: string
  employer: string
  city: string
  country: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
}

export interface Education {
  school: string
  degree: string
  city: string
  country: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
}

export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

export interface Course {
  name: string
  institution: string
  date: string
  description?: string
}

export interface CustomSection {
  title: string
  items: Array<{
    title: string
    subtitle?: string
    date?: string
    description?: string
  }>
}

export interface ResumeData {
  personal: PersonalInfo
  professionalSummary: string
  experience: Experience[]
  education: Education[]
  socialLinks: SocialLink[]
  skills: Skill[]
  courses?: Course[]
  hobbies?: string[]
  customSections?: CustomSection[]
} 