import { ResumeData } from '../types/resume';

export const sampleResumeData: ResumeData = {
  personal: {
    jobTitle: 'Senior Software Engineer',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    city: 'San Francisco',
    address: '123 Tech Street',
    postalCode: '94107',
  },
  professionalSummary: 'Results-driven software engineer with 8+ years of experience developing scalable web applications. Proficient in React, Node.js, and cloud technologies. Led multiple successful projects and mentored junior developers. Passionate about clean code and user-centric design.',
  experience: [
    {
      jobTitle: 'Senior Software Engineer',
      employer: 'Tech Solutions Inc.',
      city: 'San Francisco',
      country: 'United States',
      startDate: '2020-01-01',
      endDate: '',
      current: true,
      description: 'Led development of a cloud-based SaaS platform serving 50,000+ users. Implemented CI/CD pipelines reducing deployment time by 70%. Mentored junior developers and conducted code reviews.'
    },
    {
      jobTitle: 'Software Developer',
      employer: 'Digital Innovations',
      city: 'Boston',
      country: 'United States',
      startDate: '2017-03-15',
      endDate: '2019-12-31',
      current: false,
      description: 'Developed responsive web applications using React and Redux. Collaborated with UX designers to implement user-friendly interfaces. Optimized database queries improving performance by 40%.'
    }
  ],
  education: [
    {
      school: 'Massachusetts Institute of Technology',
      degree: 'Master of Science in Computer Science',
      city: 'Cambridge',
      country: 'United States',
      startDate: '2015-09-01',
      endDate: '2017-05-30',
      current: false,
      description: 'Specialized in Artificial Intelligence and Machine Learning. Graduated with honors.'
    },
    {
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science in Computer Science',
      city: 'Berkeley',
      country: 'United States',
      startDate: '2011-09-01',
      endDate: '2015-05-30',
      current: false,
      description: 'Dean\'s List, Computer Science Student Association, Hackathon Winner'
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
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' },
    { platform: 'GitHub', url: 'https://github.com/johndoe' },
    { platform: 'Portfolio', url: 'https://johndoe.dev' }
  ],
  hobbies: ['Hiking', 'Photography', 'Open Source Contributing', 'Chess']
}; 