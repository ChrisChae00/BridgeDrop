import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQq0lQ52gt5FVY9cOUozEmg8B-BvuypPc",
  authDomain: "bridgedrop-59aa5.firebaseapp.com",
  projectId: "bridgedrop-59aa5",
  storageBucket: "bridgedrop-59aa5.firebasestorage.app",
  appId: "1:396794560173:web:d5aadb64c19ae2e5839024",
  measurementId: "G-N7W6GFMPTS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Get sessionKey from URL
const urlParams = new URLSearchParams(window.location.search);
const sessionKey = urlParams.get("sessionKey");

// DOM Elements
const fileList = document.getElementById("fileList");

async function fetchFiles() {
  try {
    const filesCollection = collection(
      firestore,
      `sessions/${sessionKey}/files`
    );
    const filesSnapshot = await getDocs(filesCollection);

    if (filesSnapshot.empty) {
      fileList.innerHTML = "<li>No files found for this session.</li>";
      return;
    }

    filesSnapshot.forEach((doc) => {
      const data = doc.data();
      const listItem = document.createElement("li");
      listItem.innerHTML = `<a href="${data.downloadURL}" target="_blank">${data.fileName}</a>`;
      fileList.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    fileList.innerHTML = "<li>Failed to fetch files. Please try again.</li>";
  }
}

fetchFiles();
