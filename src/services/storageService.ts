import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadMetadata
} from 'firebase/storage';
import { storage } from './firebase';

// Upload a file to Firebase Storage
export const uploadFile = async (
  path: string,
  file: File,
  metadata?: UploadMetadata
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Get download URL for a file
export const getFileURL = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

// Delete a file from Firebase Storage
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// List all files in a directory
export const listFiles = async (path: string): Promise<string[]> => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    return result.items.map(item => item.fullPath);
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

// Generate a unique file path for uploads
export const generateFilePath = (
  userId: string,
  folder: string,
  fileName: string
): string => {
  const timestamp = new Date().getTime();
  const extension = fileName.split('.').pop();
  return `users/${userId}/${folder}/${timestamp}-${Math.random().toString(36).substring(2, 9)}.${extension}`;
}; 