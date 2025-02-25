import { ResumeData } from '../types/resume';
import { sampleResumeData } from '../data/sampleResumeData';

/**
 * Merges user data with sample data for preview
 * If a field in userData is empty, it will use the sample data instead
 */
export function mergeWithSampleData(userData: Partial<ResumeData>): ResumeData {
  // Helper function to check if a value is empty
  const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  };

  // Deep merge function that prefers userData over sampleData when userData is not empty
  const deepMerge = (userData: any, sampleData: any): any => {
    // If userData is empty, use sampleData
    if (isEmpty(userData)) return sampleData;
    
    // If userData is not an object or is null, use userData
    if (typeof userData !== 'object' || userData === null) return userData;
    
    // If userData is an array, merge each item with corresponding sample item
    if (Array.isArray(userData)) {
      // If userData array is empty, use sample array
      if (userData.length === 0) return sampleData;
      
      // Otherwise, use userData array (don't merge arrays)
      return userData;
    }
    
    // For objects, merge properties
    const result: any = { ...userData };
    
    // Only process sampleData if it's an object
    if (typeof sampleData === 'object' && sampleData !== null) {
      Object.keys(sampleData).forEach(key => {
        // If key doesn't exist in result or is empty, use sample data
        if (!(key in result) || isEmpty(result[key])) {
          result[key] = sampleData[key];
        } else if (typeof result[key] === 'object' && !Array.isArray(result[key])) {
          // If both are objects (but not arrays), recursively merge
          result[key] = deepMerge(result[key], sampleData[key]);
        }
        // Otherwise, keep the userData value
      });
    }
    
    return result;
  };

  // Merge the userData with sampleResumeData
  return deepMerge(userData, sampleResumeData) as ResumeData;
} 