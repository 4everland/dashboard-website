const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  transpileDependencies: ["vuetify"],
  outputDir: "dist",
  publicPath: process.env.NODE_ENV === "production" ? "" : "/",
  productionSourceMap: false,
  devServer: {
    host: "0.0.0.0",
    port: 8082,
    open: true,
  },
  lintOnSave: false,
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: "all",
        // maxSize: 1024 * 1024,
        // minChunks: 10,
        // maxAsyncRequests: 30,
        // maxInitialRequests: 30,
        // enforceSizeThreshold: 50000,
        // cacheGroups: {
        //   defaultVendors: {
        //     test: /[\\/]node_modules[\\/]/,
        //     priority: -10,
        //     reuseExistingChunk: true,
        //   },
        //   default: {
        //     minChunks: 2,
        //     priority: -20,
        //     reuseExistingChunk: true,
        //   },
        // },
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          vuetify: {
            name: "chunk-vuetify", // split vuetify into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?vuetify(.*)/, // in order to adapt to cnpm
          },
          minio: {
            name: "chunk-minio", // split vuetify into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?minio(.*)/, // in order to adapt to cnpm
          },
          aws: {
            name: "chunk-s3", // split vuetify into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?@aws(.*)/, // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
    },
  },
};
