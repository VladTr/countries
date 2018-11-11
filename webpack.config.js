const path = require('path');
module.exports = {
    entry: ["@babel/polyfill", "./js/app.js"],
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'app.js'
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}