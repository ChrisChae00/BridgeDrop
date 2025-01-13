// Import the Firebase modules from npm
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQq0lQ52gt5FVY9cOUozEmg8B-BvuypPc",
  authDomain: "bridgedrop-59aa5.firebaseapp.com",
  databaseURL: "https://bridgedrop-59aa5-default-rtdb.firebaseio.com",
  projectId: "bridgedrop-59aa5",
  storageBucket: "bridgedrop-59aa5.firebasestorage.app",
  messagingSenderId: "396794560173",
  appId: "1:396794560173:web:d5aadb64c19ae2e5839024",
  measurementId: "G-N7W6GFMPTS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app };
