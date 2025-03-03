// This file can be used to test Firebase Firestore connectivity
// Run this file with Node.js to check if your Firestore database exists
// Run with: node firebase-db-check.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// Firebase config from your .env file
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
console.log('Initializing Firebase...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test Firestore connection
async function testFirestore() {
  try {
    console.log('Testing Firestore connection...');
    console.log('Attempting to access the "resumes" collection...');
    
    const querySnapshot = await getDocs(collection(db, 'resumes'));
    console.log('✅ SUCCESS: Firestore database exists and is accessible!');
    console.log(`Found ${querySnapshot.size} documents in 'resumes' collection`);
    
    return true;
  } catch (error) {
    console.error('❌ ERROR: Could not access Firestore database:', error);
    console.error('\nPossible causes:');
    console.error('1. The Firestore database has not been created yet in the Firebase Console');
    console.error('2. The Firebase project ID is incorrect');
    console.error('3. The Firebase API key is incorrect or restricted');
    console.error('\nSolution:');
    console.error('1. Go to the Firebase Console: https://console.firebase.google.com/');
    console.error('2. Select your project: resume-4c646');
    console.error('3. Click on "Firestore Database" in the left sidebar');
    console.error('4. Click "Create database"');
    console.error('5. Choose either "Start in production mode" or "Start in test mode"');
    console.error('6. Select a location for your database');
    console.error('7. Click "Enable"');
    
    return false;
  }
}

// Run test
testFirestore().then(success => {
  if (success) {
    console.log('\nYour Firestore database is set up correctly!');
    console.log('You should now be able to use the dashboard in your application.');
  } else {
    console.log('\nPlease create your Firestore database and try again.');
  }
}); 