import { ResumeData } from '../types/resume';

// Mock job data
const MOCK_JOBS = [
  {
    id: 'job1',
    title: 'Frontend Developer',
    company: 'Tech Solutions Inc.',
    location: 'New York, NY',
    description: 'Seeking an experienced frontend developer with React and TypeScript skills.',
    url: '#',
    datePosted: '2 days ago',
    platform: 'indeed' as const,
    salary: '$90,000 - $120,000',
    jobType: 'Full-time'
  },
  {
    id: 'job2',
    title: 'UX Designer',
    company: 'Creative Digital Agency',
    location: 'Remote',
    description: 'Join our team to create beautiful and intuitive user experiences.',
    url: '#',
    datePosted: '1 week ago',
    platform: 'indeed' as const,
    salary: '$85,000 - $110,000',
    jobType: 'Full-time'
  },
  {
    id: 'job3',
    title: 'Full Stack Developer',
    company: 'Startup Innovations',
    location: 'San Francisco, CA',
    description: 'Looking for a full stack developer with Node.js and React experience.',
    url: '#',
    datePosted: '3 days ago',
    platform: 'zipRecruiter' as const,
    salary: '$100,000 - $130,000',
    jobType: 'Full-time'
  },
  {
    id: 'job4',
    title: 'Software Engineer',
    company: 'Enterprise Solutions',
    location: 'Chicago, IL',
    description: 'Join our engineering team to build scalable enterprise applications.',
    url: '#',
    datePosted: '5 days ago',
    platform: 'indeed' as const,
    salary: '$95,000 - $125,000',
    jobType: 'Full-time'
  },
  {
    id: 'job5',
    title: 'Product Manager',
    company: 'Tech Innovations',
    location: 'Austin, TX',
    description: 'Lead product development for our growing SaaS platform.',
    url: '#',
    datePosted: '1 day ago',
    platform: 'zipRecruiter' as const,
    salary: '$110,000 - $140,000',
    jobType: 'Full-time'
  }
];

// Search for jobs (mock implementation)
export const searchIndeedJobs = async (keywords: string, location: string, limit = 10) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Filter mock jobs based on keywords and location
  const filteredJobs = MOCK_JOBS.filter(job => {
    const matchesKeywords = keywords ? 
      job.title.toLowerCase().includes(keywords.toLowerCase()) || 
      job.description.toLowerCase().includes(keywords.toLowerCase()) : 
      true;
    
    const matchesLocation = location ? 
      job.location.toLowerCase().includes(location.toLowerCase()) : 
      true;
    
    return matchesKeywords && matchesLocation;
  });
  
  return filteredJobs.slice(0, limit);
};

// Apply to job with resume (mock implementation)
export const applyToJob = async (jobId: string, platform: 'indeed' | 'zipRecruiter', resumeData: ResumeData, coverLetter?: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Find the job or create a placeholder
  const job = MOCK_JOBS.find(job => job.id === jobId) || {
    id: jobId,
    title: 'Unknown Position',
    company: 'Unknown Company',
    platform: platform,
    url: '#',
    datePosted: 'Unknown',
    description: '',
    location: ''
  };
  
  // Mock successful application
  return {
    success: true,
    applicationId: `app-${Date.now()}`,
    message: 'Application submitted successfully',
    job
  };
};

// Get job recommendations based on resume (mock implementation)
export const getJobRecommendations = async (resumeData: ResumeData, limit = 10) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For the mock, we'll just return all sample jobs
  // In a real implementation, this would analyze the resume and find matching jobs
  
  // Sort randomly to simulate different recommendations
  const shuffled = [...MOCK_JOBS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}; 