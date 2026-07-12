// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sahand-estate-50d47.firebaseapp.com",
  projectId: "sahand-estate-50d47",
  storageBucket: "sahand-estate-50d47.firebasestorage.app",
  messagingSenderId: "778453707729",
  appId: "1:778453707729:web:e16e9e1c4feb2940e98ef0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
