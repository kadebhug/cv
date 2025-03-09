// Firebase test script
// Run this script to test Firestore functionality

import { db } from './firebase.js';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';

const COLLECTION_NAME = 'coverLetters';
const TEST_USER_ID = 'test-user-123';

/**
 * Test creating a cover letter in Firestore
 */
const testCreateCoverLetter = async () => {
  console.log('Testing creating a cover letter...');
  
  try {
    const testData = {
      name: 'Test Cover Letter',
      recipientName: 'John Doe',
      recipientCompany: 'Test Company',
      position: 'Software Engineer',
      introduction: 'This is a test introduction.',
      body: 'This is a test body.',
      conclusion: 'This is a test conclusion.',
      signature: 'Sincerely, Test User',
      userId: TEST_USER_ID,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, COLLECTION_NAME), testData);
    console.log('✅ Test cover letter created with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating test cover letter:', error);
    throw error;
  }
};

/**
 * Test retrieving cover letters for a user
 */
const testGetUserCoverLetters = async () => {
  console.log('Testing retrieving cover letters...');
  
  try {
    const coverLettersQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', TEST_USER_ID)
    );
    
    const querySnapshot = await getDocs(coverLettersQuery);
    console.log(`✅ Found ${querySnapshot.size} test cover letters`);
    
    querySnapshot.forEach((docSnapshot) => {
      console.log('Cover letter:', {
        id: docSnapshot.id,
        ...docSnapshot.data()
      });
    });
    
    return querySnapshot;
  } catch (error) {
    console.error('❌ Error retrieving test cover letters:', error);
    throw error;
  }
};

/**
 * Test cleaning up test data
 */
const testCleanup = async () => {
  console.log('Cleaning up test data...');
  
  try {
    const coverLettersQuery = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', TEST_USER_ID)
    );
    
    const querySnapshot = await getDocs(coverLettersQuery);
    
    const deletePromises = [];
    querySnapshot.forEach((docSnapshot) => {
      console.log('Deleting test cover letter:', docSnapshot.id);
      deletePromises.push(deleteDoc(doc(db, COLLECTION_NAME, docSnapshot.id)));
    });
    
    await Promise.all(deletePromises);
    console.log(`✅ Deleted ${deletePromises.length} test cover letters`);
  } catch (error) {
    console.error('❌ Error cleaning up test cover letters:', error);
    throw error;
  }
};

/**
 * Run all tests
 */
const runTests = async () => {
  console.log('🔥 Starting Firestore cover letter tests...');
  
  try {
    // Create a test cover letter
    const coverId = await testCreateCoverLetter();
    
    // Get test cover letters
    await testGetUserCoverLetters();
    
    // Clean up test data
    await testCleanup();
    
    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('❌ Tests failed:', error);
  }
};

// Run the tests if this file is executed directly
if (typeof process !== 'undefined' && process.argv[1] === import.meta.url) {
  runTests();
}

// Export for use in Node.js environment
export {
  testCreateCoverLetter,
  testGetUserCoverLetters,
  testCleanup,
  runTests
}; 