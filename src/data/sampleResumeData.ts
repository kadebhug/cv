import { ResumeData } from '../types/resume';

export const sampleResumeData: ResumeData = {
  personal: {
    jobTitle: 'Senior Software Engineer',
    firstName: 'Sipho',
    lastName: 'Nkosi',
    email: 'sipho.nkosi@example.co.za',
    phone: '+27 (083) 123 4567',
    country: 'South Africa',
    city: 'Cape Town',
    address: '123 Long Street',
    postalCode: '8001',
  },
  professionalSummary: 'Results-driven software engineer with 8+ years of experience developing scalable web applications. Proficient in React, Node.js, and cloud technologies. Led multiple successful projects and mentored junior developers. Passionate about clean code and user-centric design.',
  experience: [
    {
      jobTitle: 'Senior Software Engineer',
      employer: 'Takealot Tech',
      city: 'Cape Town',
      country: 'South Africa',
      startDate: '2020-01-01',
      endDate: '',
      current: true,
      description: 'Led development of a cloud-based SaaS platform serving 50,000+ users. Implemented CI/CD pipelines reducing deployment time by 70%. Mentored junior developers and conducted code reviews.'
    },
    {
      jobTitle: 'Software Developer',
      employer: 'Luno',
      city: 'Johannesburg',
      country: 'South Africa',
      startDate: '2017-03-15',
      endDate: '2019-12-31',
      current: false,
      description: 'Developed responsive web applications using React and Redux. Collaborated with UX designers to implement user-friendly interfaces. Optimized database queries improving performance by 40%.'
    }
  ],
  education: [
    {
      school: 'University of Cape Town',
      degree: 'Master of Science in Computer Science',
      city: 'Cape Town',
      country: 'South Africa',
      startDate: '2015-02-01',
      endDate: '2016-11-30',
      current: false,
      description: 'Specialized in Artificial Intelligence and Machine Learning. Graduated with distinction.'
    },
    {
      school: 'University of the Witwatersrand',
      degree: 'Bachelor of Science in Computer Science',
      city: 'Johannesburg',
      country: 'South Africa',
      startDate: '2011-02-01',
      endDate: '2014-11-30',
      current: false,
      description: 'Dean\'s Merit List, Computer Science Student Association, MTN App Challenge Winner'
    }
  ],
  skills: [
    { name: 'React.js', level: 'expert' },
    { name: 'Node.js', level: 'advanced' },
    { name: 'TypeScript', level: 'expert' },
    { name: 'AWS', level: 'intermediate' },
    { name: 'Docker', level: 'advanced' },
    { name: 'GraphQL', level: 'intermediate' },
    { name: 'MongoDB', level: 'advanced' },
    { name: 'CI/CD', level: 'intermediate' }
  ],
  socialLinks: [
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/siphonkosi' },
    { platform: 'GitHub', url: 'https://github.com/siphonkosi' },
    { platform: 'Portfolio', url: 'https://siphonkosi.co.za' }
  ],
  hobbies: ['Rugby', 'Braai', 'Open Source Contributing', 'Wildlife Photography']
}; 