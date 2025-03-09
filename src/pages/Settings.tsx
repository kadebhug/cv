import { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaSignature, FaUser } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { SignatureCanvas } from '../components/SignatureCanvas';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Load user settings from Firestore
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.signature) {
            setSignature(userData.signature);
          }
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserSettings();
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
      
      setSignature(signatureDataUrl);
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving signature:', error);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className={`min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Customize your experience and manage your account settings
          </p>
        </div>
        
        {/* Theme Toggle Section */}
        <div className={`mb-8 p-6 rounded-lg shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                {theme === 'dark' ? (
                  <FaMoon className="h-6 w-6 text-indigo-300" />
                ) : (
                  <FaSun className="h-6 w-6 text-indigo-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-1">Appearance</h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Toggle between light and dark mode
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        
        {/* Signature Section */}
        <div className={`p-6 rounded-lg shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center mb-6">
            <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
              <FaSignature className={`h-6 w-6 ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Signature</h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Draw your signature to use in cover letters
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <>
              <SignatureCanvas onSave={saveSignature} initialSignature={signature || undefined} />
              
              {saveSuccess && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                  Signature saved successfully!
                </div>
              )}
              
              {signature && (
                <div className="mt-6">
                  <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    Current Signature
                  </h3>
                  <div className={`border rounded-lg p-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-700' : 'border-gray-200'}`}>
                    <img src={signature} alt="Your signature" className="max-h-20" />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 