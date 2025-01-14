// import { initializeApp } from "firebase/app";
// import {getAuth} from 'firebase/auth';
// import {getFirestore} from "firebase/firestore"
// const firebaseConfig = {
//   apiKey: "AIzaSyBGMu7CmQ-xYHjPvb57cVeBR36Bem93jKk",
//   authDomain: "legal-wing-management-system.firebaseapp.com",
//   projectId: "legal-wing-management-system",
//   storageBucket: "legal-wing-management-system.firebasestorage.app",
//   messagingSenderId: "1011277836178",
//   appId: "1:1011277836178:web:74318b8aaf908be7c19b4b"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
 import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDzfLhmlXb7Hi-jx00h4y2-yObbHPV2Kfk",
  authDomain: "rent-management-system-56081.firebaseapp.com",
  projectId: "rent-management-system-56081",
  storageBucket: "rent-management-system-56081.firebasestorage.app",
  messagingSenderId: "971456320578",
  appId: "1:971456320578:web:86de26e62e22fcdee989db",
  measurementId: "G-D9ENG5LXX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
export const db=getFirestore(app);
export {app, auth};
export default app;