import QRCode from "qrcode";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Popup loaded. Generating QR Code...");
  generateQRCode();
});

async function generateQRCode() {
  const qrCanvas = document.getElementById("qrCodeCanvas");

  if (!qrCanvas) {
    console.error("QR Code canvas element not found");
    return;
  }

  try {
    const testData = "Hello, BridgeDrop!"; // Static data to test QR code generation
    await QRCode.toCanvas(qrCanvas, testData, (error) => {
      if (error) {
        console.error("Error generating QR code:", error);
      } else {
        console.log("QR code generated successfully.");
      }
    });
  } catch (error) {
    console.error("Unexpected error during QR code generation:", error);
  }
}
