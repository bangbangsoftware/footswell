const path = require("path");

module.exports = {
  entry: "./js/index.js",
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "docs/js"),
    filename: "fs.js"
  }
};
