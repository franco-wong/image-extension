const entries = {
  content: "./src/content/content.js",
  background: "./src/background/background.js",
};

module.exports = {
  chainWebpack: (config) => {
    // Deleting default entry
    config.entryPoints.delete("app");
    // Add new entry points
    for (const key of Object.keys(entries)) {
      config.entry(key).add(entries[key]);
    }
    // Optimize the new entry points added in
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: "chunk-vendors",
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: ({ name }) => !Object.keys(entries).includes(name),
        },
        common: {
          name: "chunk-common",
          minChunks: 2,
          priority: -20,
          chunks: ({ name }) => !Object.keys(entries).includes(name),
          reuseExistingChunk: true,
        },
      },
    });
  },
  filenameHashing: true,
  productionSourceMap: false,
};
