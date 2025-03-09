import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaBuilding, FaLinkedin, FaExternalLinkAlt, FaRegClock, FaHistory } from 'react-icons/fa';
import { searchIndeedJobs, getJobRecommendations, applyToJob } from '../services/jobPlatformService';
import { ResumeData } from '../types/resume';
import { ApplicationHistory } from './ApplicationHistory';

interface JobSearchProps {
  resumeData: ResumeData;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  datePosted: string;
  platform: 'indeed' | 'zipRecruiter';
  salary?: string;
  jobType?: string;
}

export function JobSearch({ resumeData }: JobSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'recommended' | 'history'>('recommended');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [userId, setUserId] = useState('user123'); // In a real app, this would come from authentication

  // Load recommended jobs based on resume data
  useEffect(() => {
    if (resumeData.personal?.jobTitle) {
      loadRecommendedJobs();
    }
  }, [resumeData]);

  const loadRecommendedJobs = async () => {
    try {
      setIsLoading(true);
      const recommendations = await getJobRecommendations(resumeData);
      setRecommendedJobs(recommendations as Job[]);
    } catch (error) {
      console.error('Error loading job recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      setIsLoading(true);
      setActiveTab('search');
      const results = await searchIndeedJobs(searchQuery, location);
      
      // Results are already in the correct format, but we need to ensure the type is correct
      setJobs(results as Job[]);
    } catch (error) {
      console.error('Error searching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    
    try {
      setIsApplying(true);
      await applyToJob(
        selectedJob.id,
        selectedJob.platform,
        resumeData,
        coverLetter
      );
      setApplicationStatus('success');
      setTimeout(() => {
        setSelectedJob(null);
        setCoverLetter('');
        setApplicationStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error applying to job:', error);
      setApplicationStatus('error');
    } finally {
      setIsApplying(false);
    }
  };

  const displayedJobs = activeTab === 'recommended' ? recommendedJobs : jobs;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b">
        <div className="flex">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'recommended'
                ? 'text-primary-blue border-b-2 border-primary-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('recommended')}
          >
            <FaBriefcase className="inline-block mr-2" />
            Recommended Jobs
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'search'
                ? 'text-primary-blue border-b-2 border-primary-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('search')}
          >
            <FaSearch className="inline-block mr-2" />
            Search Jobs
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium ${
              activeTab === 'history'
                ? 'text-primary-blue border-b-2 border-primary-blue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory className="inline-block mr-2" />
            Applications
          </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        <ApplicationHistory userId={userId} />
      ) : (
        <div className="p-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Location (city, state, or remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Job Listings */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : displayedJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {activeTab === 'recommended' ? (
                <>
                  <FaBriefcase className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>Complete your resume to get job recommendations</p>
                </>
              ) : (
                <>
                  <FaSearch className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>No jobs found. Try different keywords or location.</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {displayedJobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg text-gray-900">{job.title}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <FaBuilding className="mr-1" size={14} />
                        <span className="mr-3">{job.company}</span>
                        <FaMapMarkerAlt className="mr-1" size={14} />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <FaRegClock className="mr-1" />
                      <span>{job.datePosted}</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">{job.description}</p>
                  <div className="mt-3 flex justify-between items-center">
                    {job.salary && (
                      <span className="text-sm text-gray-600">{job.salary}</span>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(job.url, '_blank');
                        }}
                        className="text-xs flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FaExternalLinkAlt className="mr-1" size={10} />
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                        }}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Job Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-semibold text-gray-800">Apply for Job</h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 border-b">
              <h3 className="font-medium text-lg text-gray-900">{selectedJob.title}</h3>
              <div className="flex items-center text-gray-600 mt-1">
                <FaBuilding className="mr-1" size={14} />
                <span className="mr-3">{selectedJob.company}</span>
                <FaMapMarkerAlt className="mr-1" size={14} />
                <span>{selectedJob.location}</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Your Resume</h4>
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="text-sm">
                    {resumeData.personal?.firstName} {resumeData.personal?.lastName} - {resumeData.personal?.jobTitle}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Your resume will be sent with this application
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block font-medium text-gray-900 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself and explain why you're a good fit for this position..."
                  className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="border-t p-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {applicationStatus === 'success' && (
                  <span className="text-green-600">Application submitted successfully!</span>
                )}
                {applicationStatus === 'error' && (
                  <span className="text-red-600">Error submitting application. Please try again.</span>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="btn btn-secondary flex items-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  disabled={isApplying}
                  className="btn btn-primary flex items-center"
                >
                  {isApplying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 