// Import Firebase and QRCode libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";
import QRCode from "https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js";

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
const firestore = getFirestore(app);
const storage = getStorage(app);

// Global session key
const sessionKey = generateSessionKey();

// DOM Elements
const fileInput = document.getElementById("fileInput");
const generateQRButton = document.getElementById("generateQRButton");
const qrCanvas = document.getElementById("qrCanvas");

// Track uploaded files
let hasUploadedFiles = false;

// Handle file uploads
fileInput.addEventListener("change", async (event) => {
  const files = event.target.files;
  if (!files.length) return;

  for (const file of files) {
    try {
      // Upload file to Firebase Storage
      const fileRef = ref(storage, `uploads/${sessionKey}/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);

      // Get public download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Save metadata to Firestore
      const fileDoc = doc(
        collection(firestore, `sessions/${sessionKey}/files`)
      );
      await setDoc(fileDoc, {
        fileName: file.name,
        downloadURL,
        uploadedAt: new Date().toISOString(),
      });

      hasUploadedFiles = true;
      generateQRButton.disabled = false; // Enable button after upload
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  }
});

// Handle QR Code generation
generateQRButton.addEventListener("click", () => {
  if (!hasUploadedFiles) {
    alert("Please upload files before generating a QR code.");
    return;
  }

  const listUrl = `https://bridgedrop-59aa5.web.app/list.html?sessionKey=${sessionKey}`;
  qrCanvas.innerHTML = ""; // Clear previous QR Code

  QRCode.toCanvas(qrCanvas, listUrl, { width: 300, height: 300 }, (error) => {
    if (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code. Please try again.");
    } else {
      alert("QR Code generated successfully!");
    }
  });
});

function generateSessionKey() {
  return Math.random().toString(36).substr(2, 9);
}
