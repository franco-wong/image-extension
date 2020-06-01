// Node modules
const path = require('path')

// Plugins
const CopyPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ExtensionReloader = require('webpack-extension-reloader')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development'

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
        ['@components']: path.resolve(__dirname, 'src/components'),
        ['@utilities']: path.resolve(__dirname, 'src/utility'),
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
            return /node_modules/.test(file) && !/\.vue\.js/.test(file)
          },
        },
        // this will apply to both plain `.css` files
        // AND `<style>` blocks in `.vue` files
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: { importLoaders: 1 },
            },
            'postcss-loader',
          ],
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
  }

  // To retrigger build on code changes during development
  if (isDevelopment) {
    webpackConfig.plugins.push(
      new ExtensionReloader({
        port: 9090, // Which port use to create the server
        reloadPage: true, // Force the reload of the page also
        entries: {
          contentScript: 'src/content/content',
          background: 'src/background/background',
        },
      })
    )
  }

  return webpackConfig
}
