import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBv8uYSlZHS7s6E46YFhivMUHHvJdNsS4M",
  authDomain: "loveable-soil-agent.firebaseapp.com",
  projectId: "loveable-soil-agent",
  storageBucket: "loveable-soil-agent.firebasestorage.app",
  messagingSenderId: "274134397770",
  appId: "1:274134397770:web:540611748bf6e9f0e447b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
