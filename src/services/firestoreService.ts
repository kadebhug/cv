import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  addDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Generic type for Firestore documents
export interface FirestoreDocument {
  id?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  [key: string]: any;
}

// Add a document to a collection with auto-generated ID
export const addDocument = async <T extends FirestoreDocument>(
  collectionName: string,
  data: T
): Promise<string> => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

// Set a document with a specific ID
export const setDocument = async <T extends FirestoreDocument>(
  collectionName: string,
  docId: string,
  data: T
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, {
      ...data,
      createdAt: data.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error setting document in ${collectionName}:`, error);
    throw error;
  }
};

// Get a document by ID
export const getDocument = async <T extends FirestoreDocument>(
  collectionName: string,
  docId: string
): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};

// Update a document
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: Partial<FirestoreDocument>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

// Query documents
export const queryDocuments = async <T extends FirestoreDocument>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
};

// Helper functions for common query constraints
export const whereEqual = (field: string, value: any) => where(field, '==', value);
export const whereGreaterThan = (field: string, value: any) => where(field, '>', value);
export const whereLessThan = (field: string, value: any) => where(field, '<', value);
export const orderByField = (field: string, direction: 'asc' | 'desc' = 'asc') => 
  orderBy(field, direction);
export const limitResults = (limitCount: number) => limit(limitCount); 