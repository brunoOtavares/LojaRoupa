// Firebase configuration based on firebase_barebones_javascript blueprint
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Trim whitespace from env vars to prevent issues
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY?.trim();
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim();
const appId = import.meta.env.VITE_FIREBASE_APP_ID?.trim();

const firebaseConfig = {
  apiKey,
  authDomain: `${projectId}.firebaseapp.com`,
  projectId,
  storageBucket: `${projectId}.appspot.com`,
  appId,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
