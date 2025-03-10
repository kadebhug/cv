import { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaGraduationCap, FaTools, FaTrash, FaPlus, FaCalendarAlt, FaUniversity, FaCertificate } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { saveResume as createResume } from '../services/resumeService';
import { ResumeData } from '../types/resume';

interface ResumeWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define industry types and their recommended sections
interface IndustryInfo {
  name: string;
  sections: string[];
}

export function ResumeWizardModal({ isOpen, onClose }: ResumeWizardModalProps) {
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryInfo | null>(null);
  const [personalDetails, setPersonalDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [generalFields, setGeneralFields] = useState({
    objective: '',
  });
  const [skills, setSkills] = useState<Array<{name: string, level: 'beginner' | 'intermediate' | 'advanced' | 'expert'}>>([
    { name: '', level: 'intermediate' }
  ]);
  const [educationEntries, setEducationEntries] = useState<Array<{
    school: string,
    degree: string,
    city?: string,
    country?: string,
    startDate: string,
    endDate?: string,
    current?: boolean,
    description?: string
  }>>([
    {
      school: '',
      degree: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
  ]);
  const [certifications, setCertifications] = useState<Array<{
    name: string,
    issuer: string,
    date?: string,
    description?: string
  }>>([
    {
      name: '',
      issuer: '',
      date: '',
      description: ''
    }
  ]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Industry data with recommended sections
  const industries: IndustryInfo[] = [
    {
      name: "General (All Industries)",
      sections: [
        "Contact Information (Name, Email, Phone, LinkedIn)",
        "Summary/Objective",
        "Skills & Competencies",
        "Work Experience",
        "Education",
        "Certifications & Licenses",
        "Projects (if applicable)",
        "Achievements & Awards"
      ]
    },
    {
      name: "Software Development / IT",
      sections: [
        "Technical Skills (Programming languages, tools, frameworks)",
        "Projects & Portfolio (GitHub, personal website)",
        "Work Experience",
        "Certifications (AWS, Google, Microsoft, etc.)",
        "Hackathons / Open Source Contributions"
      ]
    },
    {
      name: "Marketing & Advertising",
      sections: [
        "Marketing Skills (SEO, PPC, Social Media, Copywriting, etc.)",
        "Campaigns & Case Studies",
        "Work Experience",
        "Certifications (Google Ads, HubSpot, Facebook Blueprint, etc.)",
        "Portfolio (if applicable: social media pages, content, ads, etc.)"
      ]
    },
    {
      name: "Finance & Accounting",
      sections: [
        "Core Competencies (Financial modeling, tax, auditing, etc.)",
        "Work Experience",
        "Certifications (CPA, CFA, ACCA, etc.)",
        "Key Achievements (cost savings, revenue growth, risk management impact, etc.)",
        "Education (Relevant finance/accounting degrees)"
      ]
    },
    {
      name: "Healthcare & Medicine",
      sections: [
        "Licenses & Certifications (MD, RN, EMT, etc.)",
        "Clinical Experience",
        "Research & Publications (if applicable)",
        "Specializations",
        "Skills (Patient care, medical equipment, etc.)"
      ]
    },
    {
      name: "Engineering (Mechanical, Civil, Electrical, etc.)",
      sections: [
        "Technical Skills & Tools (CAD, MATLAB, AutoCAD, etc.)",
        "Projects & Research Work",
        "Certifications (PE, FE, PMP, etc.)",
        "Work Experience",
        "Patents & Publications (if applicable)"
      ]
    },
    {
      name: "Education & Teaching",
      sections: [
        "Teaching Certifications (Teaching License, TESOL, etc.)",
        "Classroom Management Strategies",
        "Teaching Experience",
        "Courses Taught & Curriculum Developed",
        "Educational Philosophy Statement"
      ]
    },
    {
      name: "Creative Fields (Design, Writing, Film, etc.)",
      sections: [
        "Portfolio Link",
        "Creative Skills & Software (Photoshop, Illustrator, etc.)",
        "Projects & Clients",
        "Publications / Works Featured In",
        "Awards & Recognition"
      ]
    },
    {
      name: "Sales & Business Development",
      sections: [
        "Sales Skills (CRM, lead generation, negotiation, etc.)",
        "Revenue Growth Achievements",
        "Key Clients & Partnerships",
        "Certifications (Salesforce, HubSpot, etc.)",
        "Performance Metrics (Sales targets, KPIs, etc.)"
      ]
    },
    {
      name: "Customer Service & Retail",
      sections: [
        "Customer Support Skills (Conflict resolution, CRM software, etc.)",
        "Achievements (Customer satisfaction scores, sales performance, etc.)",
        "Multilingual Skills (if applicable)",
        "Certifications (Customer Service Training, etc.)"
      ]
    }
  ];

  const handleIndustrySelect = (industry: IndustryInfo) => {
    setSelectedIndustry(industry);
    setStep(2);
  };

  const handlePersonalDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGeneralFieldsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGeneralFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (index: number, field: 'name' | 'level', value: string) => {
    setSkills(prevSkills => {
      const newSkills = [...prevSkills];
      newSkills[index] = {
        ...newSkills[index],
        [field]: value
      };
      return newSkills;
    });
  };

  const addSkill = () => {
    setSkills(prevSkills => [...prevSkills, { name: '', level: 'intermediate' }]);
  };

  const removeSkill = (index: number) => {
    setSkills(prevSkills => prevSkills.filter((_, i) => i !== index));
  };

  const handleEducationChange = (index: number, field: string, value: any) => {
    setEducationEntries(prevEntries => {
      const newEntries = [...prevEntries];
      newEntries[index] = {
        ...newEntries[index],
        [field]: field === 'current' ? !newEntries[index].current : value
      };
      return newEntries;
    });
  };

  const addEducation = () => {
    setEducationEntries(prevEntries => [
      ...prevEntries,
      {
        school: '',
        degree: '',
        city: '',
        country: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
    ]);
  };

  const removeEducation = (index: number) => {
    setEducationEntries(prevEntries => prevEntries.filter((_, i) => i !== index));
  };

  const handleCertificationChange = (index: number, field: string, value: string) => {
    setCertifications(prevCerts => {
      const newCerts = [...prevCerts];
      newCerts[index] = {
        ...newCerts[index],
        [field]: value
      };
      return newCerts;
    });
  };

  const addCertification = () => {
    setCertifications(prevCerts => [
      ...prevCerts,
      {
        name: '',
        issuer: '',
        date: '',
        description: ''
      }
    ]);
  };

  const removeCertification = (index: number) => {
    setCertifications(prevCerts => prevCerts.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!currentUser) return;
    
    // For development, if no industry is selected, use the first one
    const industry = selectedIndustry || industries[0];

    try {
      // Create a basic resume with the wizard data
      const newResume: Partial<ResumeData> = {
        userId: currentUser.uid,
        name: `${personalDetails.firstName || 'New'} ${personalDetails.lastName || 'User'}'s Resume - ${industry.name}`,
        personal: {
          firstName: personalDetails.firstName || 'New',
          lastName: personalDetails.lastName || 'User',
          email: personalDetails.email || 'user@example.com',
          phone: personalDetails.phone || '',
          address: personalDetails.address || '',
          city: personalDetails.city || '',
          state: personalDetails.state || '',
          zipCode: personalDetails.zipCode || '',
          country: personalDetails.country || '',
          // Add LinkedIn to jobTitle field temporarily (or create a custom field)
          jobTitle: personalDetails.linkedin ? `LinkedIn: ${personalDetails.linkedin}` : undefined
        },
        // Add the objective/summary
        professionalSummary: generalFields.objective || `Professional with experience in the ${industry.name} field.`,
        // Add skills as an array with proper structure
        skills: skills.filter(skill => skill.name.trim() !== ''),
        // Add education with proper structure
        education: educationEntries.filter(entry => entry.school.trim() !== '' || entry.degree.trim() !== ''),
        // Add certifications with proper structure
        certifications: certifications.filter(cert => cert.name.trim() !== '' || cert.issuer.trim() !== ''),
        // Add a custom section for recommended sections
        customSections: [
          {
            title: "Recommended Sections for Your Resume",
            items: industry.sections.map(section => ({
              title: section,
              description: "Add content for this section in the resume editor."
            }))
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const resumeId = await createResume(newResume as ResumeData);
      onClose();
      navigate(`/edit-resume/${resumeId}`);
    } catch (error) {
      console.error('Error creating resume:', error);
    }
  };

  // Development navigation functions
  const goToStep = (newStep: number) => {
    if (newStep < 1) newStep = 1;
    if (newStep > 3) newStep = 3;
    
    // If moving to step 2 and no industry selected, select the first one
    if (newStep === 2 && !selectedIndustry) {
      setSelectedIndustry(industries[0]);
    }
    
    setStep(newStep);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-6 sm:p-8 sm:pb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-gray-900">
                {step === 1 ? 'Select Industry' : step === 2 ? 'Personal Details' : 'General Information'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => goToStep(1)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                  >
                    1
                  </button>
                  <span className="text-xs mt-1">Industry</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => goToStep(2)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                  >
                    2
                  </button>
                  <span className="text-xs mt-1">Personal</span>
                </div>
                <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => goToStep(3)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                  >
                    3
                  </button>
                  <span className="text-xs mt-1">General</span>
                </div>
              </div>
            </div>

            {/* Development navigation bar */}
            <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-center justify-between">
                <span className="text-xs text-yellow-700">Development Navigation</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => goToStep(step - 1)}
                    className="p-1 rounded bg-yellow-100 hover:bg-yellow-200"
                    title="Previous Step"
                  >
                    <FaChevronLeft className="h-4 w-4 text-yellow-700" />
                  </button>
                  <button
                    onClick={() => goToStep(step + 1)}
                    className="p-1 rounded bg-yellow-100 hover:bg-yellow-200"
                    title="Next Step"
                  >
                    <FaChevronRight className="h-4 w-4 text-yellow-700" />
                  </button>
                </div>
              </div>
            </div>

            {step === 1 && (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Select the industry you're applying for to optimize your resume with recommended sections.
                </p>
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                  {industries.map((industry) => (
                    <button
                      key={industry.name}
                      onClick={() => handleIndustrySelect(industry)}
                      className="px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-left"
                    >
                      {industry.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-sm text-gray-500 mb-6">
                  Enter your personal details. This information will be used in the header of your resume.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={personalDetails.firstName}
                      onChange={handlePersonalDetailsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={personalDetails.lastName}
                      onChange={handlePersonalDetailsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={personalDetails.email}
                      onChange={handlePersonalDetailsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={personalDetails.phone}
                      onChange={handlePersonalDetailsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      id="linkedin"
                      value={personalDetails.linkedin}
                      onChange={handlePersonalDetailsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={personalDetails.address}
                      onChange={handlePersonalDetailsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      value={personalDetails.city}
                      onChange={handlePersonalDetailsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      id="country"
                      value={personalDetails.country}
                      onChange={handlePersonalDetailsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      value={personalDetails.zipCode}
                      onChange={handlePersonalDetailsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-sm text-gray-500 mb-6">
                  Enter general information for your resume. You can add more details later in the resume editor.
                </p>
                <div className="space-y-8">
                  <div>
                    <label htmlFor="objective" className="block text-sm font-medium text-gray-700">
                      Professional Summary/Objective
                    </label>
                    <textarea
                      name="objective"
                      id="objective"
                      rows={3}
                      value={generalFields.objective}
                      onChange={handleGeneralFieldsChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Brief summary of your professional background and career goals"
                    />
                  </div>
                  
                  {/* Skills & Competencies Section */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Skills & Competencies
                      </label>
                      <button
                        type="button"
                        onClick={addSkill}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FaPlus className="mr-2" /> Add Skill
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {skills.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                          <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <div className="relative">
                                <FaTools className="absolute left-3 top-3 text-gray-400" />
                                <input
                                  type="text"
                                  value={skill.name}
                                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                                  placeholder="e.g. JavaScript, Project Management, etc."
                                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>
                            <div>
                              <select
                                value={skill.level}
                                onChange={(e) => handleSkillChange(index, 'level', e.target.value as any)}
                                className="w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
                              </select>
                            </div>
                          </div>
                          {skills.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="p-2 rounded-full text-red-600 hover:bg-red-100"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Education Section */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Education
                      </label>
                      <button
                        type="button"
                        onClick={addEducation}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FaPlus className="mr-2" /> Add Education
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {educationEntries.map((education, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 relative shadow-sm">
                          {educationEntries.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeEducation(index)}
                              className="absolute top-3 right-3 p-2 rounded-full text-red-600 hover:bg-red-100"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                              <div className="relative">
                                <FaUniversity className="absolute left-3 top-3 text-gray-400" />
                                <input
                                  type="text"
                                  value={education.school}
                                  onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                                  placeholder="e.g. University of Cape Town"
                                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                              <div className="relative">
                                <FaGraduationCap className="absolute left-3 top-3 text-gray-400" />
                                <input
                                  type="text"
                                  value={education.degree}
                                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                  placeholder="e.g. Bachelor of Science in Computer Science"
                                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                              <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                                <input
                                  type="date"
                                  value={education.startDate}
                                  onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                              <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                                <input
                                  type="date"
                                  value={education.endDate}
                                  onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                                  disabled={education.current}
                                  className={`w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${education.current ? 'bg-gray-100' : ''}`}
                                />
                              </div>
                              <div className="mt-2">
                                <label className="inline-flex items-center text-sm text-gray-600">
                                  <input
                                    type="checkbox"
                                    checked={education.current || false}
                                    onChange={() => handleEducationChange(index, 'current', null)}
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mr-2"
                                  />
                                  I am currently studying here
                                </label>
                              </div>
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                value={education.description || ''}
                                onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                                rows={3}
                                placeholder="Describe your studies, achievements, and relevant coursework..."
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Certifications Section */}
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Certifications & Licenses
                      </label>
                      <button
                        type="button"
                        onClick={addCertification}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <FaPlus className="mr-2" /> Add Certification
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {certifications.map((certification, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 relative shadow-sm">
                          {certifications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeCertification(index)}
                              className="absolute top-3 right-3 p-2 rounded-full text-red-600 hover:bg-red-100"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                              <div className="relative">
                                <FaCertificate className="absolute left-3 top-3 text-gray-400" />
                                <input
                                  type="text"
                                  value={certification.name}
                                  onChange={(e) => handleCertificationChange(index, 'name', e.target.value)}
                                  placeholder="e.g. AWS Certified Solutions Architect"
                                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                              <div className="relative">
                                <FaUniversity className="absolute left-3 top-3 text-gray-400" />
                                <input
                                  type="text"
                                  value={certification.issuer}
                                  onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                                  placeholder="e.g. Amazon Web Services"
                                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Date Issued</label>
                              <div className="relative">
                                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                                <input
                                  type="date"
                                  value={certification.date || ''}
                                  onChange={(e) => handleCertificationChange(index, 'date', e.target.value)}
                                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>
                            
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                value={certification.description || ''}
                                onChange={(e) => handleCertificationChange(index, 'description', e.target.value)}
                                rows={3}
                                placeholder="Describe what this certification demonstrates or any relevant details..."
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {selectedIndustry && (
                    <div className="mt-6 p-6 bg-indigo-50 rounded-lg border border-indigo-100">
                      <h4 className="font-medium text-indigo-700 mb-3">Recommended Sections for {selectedIndustry.name}</h4>
                      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                        {selectedIndustry.sections.map((section, index) => (
                          <li key={index}>{section}</li>
                        ))}
                      </ul>
                      <p className="mt-4 text-sm text-gray-500">
                        These sections will be added as recommendations to your resume. You can edit them in the resume builder.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {step === 3 ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Create Resume
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goToStep(step + 1)}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Next
              </button>
            )}
            {step > 1 && (
              <button
                type="button"
                onClick={() => goToStep(step - 1)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 