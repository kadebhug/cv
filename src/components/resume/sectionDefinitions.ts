import { 
  FaUser, FaFileAlt, FaBriefcase, FaGraduationCap, FaTools, FaLink, 
  FaPuzzlePiece, FaHeart, FaCertificate, FaProjectDiagram, FaTrophy, 
  FaLinkedin 
} from 'react-icons/fa';

// Core sections that are always shown
export const coreSections = [
  { id: 'personal', title: 'Personal Details', icon: FaUser, description: 'Basic information about you' },
  { id: 'summary', title: 'Professional Summary', icon: FaFileAlt, description: 'Brief overview of your professional background' },
  { id: 'experience', title: 'Employment History', icon: FaBriefcase, description: 'Your work history and achievements' },
  { id: 'education', title: 'Education', icon: FaGraduationCap, description: 'Your academic background' },
  { id: 'social', title: 'Social Links', icon: FaLink, description: 'Your professional online presence' },
  { id: 'skills', title: 'Skills', icon: FaTools, description: 'Your technical and soft skills' },
] as const;

// Optional sections that can be toggled
export const optionalSections = [
  { id: 'certifications', title: 'Certifications & Licenses', icon: FaCertificate, description: 'Your professional certifications and licenses' },
  { id: 'projects', title: 'Projects', icon: FaProjectDiagram, description: 'Your personal or professional projects' },
  { id: 'achievements', title: 'Achievements & Awards', icon: FaTrophy, description: 'Your notable achievements and awards' },
  { id: 'hobbies', title: 'Hobbies', icon: FaHeart, description: 'Your interests and activities' },
  { id: 'custom', title: 'Custom Sections', icon: FaPuzzlePiece, description: 'Add custom sections to your resume' },
] as const;

// Available templates
export const templates = [
  { 
    id: 'modern', 
    name: 'Modern', 
    description: 'Clean and contemporary design suitable for most industries',
    category: 'general',
    popular: true
  },
  { 
    id: 'professional', 
    name: 'Professional', 
    description: 'Traditional layout with a professional appearance',
    category: 'general',
    popular: true
  },
  { 
    id: 'creative', 
    name: 'Creative', 
    description: 'Unique design for creative industries and portfolios',
    category: 'creative',
    popular: true
  },
  { 
    id: 'executive', 
    name: 'Executive', 
    description: 'Sophisticated design for senior positions and leadership roles',
    category: 'business',
    popular: false
  },
  { 
    id: 'minimalist', 
    name: 'Minimalist', 
    description: 'Simple and elegant with focus on content over design',
    category: 'general',
    popular: true
  },
  { 
    id: 'tech', 
    name: 'Tech', 
    description: 'Modern design optimized for IT and technology positions',
    category: 'tech',
    popular: true
  },
  { 
    id: 'academic', 
    name: 'Academic', 
    description: 'Formal layout for academic and research positions',
    category: 'education',
    popular: false
  },
  { 
    id: 'medical', 
    name: 'Medical', 
    description: 'Specialized format for healthcare professionals',
    category: 'healthcare',
    popular: false
  },
  { 
    id: 'legal', 
    name: 'Legal', 
    description: 'Structured format for legal professionals',
    category: 'legal',
    popular: false
  },
  { 
    id: 'engineering', 
    name: 'Engineering', 
    description: 'Technical layout for engineering and manufacturing roles',
    category: 'tech',
    popular: false
  },
  { 
    id: 'finance', 
    name: 'Finance', 
    description: 'Professional design for banking and finance positions',
    category: 'business',
    popular: false
  },
  { 
    id: 'sales', 
    name: 'Sales', 
    description: 'Results-focused layout for sales and marketing professionals',
    category: 'business',
    popular: false
  }
];

// Template categories for filtering
export const templateCategories = [
  { id: 'general', name: 'General' },
  { id: 'creative', name: 'Creative' },
  { id: 'business', name: 'Business' },
  { id: 'tech', name: 'Technology' },
  { id: 'education', name: 'Education' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'legal', name: 'Legal' }
]; 