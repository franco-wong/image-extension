// Node modules
const path = require('path');

// Plugins
const CopyPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const ExtensionReloader = require('webpack-extension-reloader');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { EnvironmentPlugin, DefinePlugin } = require('webpack');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  const webpackConfig = {
    mode: argv.mode,
    devtool: 'inline-source-map',
    entry: {
      background: './src/background/background.js',
      content: './src/content/content.js',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, './dist'),
    },
    watch: isDevelopment,
    resolve: {
      alias: {
        ['@assets']: path.resolve(__dirname, 'src/assets'),
        ['@components']: path.resolve(__dirname, 'src/content/components'),
        ['@styles']: path.resolve(__dirname, 'src/content/styles'),
        ['@utilities']: path.resolve(__dirname, 'src/utility'),
        ['@rules']: path.resolve(__dirname, 'src/content/rules'),
      },
    },
    module: {
      rules: [
        {
          test: /.vue$/,
          loader: 'vue-loader',
        },
        // this will apply to both plain `.js` files
        // AND `<script>` blocks in `.vue` files
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: (file) => {
            return /node_modules/.test(file) && !/\.vue\.js/.test(file);
          },
        },
        // this will apply to both plain `.scss` files
        // AND `<style lang="scss">` blocks in `.vue` files
        {
          test: /\.scss$/,
          use: ['vue-style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: './src/manifest.json', to: './' },
          { from: './src/assets/', to: './assets/' },
        ],
      }),
      new VueLoaderPlugin(),
      new CleanWebpackPlugin(),
    ],
  };

  if (isDevelopment) {
    // Add env variable during dev mode to toggle certain behaviour
    const url = isDevelopment ? 'localhost:8080' : 'www.google.ca';
    webpackConfig.plugins.push(
      new DefinePlugin({
        WP_TOKEN_ENDPOINT: JSON.stringify(url),
      })
    );

    // To retrigger build on code changes during development
    webpackConfig.plugins.push(
      new ExtensionReloader({
        port: 9090, // Which port use to create the server
        reloadPage: true, // Force the reload of the page also
        entries: {
          contentScript: 'src/content/content',
          background: 'src/background/background',
        },
      })
    );
  }

  return webpackConfig;
};
