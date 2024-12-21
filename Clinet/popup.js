const socket = new WebSocket("ws://localhost:8080");

document
  .getElementById("fileInput")
  .addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      const devices = await discoverDevices();
      console.log(`Discovered devices: ${JSON.stringify(devices)}`);
      // Send the file to selected device
    }
  });

async function discoverDevices() {
  return new Promise((resolve) => {
    socket.onmessage = (event) => {
      const devices = JSON.parse(event.data);
      resolve(devices);
    };
    socket.send(JSON.stringify({ type: "discover" }));
  });
}
