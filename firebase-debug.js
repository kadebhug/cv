// This file can be used to test Firebase connectivity
// Run this file with Node.js to check if Firebase is configured correctly
// 
// IMPORTANT: Before running this script:
// 1. Create a test user in Firebase Authentication (in the Firebase Console)
// 2. Replace 'test@example.com' and 'password' below with your test user credentials
// 3. Run the script with: node firebase-debug.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD21P6mtlRjSd0mlqGaiCWhZ4aabfRHcho",
  authDomain: "resume-4c646.firebaseapp.com",
  projectId: "resume-4c646",
  storageBucket: "resume-4c646.firebasestorage.app",
  messagingSenderId: "26004209308",
  appId: "1:26004209308:web:f3afb915c5506783c73759",
  measurementId: "G-H6183N5DQX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Test authentication
async function testAuth() {
  try {
    console.log('Testing authentication...');
    // Replace with your test email and password
    const userCredential = await signInWithEmailAndPassword(auth, 'test@example.com', 'password');
    console.log('Authentication successful:', userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Authentication error:', error.code, error.message);
    return null;
  }
}

// Test Firestore
async function testFirestore(userId) {
  try {
    console.log('Testing Firestore...');
    console.log('Checking if the "resumes" collection exists...');
    
    const querySnapshot = await getDocs(collection(db, 'resumes'));
    console.log(`Found ${querySnapshot.size} documents in 'resumes' collection`);
    
    if (querySnapshot.size === 0) {
      console.log('The "resumes" collection exists but is empty.');
      console.log('This is normal if you haven\'t created any resumes yet.');
    } else {
      querySnapshot.forEach((doc) => {
        console.log(`Document ID: ${doc.id}`);
        console.log('Document data:', doc.data());
      });
    }
  } catch (error) {
    console.error('Firestore error:', error);
    console.error('This might indicate that the Firestore database has not been created yet.');
    console.error('Please create a Firestore database in the Firebase Console.');
  }
}

// Run tests
async function runTests() {
  console.log('Starting Firebase connectivity tests...');
  console.log('Firebase config:', {
    ...firebaseConfig,
    apiKey: '***' // Hide API key in logs
  });
  
  const user = await testAuth();
  if (user) {
    await testFirestore(user.uid);
  } else {
    console.log('Skipping Firestore tests because authentication failed.');
    console.log('Please check your test user credentials.');
  }
  console.log('Tests completed');
}

runTests(); 