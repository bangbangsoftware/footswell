const path = require("path");

module.exports = {
  entry: {
    index: "./js/index.js",
  },
  devtool: "source-map",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "docs/js"),
    publicPath: "/assets/",
    filename: '[name].fs.js',
  },
  devServer: {
    contentBase: path.join(__dirname, "docs"),
    compress: true,
    port: 9000
  }
};
