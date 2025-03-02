import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { ResumeData } from '../types/resume';

// Extended resume type with metadata
export interface SavedResume {
  id: string;
  name: string;
  data: ResumeData;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  templateId: string;
  colorThemeId: string;
}

// Save a new resume
export const saveResume = async (
  userId: string, 
  name: string, 
  resumeData: ResumeData, 
  templateId: string, 
  colorThemeId: string
): Promise<string> => {
  try {
    const resumeRef = await addDoc(collection(db, 'resumes'), {
      name,
      data: resumeData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      templateId,
      colorThemeId
    });
    return resumeRef.id;
  } catch (error) {
    console.error('Error saving resume:', error);
    throw error;
  }
};

// Get a resume by ID
export const getResume = async (resumeId: string): Promise<SavedResume | null> => {
  try {
    const resumeDoc = await getDoc(doc(db, 'resumes', resumeId));
    if (resumeDoc.exists()) {
      return { id: resumeDoc.id, ...resumeDoc.data() } as SavedResume;
    }
    return null;
  } catch (error) {
    console.error('Error getting resume:', error);
    throw error;
  }
};

// Get all resumes for a user
export const getUserResumes = async (userId: string): Promise<SavedResume[]> => {
  try {
    const resumesQuery = query(collection(db, 'resumes'), where('userId', '==', userId));
    const resumeSnapshot = await getDocs(resumesQuery);
    return resumeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedResume));
  } catch (error) {
    console.error('Error getting user resumes:', error);
    throw error;
  }
};

// Update an existing resume
export const updateResume = async (
  resumeId: string, 
  updates: {
    name?: string;
    data?: ResumeData;
    templateId?: string;
    colorThemeId?: string;
  }
): Promise<void> => {
  try {
    const resumeRef = doc(db, 'resumes', resumeId);
    await updateDoc(resumeRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
};

// Delete a resume
export const deleteResume = async (resumeId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'resumes', resumeId));
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
}; 