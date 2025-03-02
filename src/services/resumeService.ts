import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ResumeData } from '../types/resume';

/**
 * Get a resume by ID
 * @param resumeId The ID of the resume to get
 * @param userId The ID of the user who owns the resume
 * @returns The resume data or null if not found
 */
export const getResumeById = async (resumeId: string, userId: string): Promise<ResumeData | null> => {
  try {
    const resumeRef = doc(db, 'resumes', resumeId);
    const resumeSnap = await getDoc(resumeRef);
    
    if (!resumeSnap.exists()) {
      return null;
    }
    
    const resumeData = resumeSnap.data() as ResumeData;
    
    // Verify that the resume belongs to the user
    if (resumeData.userId !== userId) {
      console.error('Resume does not belong to the user');
      return null;
    }
    
    return {
      id: resumeSnap.id,
      ...resumeData
    };
  } catch (error) {
    console.error('Error getting resume:', error);
    throw error;
  }
};

/**
 * Get all resumes for a user
 * @param userId The ID of the user
 * @returns An array of resume data
 */
export const getUserResumes = async (userId: string): Promise<ResumeData[]> => {
  try {
    const resumesRef = collection(db, 'resumes');
    const q = query(resumesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const resumes: ResumeData[] = [];
    querySnapshot.forEach((doc) => {
      resumes.push({
        id: doc.id,
        ...(doc.data() as ResumeData)
      });
    });
    
    return resumes;
  } catch (error) {
    console.error('Error getting user resumes:', error);
    throw error;
  }
};

/**
 * Create a new resume
 * @param resumeData The resume data to create
 * @param userId The ID of the user who owns the resume
 * @returns The ID of the created resume
 */
export const createResume = async (resumeData: ResumeData, userId: string): Promise<string> => {
  try {
    const resumesRef = collection(db, 'resumes');
    const docRef = await addDoc(resumesRef, {
      ...resumeData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
};

/**
 * Update an existing resume
 * @param resumeId The ID of the resume to update
 * @param resumeData The updated resume data
 * @param userId The ID of the user who owns the resume
 */
export const updateResume = async (resumeId: string, resumeData: Partial<ResumeData>, userId: string): Promise<void> => {
  try {
    // First verify that the resume belongs to the user
    const existingResume = await getResumeById(resumeId, userId);
    
    if (!existingResume) {
      throw new Error('Resume not found or does not belong to the user');
    }
    
    const resumeRef = doc(db, 'resumes', resumeId);
    await updateDoc(resumeRef, {
      ...resumeData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
};

/**
 * Delete a resume
 * @param resumeId The ID of the resume to delete
 * @param userId The ID of the user who owns the resume
 */
export const deleteResume = async (resumeId: string, userId: string): Promise<void> => {
  try {
    // First verify that the resume belongs to the user
    const existingResume = await getResumeById(resumeId, userId);
    
    if (!existingResume) {
      throw new Error('Resume not found or does not belong to the user');
    }
    
    const resumeRef = doc(db, 'resumes', resumeId);
    await deleteDoc(resumeRef);
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
}; 