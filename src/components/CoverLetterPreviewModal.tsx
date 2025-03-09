import { useState, useEffect } from 'react';
import { FaTimes, FaDownload, FaSpinner } from 'react-icons/fa';
import { getCoverLetter } from '../services/coverLetterService';
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useTheme } from '../contexts/ThemeContext';

interface CoverLetterPreviewModalProps {
  coverId: string;
  onClose: () => void;
}

interface CoverLetterData {
  id?: string;
  name: string;
  recipientName: string;
  recipientCompany: string;
  position: string;
  introduction: string;
  body: string;
  conclusion: string;
  signature: string;
  address: string;
  phone: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
}

// Define styles for PDF document
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 50,
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    marginBottom: 30,
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: 15,
  },
  senderInfo: {
    marginBottom: 30,
  },
  senderName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2c3e50',
  },
  contactInfo: {
    fontSize: 10,
    color: '#555555',
  },
  date: {
    marginBottom: 20,
    textAlign: 'right',
  },
  recipientInfo: {
    marginBottom: 20,
  },
  salutation: {
    marginBottom: 15,
    fontWeight: 'bold',
  },
  paragraph: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    width: 10,
    marginRight: 5,
    color: '#3498db',
  },
  bulletText: {
    flex: 1,
  },
  closing: {
    marginTop: 20,
  },
  signature: {
    marginTop: 40,
    marginBottom: 4,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  enclosure: {
    fontSize: 10,
    marginTop: 10,
    fontStyle: 'italic',
    color: '#555555',
  },
  signatureImage: {
    marginTop: 40,
    marginBottom: 4,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
});

// PDF Document component
const CoverLetterPDF = ({ coverLetter, formattedDate, userSignature }: { 
  coverLetter: CoverLetterData, 
  formattedDate: string,
  userSignature?: string | null
}) => {
  // Split body text into paragraphs and identify bullet points
  const bodyParagraphs = coverLetter.body.split('\n').map(paragraph => {
    // Check if paragraph starts with a bullet point marker
    if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-') || paragraph.trim().startsWith('*')) {
      return { type: 'bullet', text: paragraph.trim().substring(1).trim() };
    }
    return { type: 'paragraph', text: paragraph };
  });

  // Extract name and position from signature
  const extractNameAndPosition = (signature: string) => {
    if (!signature) return { name: '[Your Name]', position: 'Professional' };
    
    // Check if signature is a data URL (image)
    if (signature.startsWith('data:image')) {
      // For image signatures, use the cover letter name as the signer's name
      return {
        name: coverLetter.name || '[Your Name]',
        position: coverLetter.position || 'Professional'
      };
    }
    
    // For text signatures, parse as before
    const parts = signature.split(',');
    return {
      name: parts.length > 1 ? parts[1].trim() : parts[0].trim(),
      position: parts.length > 1 ? parts[0].trim() : 'Professional'
    };
  };

  const { name, position } = extractNameAndPosition(coverLetter.signature);

  // Safely check if userSignature is a valid image data URL
  const isValidImageSignature = userSignature && 
    typeof userSignature === 'string' && 
    userSignature.startsWith('data:image');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sender Information */}
        <View style={styles.header}>
          <Text style={styles.senderName}>{name.toUpperCase()}</Text>
          <Text style={styles.contactInfo}>
            {coverLetter.address} • {coverLetter.phone} • {coverLetter.email}
          </Text>
        </View>

        {/* Date */}
        <View style={styles.date}>
          <Text>{formattedDate}</Text>
        </View>

        {/* Recipient Information */}
        <View style={styles.recipientInfo}>
          <Text>{coverLetter.recipientName}</Text>
          <Text>{coverLetter.position}</Text>
          <Text>{coverLetter.recipientCompany}</Text>
        </View>

        {/* Salutation */}
        <View style={styles.salutation}>
          <Text>Dear {coverLetter.recipientName},</Text>
        </View>

        {/* Introduction */}
        <View style={styles.paragraph}>
          <Text>{coverLetter.introduction}</Text>
        </View>

        {/* Body paragraphs */}
        {bodyParagraphs.map((item, index) => (
          item.type === 'bullet' ? (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{item.text}</Text>
            </View>
          ) : (
            <View key={index} style={styles.paragraph}>
              <Text>{item.text}</Text>
            </View>
          )
        ))}

        {/* Conclusion */}
        <View style={styles.paragraph}>
          <Text>{coverLetter.conclusion}</Text>
        </View>

        {/* Signature */}
        <View style={styles.closing}>
          <Text>Sincerely,</Text>
          {isValidImageSignature ? (
            <View style={styles.signatureImage}>
              <Image src={userSignature} style={{ width: 150, height: 50 }} />
            </View>
          ) : (
            <Text style={styles.signature}>{name}</Text>
          )}
          <Text style={styles.enclosure}>Enclosure: Resume</Text>
        </View>
      </Page>
    </Document>
  );
};

