module.exports = {
  resolve: {
    fallback: {
      fs: "empty",
      Buffer: false,
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      zlib: require.resolve("browserify-zlib"),
      url: require.resolve("url/"),
      assert: require.resolve("assert/"),
      stream: require.resolve("stream-browserify"),
    },
  },
  module: {
    unknownContextCritical: false,
  },
};
