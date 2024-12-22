const path = require("path");

module.exports = {
  entry: "./Client/popup.js",
  output: {
    filename: "popup.bundle.js",
    path: path.resolve(__dirname, "Client"),
  },
  mode: "production", // Use production mode to avoid eval
  devtool: false, // Disable source maps to eliminate eval from them
  optimization: {
    minimize: true, // Minimize the output
  },
};
