import { useState, useEffect } from 'react';
import { FaTimes, FaDownload, FaSpinner } from 'react-icons/fa';
import { getCoverLetter } from '../services/coverLetterService';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

interface CoverLetterPreviewModalProps {
  coverId: string;
  onClose: () => void;
}

interface CoverLetterData {
  id?: string;
  name: string;
  recipientName: string;
  recipientCompany: string;
  recipientAddress?: string;
  position: string;
  introduction: string;
  body: string;
  conclusion: string;
  signature: string;
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
});

// PDF Document component
const CoverLetterPDF = ({ coverLetter, formattedDate }: { coverLetter: CoverLetterData, formattedDate: string }) => {
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
    const parts = signature.split(',');
    return {
      name: parts.length > 1 ? parts[1].trim() : parts[0].trim(),
      position: parts.length > 1 ? parts[0].trim() : 'Professional'
    };
  };

  const { name, position } = extractNameAndPosition(coverLetter.signature);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sender Information */}
        <View style={styles.header}>
          <Text style={styles.senderName}>{name.toUpperCase()}</Text>
          <Text style={styles.contactInfo}>123 Your Street, City, State ZIP • (555) 123-4567 • your.email@example.com</Text>
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
          {coverLetter.recipientAddress && <Text>{coverLetter.recipientAddress}</Text>}
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

        {/* Closing */}
        <View style={styles.closing}>
          <Text>Sincerely,</Text>
          <Text style={styles.signature}>{name}</Text>
          <Text style={styles.enclosure}>Enclosure: Resume</Text>
        </View>
      </Page>
    </Document>
  );
};

export function CoverLetterPreviewModal({ coverId, onClose }: CoverLetterPreviewModalProps) {
  const [coverLetter, setCoverLetter] = useState<CoverLetterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    const loadCoverLetter = async () => {
      try {
        setLoading(true);
        const data = await getCoverLetter(coverId);
        setCoverLetter(data);
      } catch (error) {
        console.error('Error loading cover letter:', error);
        setError('Failed to load cover letter. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCoverLetter();
  }, [coverId]);

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
        <CoverLetterPDF coverLetter={coverLetter} formattedDate={formattedDate} />
      ).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${coverLetter.name.replace(/\s+/g, '_')}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Extract name from signature
  const extractName = (signature: string) => {
    if (!signature) return '[Your Name]';
    const parts = signature.split(',');
    return parts.length > 1 ? parts[1].trim() : parts[0].trim();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            {loading ? 'Loading Cover Letter...' : coverLetter?.name || 'Cover Letter Preview'}
          </h2>
          <div className="flex space-x-2">
            <button
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <FaTimes />
            </button>
          </div>
        </div>
        
        <div className="overflow-auto flex-1 p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <FaSpinner className="animate-spin h-8 w-8 text-indigo-600 mb-4" />
              <p className="text-gray-600">Loading cover letter...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          ) : coverLetter ? (
            <div className="max-w-3xl mx-auto p-8 border border-gray-200 bg-white shadow-sm">
              {/* Preview of the cover letter in HTML format */}
              <div className="mb-8 pb-4 border-b border-gray-200">
                <h1 className="text-2xl font-bold uppercase text-gray-800">{extractName(coverLetter.signature)}</h1>
                <p className="text-sm text-gray-600">123 Your Street, City, State ZIP • (555) 123-4567 • your.email@example.com</p>
              </div>

              <div className="mb-6 text-right">
                <p>{formattedDate}</p>
              </div>

              <div className="mb-6">
                <p className="font-medium">{coverLetter.recipientName}</p>
                <p>{coverLetter.position}</p>
                <p>{coverLetter.recipientCompany}</p>
                {coverLetter.recipientAddress && <p>{coverLetter.recipientAddress}</p>}
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
                  <p className="font-semibold text-gray-800">{extractName(coverLetter.signature)}</p>
                </div>
                <p className="text-sm text-gray-600 italic">Enclosure: Resume</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No cover letter found.</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
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