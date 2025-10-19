// Firebase configuration based on firebase_barebones_javascript blueprint
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "michel-multimarcas.firebaseapp.com",
  projectId: "michel-multimarcas",
  storageBucket: "michel-multimarcas.firebasestorage.app",
  messagingSenderId: "918302799335",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-59SCHV89DT"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
