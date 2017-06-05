module.exports = {
  root: "build",
  webpack: {
    umd: {
      entry: "./src/model.js",
      library: "Model",
      filename: './model.js',
    },
    externals: {
      "manba": "manba"
    }
  }
};
