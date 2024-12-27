import QRCode from "qrcode";

let uploadedFile = null; // To hold file information

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const qrCanvas = document.getElementById("qrCodeCanvas");

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadedFile = file;
      console.log(`File selected: ${file.name}, ${file.size} bytes`);

      // Replace with your Vercel deployment URL
      const serverURL =
        "https://bridge-drop-h14c9sp3c-youngsu-chaes-projects.vercel.app";
      const fileDetails = {
        name: file.name,
        size: file.size,
        url: `${serverURL}/download/${file.name}`, // URL for file download
      };

      // Generate QR code with file details
      await QRCode.toCanvas(qrCanvas, JSON.stringify(fileDetails), (error) => {
        if (error) {
          console.error("Error generating QR code:", error);
        } else {
          console.log("QR code generated successfully:", fileDetails);
        }
      });

      // Send file to the server
      uploadFileToServer(file, fileDetails, serverURL);
    }
  });
});

// Send the uploaded file to the server
function uploadFileToServer(file, fileDetails, serverURL) {
  const socket = new WebSocket(`${serverURL.replace("https", "wss")}`); // Use WebSocket URL
  socket.onopen = () => {
    console.log("WebSocket connection established. Sending file...");
    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result;
      socket.send(JSON.stringify({ type: "file", fileDetails, fileData }));
      console.log("File sent to the server.");
    };
    reader.readAsDataURL(file); // Convert file to Base64
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
}
