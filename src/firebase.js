// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

console.log('Firebase Config Values:');
console.log('apiKey:', process.env.REACT_APP_apiKey);
console.log('authDomain:', process.env.REACT_APP_authDomain);
console.log('projectId:', process.env.REACT_APP_projectId);
console.log('storageBucket:', process.env.REACT_APP_storageBucket);
console.log('messagingSenderId:', process.env.REACT_APP_messagingSenderId);
console.log('appId:', process.env.REACT_APP_appId);
console.log('measurementId:', process.env.REACT_APP_measurementId);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
  measurementId: process.env.REACT_APP_measurementId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);