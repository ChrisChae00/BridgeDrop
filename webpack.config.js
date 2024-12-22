const path = require("path");

module.exports = {
  entry: "./Client/popup.js", // Entry file
  output: {
    filename: "popup.bundle.js", // Output file name
    path: path.resolve(__dirname, "Client"), // Output directory
  },
  mode: "development", // Set mode to 'development' for easier debugging
  resolve: {
    modules: [path.resolve(__dirname, "node_modules"), "node_modules"], // Ensure node_modules is resolved correctly
  },
};
