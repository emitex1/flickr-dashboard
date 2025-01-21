import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "flickr-dashboard.firebaseapp.com",
  projectId: "flickr-dashboard",
  storageBucket: "flickr-dashboard.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "507238532798:web:87a67f27a4b87a0aed40ef",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export authentication instance
export const auth = getAuth(app);
