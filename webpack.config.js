// Node modules
const path = require("path");

// Plugins
const CopyPlugin = require('copy-webpack-plugin');

const webpack = {
    mode: "development",
    entry: {
        background: "./src/background.js",
        content: "./src/content.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "./dist"),
    },
    plugins: [
        new CopyPlugin([
            { from: "./src/manifest.json", to: "./" }
        ])
    ] 
};

module.exports = webpack;