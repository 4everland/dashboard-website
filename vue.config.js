module.exports = {
  transpileDependencies: ["vuetify"],
  outputDir: "dist",
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  productionSourceMap: false,
  devServer: {
    host: "0.0.0.0",
    port: 8082,
    open: true,
    publicPath: "/",
  },
  lintOnSave: false,
  chainWebpack: (config) => {
    config.externals({
      // vue: "Vue",
      echarts: "echarts",
      "@ethereumjs/common": "ethers",
      axios: "axios",
      "vue-router": "VueRouter",
      vuex: "Vuex",
      html2canvas: "html2canvas",
    });
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: "all",
        // maxSize: 4e5,
        // minSize: 3e5,
        // minChunks: 10,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        // enforceSizeThreshold: 50000,
        cacheGroups: {
          ensdomains: {
            name: "chunk-ensdomains", // split vuetify into a single package
            priority: 10, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?(@ensdomains|@solana)(.*)/, // in order to adapt to cnpm
          },
          aws: {
            name: "chunk-aws", // split vuetify into a single package
            priority: 10, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?@aws(.*)/, // in order to adapt to cnpm
          },
          // vuetify: {
          //   name: "chunk-vuetify", // split vuetify into a single package
          //   priority: -10, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          //   test: /[\\/]node_modules[\\/]_?vuetify(.*)/, // in order to adapt to cnpm
          // },
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
  },
};
