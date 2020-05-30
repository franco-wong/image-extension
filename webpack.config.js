// Node modules
const path = require("path");

// Plugins
const CopyPlugin = require("copy-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const webpack = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    background: "./src/background/background.js",
    content: "./src/content/content.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /.vue$/,
        loader: "vue-loader",
      },
      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: (file) => {
          return /node_modules/.test(file) && !/\.vue\.js/.test(file);
        },
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.css$/,
        use: [
          "vue-style-loader",
          {
            loader: "css-loader",
            options: { importLoaders: 1 },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src/manifest.json", to: "./" },
        { from: "./src/assets/", to: "./assets/" },
      ],
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
  ],
};

module.exports = webpack;
