const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const wss = new WebSocket.Server({ port: 8080 });
const peers = new Map();

wss.on("connection", (ws) => {
  console.log("WebSocket connected.");
  const peerId = uuidv4();
  peers.set(peerId, ws);

  // Send connected peer ID
  ws.send(JSON.stringify({ type: "connected", peerId }));

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "discover") {
      const devices = Array.from(peers.keys()).filter((id) => id !== peerId);
      ws.send(JSON.stringify({ type: "devices", devices }));
    } else if (data.type === "offer") {
      const targetPeer = peers.get(data.targetPeerId);
      if (targetPeer) {
        targetPeer.send(
          JSON.stringify({
            type: "offer",
            offer: data.offer,
            fromPeerId: peerId,
          })
        );
      }
    }
  });

  ws.on("close", () => {
    peers.delete(peerId);
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
