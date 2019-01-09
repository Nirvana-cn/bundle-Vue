const webpack = require("webpack");
const path = require("path");

module.exports = {
    entry: {
        index: "./src/index.js",
        another:"./src/module.js"
    },
    output: {
        publicPath: __dirname + "/build/",
        path: path.resolve(__dirname, "build"),
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js"
    },
    mode: "development",
    optimization:{
        splitChunks:{
            chunks:'all'
        }
    }
};