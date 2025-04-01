import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDlVUQFvFvxou-2vBA64jkT1rQpKJC3dys",
  authDomain: "veloride-79485.firebaseapp.com",
  projectId: "veloride-79485",
  storageBucket: "veloride-79485.firebasestorage.app",
  messagingSenderId: "320563728030",
  appId: "1:320563728030:web:02e7da17030dd08f0eb58f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
