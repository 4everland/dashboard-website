module.exports = {
  transpileDependencies: ["vuetify", "@4everland/s3-lib-storage", "@smithy"],
  outputDir: "dist",
  publicPath: process.env.NODE_ENV === "production" ? "/" : "/",
  productionSourceMap: false,
  // devServer: {
  //   host: "0.0.0.0",
  //   port: 8082,
  //   open: true,
  //   publicPath: "/",
  //   disableHostCheck: true,
  // },
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
      // vuetify: "Vuetify",
      // "vuetify/lib/framework": "Vuetify",
    });
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: "all",
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          ensdomains: {
            name: "chunk-ensdomains",
            priority: 10, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?(@ensdomains|@solana)(.*)/,
          },
          aws: {
            name: "chunk-aws",
            priority: 10,
            test: /[\\/]node_modules[\\/]_?@aws(.*)/,
          },
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
