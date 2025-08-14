import { getApps, initializeApp, getApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClVqWmtbpsp7qEC0j7Vv_kq7dC0nZZMqA",
  authDomain: "ai-interviewapp-352fb.firebaseapp.com",
  projectId: "ai-interviewapp-352fb",
  storageBucket: "ai-interviewapp-352fb.firebasestorage.app",
  messagingSenderId: "695276786606",
  appId: "1:695276786606:web:749d1068d08208725b2e3f",
  measurementId: "G-GLN119YY32"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app)