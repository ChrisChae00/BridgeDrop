import QRCode from "qrcode";

const socket = new WebSocket("ws://localhost:8080");
let localPeerId = null;
const peers = new Map();

// Generate QR Code for pairing
async function generateQRCode() {
  const qrCanvas = document.getElementById("qrCodeCanvas");
  const pairingInfo = JSON.stringify({ peerId: localPeerId });
  await QRCode.toCanvas(qrCanvas, pairingInfo);
}

// Handle incoming WebSocket messages
socket.onmessage = async (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "connected") {
    localPeerId = data.peerId;
    await generateQRCode(); // Generate QR code on connection
  } else if (data.type === "devices") {
    updateDeviceList(data.devices);
  }
};

// Update the device list in the popup UI
function updateDeviceList(devices) {
  const deviceList = document.getElementById("deviceList");
  deviceList.innerHTML = ""; // Clear previous list
  devices.forEach((device) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Device: ${device.peerId}`;
    deviceList.appendChild(listItem);

    // Add click-to-connect functionality
    listItem.addEventListener("click", () => connectToPeer(device.peerId));
  });
}

// Handle file selection and transfer
document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    sendFile(file);
  }
});

// Encrypt file data with a shared secret
function encryptData(data, secretKey) {
  const encoder = new TextEncoder();
  const key = encoder.encode(secretKey);
  const encrypted = data.map((byte, index) => byte ^ key[index % key.length]);
  return encrypted;
}

// Send file to a peer
function sendFile(file) {
  const peerConnection = new RTCPeerConnection();
  const dataChannel = peerConnection.createDataChannel("fileTransfer");

  // Send file chunks via DataChannel
  dataChannel.onopen = () => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const encryptedData = encryptData(
        new Uint8Array(arrayBuffer),
        "secretKey"
      );
      dataChannel.send(encryptedData);
    };
    reader.readAsArrayBuffer(file);
  };

  // Connect to the selected peer
  peerConnection.createOffer().then((offer) => {
    peerConnection.setLocalDescription(offer);
    socket.send(JSON.stringify({ type: "offer", offer, targetPeerId }));
  });
}

// Connect to a peer
function connectToPeer(peerId) {
  // Placeholder for connection logic
}
