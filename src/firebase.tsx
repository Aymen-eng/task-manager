// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth"; 
import { getDatabase } from "firebase/database";
// Update this line
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCntDOstH2dyl0iX6d9UIyicriHHQDwvak",
  authDomain: "auth-test-6b447.firebaseapp.com",
  projectId: "auth-test-6b447",
  storageBucket: "auth-test-6b447.appspot.com",
  messagingSenderId: "1072028333932",
  appId: "1:1072028333932:web:a81b49bc1f23ff4b8aa549"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app); // Update this line
export const database = getDatabase(app);
export default app;