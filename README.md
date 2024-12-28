# BridgeDrop

A simple Chrome extension for peer-to-peer file sharing using WebRTC and Firebase.

## Features

- WebRTC-based peer-to-peer file transfer.
- Firebase Realtime Database for signaling.
- QR code-based device pairing.

## Setup

1. Clone the repository: https://github.com/ChrisChae00/BridgeDrop

2. Install dependencies: npm install

3. Set up Firebase:

- Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
- Add a Realtime Database and copy the configuration.
- Replace the `firebaseConfig` values in `popup.js` with your Firebase project details.

4. Start the project: npm start
