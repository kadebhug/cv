import { 
  addDocument, 
  getDocument, 
  updateDocument, 
  deleteDocument, 
  queryDocuments, 
  whereEqual,
  FirestoreDocument
} from './firestoreService';
import { ResumeData } from '../types/resume';
import { Timestamp } from 'firebase/firestore';

const COLLECTION_NAME = 'resumes';

// Convert ResumeData to FirestoreDocument
const toFirestoreDocument = (resumeData: ResumeData): FirestoreDocument => {
  // Create a copy without date fields
  const { createdAt, updatedAt, ...rest } = resumeData;
  
  return {
    ...rest,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
};

// Convert FirestoreDocument to ResumeData
const fromFirestoreDocument = (doc: FirestoreDocument): ResumeData => {
  const { createdAt, updatedAt, ...data } = doc;
  return {
    ...data as ResumeData,
    createdAt: createdAt?.toDate(),
    updatedAt: updatedAt?.toDate(),
  };
};

// Save a new resume
export const saveResume = async (resumeData: ResumeData): Promise<string> => {
  try {
    // Convert to Firestore document
    const firestoreDoc = toFirestoreDocument(resumeData);
    
    return await addDocument(COLLECTION_NAME, firestoreDoc);
  } catch (error) {
    console.error('Error saving resume:', error);
    throw error;
  }
};

// Update an existing resume
export const updateResume = async (resumeId: string, resumeData: Partial<ResumeData>): Promise<void> => {
  try {
    // Remove any Date objects and add Timestamp
    const { createdAt, updatedAt, ...rest } = resumeData;
    
    const firestoreDoc = {
      ...rest,
      updatedAt: Timestamp.now(),
    };
    
    await updateDocument(COLLECTION_NAME, resumeId, firestoreDoc);
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
};

// Get a resume by ID
export const getResume = async (resumeId: string): Promise<ResumeData | null> => {
  try {
    const doc = await getDocument<FirestoreDocument>(COLLECTION_NAME, resumeId);
    return doc ? fromFirestoreDocument(doc) : null;
  } catch (error) {
    console.error('Error getting resume:', error);
    throw error;
  }
};

// Delete a resume
export const deleteResume = async (resumeId: string): Promise<void> => {
  try {
    await deleteDocument(COLLECTION_NAME, resumeId);
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};

// Get all resumes for a user
export const getUserResumes = async (userId: string): Promise<ResumeData[]> => {
  try {
    if (!userId) {
      console.error('Error getting user resumes: userId is undefined or null');
      return [];
    }
    
    const docs = await queryDocuments<FirestoreDocument>(COLLECTION_NAME, [whereEqual('userId', userId)]);
    return docs.map(fromFirestoreDocument);
  } catch (error) {
    console.error('Error getting user resumes:', error);
    // Return empty array instead of throwing to prevent UI crashes
    return [];
  }
}; 