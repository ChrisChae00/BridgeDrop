// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

const QRCode = window.QRCode;
let peerConnection;
let dataChannel;

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const qrCanvas = document.getElementById("qrCodeCanvas");

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`File selected: ${file.name}, ${file.size} bytes`);

      const sessionId = generateSessionId();

      // Generate QR code with session ID
      await QRCode.toCanvas(qrCanvas, sessionId, (error) => {
        if (error) {
          console.error("Error generating QR code:", error);
        } else {
          console.log("QR code generated with session ID:", sessionId);
        }
      });

      // Start WebRTC connection
      await setupConnection(sessionId, file);
    }
  });
});

function generateSessionId() {
  return Math.random().toString(36).substr(2, 8); // Simple random ID
}

// Store signaling data in Firebase
async function sendSignalingData(sessionId, data) {
  const sessionRef = ref(database, `sessions/${sessionId}`);
  await push(sessionRef, data);
}

// Retrieve signaling data from Firebase
async function waitForSignalingData(sessionId) {
  return new Promise((resolve) => {
    const sessionRef = ref(database, `sessions/${sessionId}`);
    onValue(sessionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        resolve(Object.values(data));
      }
    });
  });
}

async function setupConnection(sessionId, file) {
  peerConnection = new RTCPeerConnection();

  // Create a data channel for file transfer
  dataChannel = peerConnection.createDataChannel("fileTransfer");
  dataChannel.onopen = () => {
    console.log("DataChannel open. Sending file...");
    sendFile(file);
  };
  dataChannel.onerror = (error) => {
    console.error("DataChannel error:", error);
  };

  // Handle ICE candidates
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      await sendSignalingData(sessionId, { candidate: event.candidate });
    }
  };

  // Create an SDP offer
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  // Send the offer to Firebase
  await sendSignalingData(sessionId, { sdp: offer });

  // Wait for an answer
  const signalingData = await waitForSignalingData(sessionId);
  const answer = signalingData.find(
    (data) => data.sdp && data.type === "answer"
  );
  if (answer) {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(answer.sdp)
    );
  }

  // Handle remote ICE candidates
  const candidates = signalingData.filter((data) => data.candidate);
  for (const candidate of candidates) {
    await peerConnection.addIceCandidate(
      new RTCIceCandidate(candidate.candidate)
    );
  }
}

function sendFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const fileData = reader.result;
    dataChannel.send(fileData); // Send file as binary data
    console.log("File sent successfully.");
  };
  reader.readAsArrayBuffer(file);
}
