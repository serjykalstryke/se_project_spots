const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/pages/index.js",            
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.[contenthash].js",
    publicPath:"",
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  module: {
    rules: [
      { test: /\.html$/i, loader: "html-loader" },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i, 
        type: "asset/resource",
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",       
      favicon: "./favicon.ico",  
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "main.[contenthash].css",
    }),
  ],
  devServer: {
    static: path.resolve(__dirname, "dist"),
    open: true,
    compress: true,
    port: 8080,
  },
};
