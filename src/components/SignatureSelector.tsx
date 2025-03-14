import { useState, useEffect } from 'react';
import { FaPen, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SignatureCanvas } from './SignatureCanvas';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

interface SignatureSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function SignatureSelector({ value, onChange }: SignatureSelectorProps) {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [showDrawer, setShowDrawer] = useState(false);
  const [userSignature, setUserSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load user's signature from Firestore
  useEffect(() => {
    const loadUserSignature = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    
    loadUserSignature();
  }, [currentUser]);

  // Save signature to Firestore
  const saveSignature = async (signatureDataUrl: string) => {
    if (!currentUser) return;
    
    try {
      setSaving(true);
      const userDocRef = doc(db, 'users', currentUser.uid);
      
      // Check if user document exists
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        // Update existing document
        await setDoc(userDocRef, { signature: signatureDataUrl }, { merge: true });
      } else {
        // Create new document
        await setDoc(userDocRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          signature: signatureDataUrl,
          createdAt: new Date()
        });
      }
      
      setUserSignature(signatureDataUrl);
      onChange(signatureDataUrl);
      setShowDrawer(false);
    } catch (error) {
      console.error('Error saving signature:', error);
    } finally {
      setSaving(false);
    }
  };

  // Use saved signature
  const useSignature = () => {
    if (userSignature) {
      onChange(userSignature);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-3">
        <div className={`flex-1 p-4 border rounded-md shadow-sm ${
          theme === 'dark' 
            ? 'border-gray-600 bg-gray-700 focus-within:ring-indigo-500 focus-within:border-indigo-500' 
            : 'border-gray-300 bg-white focus-within:ring-indigo-500 focus-within:border-indigo-500'
        } transition-colors min-h-[80px] flex items-center`}>
          {value ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <img src={value} alt="Your signature" className="max-h-16" />
              </div>
            </div>
          ) : (
            <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'} w-full`}>
              {loading ? (
                <div className="flex items-center justify-center py-3">
                  <FaSpinner className={`animate-spin mr-2 h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : ''}`} />
                  <span className="text-base">Loading signature...</span>
                </div>
              ) : userSignature ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <img src={userSignature} alt="Your signature" className="max-h-16" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-6 text-center">
                  <span className="text-base">No signature selected</span>
                </div>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowDrawer(true)}
          className={`p-3 rounded-md ${
            theme === 'dark' 
              ? 'bg-indigo-700 hover:bg-indigo-600' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm`}
          aria-label="Draw signature"
        >
          <FaPen size={18} />
        </button>
      </div>

      {/* Signature drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Background overlay */}
            <div 
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowDrawer(false)}
            ></div>

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className={`relative w-screen max-w-md ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} shadow-xl`}>
                <div className="h-full flex flex-col py-6 overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <div className="flex items-start justify-between">
                      <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Draw Your Signature
                      </h2>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className={`rounded-md ${
                            theme === 'dark' 
                              ? 'bg-gray-800 text-gray-400 hover:text-gray-300' 
                              : 'bg-white text-gray-400 hover:text-gray-500'
                          } focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2`}
                          onClick={() => setShowDrawer(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <FaTimes className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    <div className={`absolute inset-0 px-4 sm:px-6 ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                      <p className={`mb-5 text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Draw your signature below. This will be saved to your account and can be used in all your cover letters.
                      </p>
                      {saving && (
                        <div className={`mb-5 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} flex items-center`}>
                          <FaSpinner className={`animate-spin mr-3 h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                          <span className={`${theme === 'dark' ? 'text-gray-300' : ''} text-base`}>Saving signature...</span>
                        </div>
                      )}
                      <SignatureCanvas 
                        onSave={saveSignature} 
                        initialSignature={userSignature || undefined} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 