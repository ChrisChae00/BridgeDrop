const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();

wss.on("connection", (ws) => {
  const clientId = uuidv4();
  clients.set(clientId, ws);

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "discover") {
      ws.send(JSON.stringify(Array.from(clients.keys())));
    }
  });

  ws.on("close", () => {
    clients.delete(clientId);
  });
});

console.log("BridgeDrop signaling server running on ws://localhost:8080");