export function CoverLetterPreviewModal({ coverId, onClose }: CoverLetterPreviewModalProps) {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [coverLetter, setCoverLetter] = useState<CoverLetterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [userSignature, setUserSignature] = useState<string | null>(null);

  useEffect(() => {
    const loadCoverLetter = async () => {
      try {
        setLoading(true);
        const data = await getCoverLetter(coverId);
        
        // Ensure data has all required fields, add defaults if missing
        if (data) {
          // Add default values for contact fields if they don't exist
          // This handles backward compatibility with existing cover letters
          const completeData = {
            ...data,
            address: data.address || '123 Your Street, City, Country, Zip Code',
            phone: data.phone || '(+27) 12-345-6789',
            email: data.email || 'email@example.com'
          };
          setCoverLetter(completeData);
          
          // Check if the signature field contains an image URL
          if (data.signature && data.signature.startsWith('data:image')) {
            setUserSignature(data.signature);
          } else {
            // If not, try to load the user's signature from Firestore
            loadUserSignature();
          }
        }
      } catch (error) {
        console.error('Error loading cover letter:', error);
        setError('Failed to load cover letter. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCoverLetter();
  }, [coverId]);

  // Load user's signature from Firestore
  const loadUserSignature = async () => {
    if (!currentUser) return;
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.signature) {
          setUserSignature(userData.signature);
        }
      }
    } catch (error) {
      console.error('Error loading user signature:', error);
    }
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Format the current date
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Handle PDF download
  const handleDownloadPDF = async () => {
    if (!coverLetter) return;

    try {
      setGeneratingPDF(true);
      
      // Create PDF blob
      const blob = await pdf(
        <CoverLetterPDF 
          coverLetter={coverLetter} 
          formattedDate={formattedDate}
          userSignature={userSignature}
        />
      ).toBlob();
      
      // Create a simple, clean filename that doesn't include any potentially problematic data
      // Format: CoverLetter_CompanyName_Position.pdf
      
      // Safely extract and clean company name
      let cleanCompanyName = '';
      try {
        cleanCompanyName = coverLetter.recipientCompany
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '_')
          .substring(0, 30); // Limit length
      } catch (e) {
        console.error('Error cleaning company name:', e);
      }
      
      // Safely extract and clean position
      let cleanPosition = '';
      try {
        cleanPosition = coverLetter.position
          .replace(/[^\w\s-]/g, '')
          .trim()
          .replace(/\s+/g, '_')
          .substring(0, 30); // Limit length
      } catch (e) {
        console.error('Error cleaning position:', e);
      }
      
      // Create a descriptive filename
      let filename = 'Cover_Letter';
      
      // Add company name if available and valid
      if (cleanCompanyName && cleanCompanyName.length > 0) {
        filename += `_${cleanCompanyName}`;
      }
      
      // Add position if available and valid
      if (cleanPosition && cleanPosition.length > 0) {
        filename += `_${cleanPosition}`;
      }
      
      // Add date to ensure uniqueness
      const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      filename += `_${dateStr}`;
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Extract name from signature
  const extractName = (signature: string) => {
    // If the signature is an image URL, extract the name from the cover letter data
    if (signature && signature.startsWith('data:image')) {
      return coverLetter?.name?.split(' ')[0] || '[Your Name]';
    }
    
    // Otherwise, extract from text signature
    if (!signature) return '[Your Name]';
    const parts = signature.split(',');
    return parts.length > 1 ? parts[1].trim() : parts[0].trim();
  };

  // Safely check if userSignature is a valid image data URL
  const isValidImageSignature = userSignature && 
    typeof userSignature === 'string' && 
    userSignature.startsWith('data:image');

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 ${theme === 'dark' ? 'dark' : ''}`}
      onClick={handleBackdropClick}
    >
      <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col`}>
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} flex justify-between items-center`}>
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            {loading ? 'Loading Cover Letter...' : coverLetter?.name || 'Cover Letter Preview'}
          </h2>
          <div className="flex space-x-2">
            <button
              className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        <div className="overflow-auto flex-1 p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <FaSpinner className={`animate-spin h-8 w-8 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} mb-4`} />
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading cover letter...</p>
            </div>
          ) : error ? (
            <div className={`${theme === 'dark' ? 'bg-red-900 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-700'} p-4 rounded-lg border`}>
              {error}
            </div>
          ) : coverLetter ? (
            <div className={`max-w-3xl mx-auto p-8 border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} shadow-sm`}>
              {/* Preview of the cover letter in HTML format */}
              <div className="mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold uppercase text-gray-800">{extractName(coverLetter.signature)}</h1>
                <p className="text-sm text-gray-600">
                  {coverLetter.address} • {coverLetter.phone} • {coverLetter.email}
                </p>
              </div>

              <div className="mb-6 text-right">
                <p>{formattedDate}</p>
              </div>

              <div className="mb-6">
                <p className="font-medium">{coverLetter.recipientName}</p>
                <p>{coverLetter.position}</p>
                <p>{coverLetter.recipientCompany}</p>
              </div>

              <div className="mb-4">
                <p className="font-semibold">Dear {coverLetter.recipientName},</p>
              </div>

              <div className="mb-4">
                <p className="mb-3 text-justify">{coverLetter.introduction}</p>
                
                <div className="mb-3">
                  {coverLetter.body.split('\n').map((paragraph, index) => {
                    // Check if paragraph starts with a bullet point marker
                    if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-') || paragraph.trim().startsWith('*')) {
                      return (
                        <div key={index} className="flex mb-2">
                          <span className="mr-2 text-blue-500">•</span>
                          <span className="text-justify">{paragraph.trim().substring(1).trim()}</span>
                        </div>
                      );
                    }
                    return <p key={index} className="mb-3 text-justify">{paragraph}</p>;
                  })}
                </div>
                
                <p className="mb-3 text-justify">{coverLetter.conclusion}</p>
              </div>

              <div className="mt-8">
                <p>Sincerely,</p>
                <div className="mt-10 mb-1">
                  {isValidImageSignature ? (
                    <img src={userSignature} alt="Your signature" className="max-h-16" />
                  ) : (
                    <p className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
                      {extractName(coverLetter.signature)}
                    </p>
                  )}
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} italic`}>
                  Enclosure: Resume
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No cover letter found.</p>
            </div>
          )}
        </div>
        
        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} flex justify-end`}>
          <button
            onClick={handleDownloadPDF}
            className={`px-4 py-2 ${theme === 'dark' ? 'bg-indigo-700 hover:bg-indigo-800' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg transition-colors flex items-center`}
            disabled={loading || !coverLetter || generatingPDF}
          >
            {generatingPDF ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Generating PDF...
              </>
            ) : (
              <>
                <FaDownload className="mr-2" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 