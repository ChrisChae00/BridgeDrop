import { initializeApp } from "./firebase-app.js";
import { getDatabase, ref, push, set } from "./firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQq0lQ52gt5FVY9cOUozEmg8B-BvuypPc",
  authDomain: "bridgedrop-59aa5.firebaseapp.com",
  databaseURL: "https://bridgedrop-59aa5-default-rtdb.firebaseio.com",
  projectId: "bridgedrop-59aa5",
  storageBucket: "bridgedrop-59aa5.appspot.com",
  messagingSenderId: "396794560173",
  appId: "1:396794560173:web:d5aadb64c19ae2e5839024",
  measurementId: "G-N7W6GFMPTS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const qrCanvas = document.getElementById("qrCodeCanvas");

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Generate unique key for the file metadata
      const fileRef = push(ref(database, "files"));
      await set(fileRef, {
        name: file.name,
        size: file.size,
      });

      // Generate a QR code for the download link
      const fileUrl = `${firebaseConfig.databaseURL}/files/${fileRef.key}.json`;
      QRCode.toCanvas(qrCanvas, fileUrl, (error) => {
        if (error) {
          console.error("Error generating QR Code:", error);
        } else {
          console.log("QR Code generated:", fileUrl);
        }
      });
    }
  });
});
