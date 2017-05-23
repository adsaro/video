const path = require("path");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './public/typescripts/main.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, "public/javascripts")
  },
  externals: {
    "jquery": "$"
  },
  module: {
    rules: [
        {
        enforce: 'pre',
        test: /\.js$/,
        loader: "source-map-loader"
        },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devtool: 'inline-source-map',
  // plugins: [
  //   new UglifyJSPlugin()
  // ]
};