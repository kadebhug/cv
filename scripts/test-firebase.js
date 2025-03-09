// Script to test Firebase functionality
// Run with: node scripts/test-firebase.js

// Import environment variables from .env file
require('dotenv').config();

// Import the Firebase test functions
const { runTests } = require('../src/services/firebase-test');

console.log('🔥 Starting Firebase tests...');
console.log('Environment:', process.env.NODE_ENV || 'development');

// Check if Firebase config is present
const firebaseConfigPresent = 
  process.env.VITE_FIREBASE_API_KEY && 
  process.env.VITE_FIREBASE_AUTH_DOMAIN &&
  process.env.VITE_FIREBASE_PROJECT_ID;

if (!firebaseConfigPresent) {
  console.error('❌ Firebase configuration is missing. Please check your .env file.');
  process.exit(1);
}

// Run the tests
runTests()
  .then(() => {
    console.log('✅ Tests completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Tests failed:', error);
    process.exit(1);
  }); 