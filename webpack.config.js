const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public/js'),
  },
  devtool: 'source-map',
};

