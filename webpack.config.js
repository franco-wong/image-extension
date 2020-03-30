// Node modules
const path = require("path");

// Plugins
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const webpack = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        background: "./src/background/background.js",
        content: "./src/content/content.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./dist"),
    },
    plugins: [
        new CopyPlugin([
            { from: "./src/manifest.json", to: "./" },
            { from: "./html/", to: "./html/" },
            { from: "./css/", to: "./css/" }
        ]),
        new CleanWebpackPlugin()
    ] 
};

module.exports = webpack;