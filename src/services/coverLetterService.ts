import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Enable debug logging
const DEBUG = true;
const logDebug = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[CoverLetterService] ${message}`, data || '');
  }
};

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

const COLLECTION_NAME = 'coverLetters';

// Save or update a cover letter
export const saveCoverLetter = async (coverId: string | undefined, data: CoverLetterData) => {
  try {
    logDebug('Saving cover letter', { coverId, userId: data.userId });
    
    if (coverId) {
      // Update existing cover letter
      const coverLetterRef = doc(db, COLLECTION_NAME, coverId);
      logDebug('Updating existing cover letter', { coverId });
      await updateDoc(coverLetterRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      logDebug('Cover letter updated successfully', { coverId });
      return coverId;
    } else {
      // Create new cover letter
      const coverLetterData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      logDebug('Creating new cover letter', { userId: data.userId });
      const docRef = await addDoc(collection(db, COLLECTION_NAME), coverLetterData);
      logDebug('Cover letter created successfully', { id: docRef.id });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving cover letter:', error);
    throw error;
  }
};

// Get a single cover letter by ID
export const getCoverLetter = async (coverId: string): Promise<CoverLetterData | null> => {
  try {
    logDebug('Getting cover letter', { coverId });
    const coverLetterRef = doc(db, COLLECTION_NAME, coverId);
    const coverLetterSnap = await getDoc(coverLetterRef);
    
    if (coverLetterSnap.exists()) {
      const data = coverLetterSnap.data();
      logDebug('Cover letter found', { coverId });
      // Convert Firestore timestamps to Date objects
      return {
        ...data,
        id: coverId,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as CoverLetterData;
    } else {
      logDebug('No such cover letter', { coverId });
      return null;
    }
  } catch (error) {
    console.error('Error getting cover letter:', error);
    throw error;
  }
};

// Get all cover letters for a user
export const getUserCoverLetters = async (userId: string): Promise<CoverLetterData[]> => {
  try {
    logDebug('Getting cover letters for user', { userId });
    const coverLettersQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(coverLettersQuery);
    const coverLetters: CoverLetterData[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      coverLetters.push({
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      } as CoverLetterData);
    });
    
    logDebug(`Found ${coverLetters.length} cover letters for user`, { userId });
    
    // Sort by updatedAt (newest first)
    return coverLetters.sort((a, b) => {
      const dateA = a.updatedAt ? a.updatedAt.getTime() : 0;
      const dateB = b.updatedAt ? b.updatedAt.getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error getting user cover letters:', error);
    throw error;
  }
};

// Delete a cover letter
export const deleteCoverLetter = async (coverId: string) => {
  try {
    logDebug('Deleting cover letter', { coverId });
    await deleteDoc(doc(db, COLLECTION_NAME, coverId));
    logDebug('Cover letter deleted successfully', { coverId });
  } catch (error) {
    console.error('Error deleting cover letter:', error);
    throw error;
  }
}; 