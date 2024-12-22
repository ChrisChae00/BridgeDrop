import QRCode from "qrcode";

const socket = new WebSocket("ws://localhost:8080");
let localPeerId = null;

// Generate QR Code for pairing
async function generateQRCode() {
  const qrCanvas = document.getElementById("qrCodeCanvas");
  const pairingInfo = JSON.stringify({ peerId: localPeerId });
  await QRCode.toCanvas(qrCanvas, pairingInfo);
  console.log("QR Code generated successfully");
}

// Handle WebSocket connection
socket.onmessage = async (event) => {
  const data = JSON.parse(event.data);

  if (data.type === "connected") {
    localPeerId = data.peerId;
    await generateQRCode();
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

    listItem.addEventListener("click", () => connectToPeer(device.peerId));
  });
}

// Handle file selection
document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    sendFile(file);
  }
});

// Placeholder for peer connection logic
function connectToPeer(peerId) {
  console.log("Connecting to peer:", peerId);
}

function sendFile(file) {
  console.log("Sending file:", file.name);
}
