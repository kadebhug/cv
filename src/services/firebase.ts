// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Debug environment variables
console.log('Environment variables check:');
console.log('VITE_FIREBASE_API_KEY exists:', !!import.meta.env.VITE_FIREBASE_API_KEY);
console.log('VITE_FIREBASE_AUTH_DOMAIN exists:', !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('VITE_FIREBASE_PROJECT_ID exists:', !!import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log('VITE_FIREBASE_STORAGE_BUCKET exists:', !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
console.log('VITE_FIREBASE_MESSAGING_SENDER_ID exists:', !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
console.log('VITE_FIREBASE_APP_ID exists:', !!import.meta.env.VITE_FIREBASE_APP_ID);
console.log('VITE_FIREBASE_MEASUREMENT_ID exists:', !!import.meta.env.VITE_FIREBASE_MEASUREMENT_ID);

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD21P6mtlRjSd0mlqGaiCWhZ4aabfRHcho",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "resume-4c646.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "resume-4c646",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "resume-4c646.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "26004209308",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:26004209308:web:f3afb915c5506783c73759",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-H6183N5DQX",
};

// Check if Firebase config is valid
const isFirebaseConfigValid = () => {
  const requiredFields = [
    'apiKey', 'authDomain', 'projectId', 'storageBucket', 
    'messagingSenderId', 'appId'
  ];
  
  const missingFields = requiredFields.filter(field => 
    !firebaseConfig[field as keyof typeof firebaseConfig]
  );
  
  if (missingFields.length > 0) {
    console.error(`Missing Firebase configuration fields: ${missingFields.join(', ')}`);
    return false;
  }
  
  return true;
};

// Initialize Firebase
console.log('Initializing Firebase with config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? '***' : undefined // Hide API key in logs
});

if (!isFirebaseConfigValid()) {
  console.error('Invalid Firebase configuration. Check your .env file.');
}

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Use emulators in development if needed
// if (import.meta.env.DEV) {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export { app, auth, db, storage }; 