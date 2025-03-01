import React, { useState, useEffect } from 'react';
import { FaHistory, FaBuilding, FaBriefcase, FaCalendarAlt, FaLinkedin, FaExternalLinkAlt, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

interface Application {
  id: string;
  jobId: string;
  platform: 'indeed' | 'zipRecruiter';
  date: string;
  status: 'submitted' | 'viewed' | 'rejected' | 'interview' | 'offer' | 'failed';
  jobTitle: string;
  company: string;
  coverLetter?: string;
}

interface ApplicationHistoryProps {
  userId: string;
}

export function ApplicationHistory({ userId }: ApplicationHistoryProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    if (userId) {
      loadApplicationHistory();
    }
  }, [userId]);

  const loadApplicationHistory = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data
      setApplications(getMockApplications());
    } catch (err) {
      console.error('Error loading application history:', err);
      setError('Failed to load application history');
      // Use mock data for demo
      setApplications(getMockApplications());
    } finally {
      setIsLoading(false);
    }
  };

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'indeed':
        return <FaExternalLinkAlt className="text-blue-500" />;
      case 'zipRecruiter':
        return <FaExternalLinkAlt className="text-green-500" />;
      default:
        return <FaExternalLinkAlt className="text-gray-500" />;
    }
  };

  // Get status icon and color
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'submitted':
        return { icon: <FaCheck />, color: 'text-blue-500', bg: 'bg-blue-100' };
      case 'viewed':
        return { icon: <FaCheck />, color: 'text-purple-500', bg: 'bg-purple-100' };
      case 'interview':
        return { icon: <FaCalendarAlt />, color: 'text-green-500', bg: 'bg-green-100' };
      case 'offer':
        return { icon: <FaCheck />, color: 'text-green-600', bg: 'bg-green-100' };
      case 'rejected':
        return { icon: <FaTimes />, color: 'text-red-500', bg: 'bg-red-100' };
      case 'failed':
        return { icon: <FaTimes />, color: 'text-red-500', bg: 'bg-red-100' };
      default:
        return { icon: <FaSpinner />, color: 'text-gray-500', bg: 'bg-gray-100' };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Mock data for demo purposes
  const getMockApplications = (): Application[] => {
    return [
      {
        id: '1',
        jobId: 'job123',
        platform: 'indeed',
        date: '2023-05-15T10:30:00Z',
        status: 'interview',
        jobTitle: 'Senior Frontend Developer',
        company: 'Tech Innovations Inc.',
      },
      {
        id: '2',
        jobId: 'job456',
        platform: 'indeed',
        date: '2023-05-10T14:45:00Z',
        status: 'submitted',
        jobTitle: 'UX Designer',
        company: 'Creative Solutions LLC',
      },
      {
        id: '3',
        jobId: 'job789',
        platform: 'zipRecruiter',
        date: '2023-05-05T09:15:00Z',
        status: 'rejected',
        jobTitle: 'Product Manager',
        company: 'Software Systems Co.',
      },
      {
        id: '4',
        jobId: 'job101',
        platform: 'indeed',
        date: '2023-04-28T11:20:00Z',
        status: 'viewed',
        jobTitle: 'Full Stack Developer',
        company: 'Web Solutions Inc.',
      },
      {
        id: '5',
        jobId: 'job202',
        platform: 'indeed',
        date: '2023-04-20T16:10:00Z',
        status: 'offer',
        jobTitle: 'Frontend Engineer',
        company: 'Digital Platforms LLC',
      },
    ];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b p-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FaHistory className="mr-2" />
          Application History
        </h3>
        <button
          onClick={loadApplicationHistory}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">
          <p>{error}</p>
          <button
            onClick={loadApplicationHistory}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <FaHistory className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p>You haven't applied to any jobs yet.</p>
          <p className="mt-2 text-sm">
            Start searching for jobs and apply with your resume!
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {applications.map((application) => {
            const statusInfo = getStatusInfo(application.status);
            
            return (
              <div
                key={application.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedApplication(application)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{application.jobTitle}</h4>
                    <div className="flex items-center text-gray-600 mt-1">
                      <FaBuilding className="mr-1" size={14} />
                      <span>{application.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`flex items-center text-xs px-2 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color} mr-2`}>
                      {statusInfo.icon}
                      <span className="ml-1 capitalize">{application.status}</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(application.date)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-1">Applied via</span>
                    {getPlatformIcon(application.platform)}
                    <span className="ml-1 capitalize">{application.platform}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedApplication(application);
                    }}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-semibold text-gray-800">Application Details</h2>
              <button
                onClick={() => setSelectedApplication(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 border-b">
              <h3 className="font-medium text-lg text-gray-900">{selectedApplication.jobTitle}</h3>
              <div className="flex items-center text-gray-600 mt-1">
                <FaBuilding className="mr-1" size={14} />
                <span className="mr-3">{selectedApplication.company}</span>
                <div className="flex items-center">
                  {getPlatformIcon(selectedApplication.platform)}
                  <span className="ml-1 capitalize">{selectedApplication.platform}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Application Date</h4>
                  <p className="text-gray-900">{formatDate(selectedApplication.date)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                  <p className={`inline-flex items-center px-2 py-1 rounded-full ${getStatusInfo(selectedApplication.status).bg} ${getStatusInfo(selectedApplication.status).color}`}>
                    {getStatusInfo(selectedApplication.status).icon}
                    <span className="ml-1 capitalize">{selectedApplication.status}</span>
                  </p>
                </div>
              </div>
              
              {selectedApplication.coverLetter && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Cover Letter</h4>
                  <div className="bg-gray-50 p-3 rounded border text-sm">
                    <p className="whitespace-pre-line">{selectedApplication.coverLetter}</p>
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Application ID</h4>
                <p className="text-xs text-gray-500">{selectedApplication.id}</p>
              </div>
            </div>
            
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 