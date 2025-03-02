export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  jobTitle?: string;
  website?: string;
  summary?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface Experience {
  jobTitle: string;
  employer: string;
  city?: string;
  country?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  city?: string;
  country?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface Skill {
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Course {
  name: string;
  institution: string;
  date: string;
  description?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date?: string;
  description?: string;
}

export interface Project {
  name: string;
  description: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
}

export interface Organization {
  name: string;
  role: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface CustomSection {
  title: string;
  items: Array<{
    title: string;
    subtitle?: string;
    date?: string;
    description?: string;
  }>;
}

export interface ResumeTheme {
  template: string;
  color: string;
  font?: string;
}

export interface ResumeData {
  id?: string;
  userId?: string;
  name?: string;
  personal: PersonalInfo;
  experience?: Experience[];
  education?: Education[];
  skills?: Skill[];
  certifications?: Certification[];
  socialLinks?: SocialLink[];
  hobbies?: string[];
  languages?: { language: string; proficiency: string }[];
  professionalSummary?: string;
  theme?: ResumeTheme;
  createdAt?: Date;
  updatedAt?: Date;
} 