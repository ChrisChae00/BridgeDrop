const http = require("http");
const WebSocket = require("ws");

const port = process.env.PORT || 8080; // Use Vercel's assigned port or default to 8080

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end("<h1>BridgeDrop Server is Running!</h1>");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("WebSocket connected.");

  ws.on("message", (message) => {
    console.log("Received:", message);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("WebSocket disconnected.");
  });
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
