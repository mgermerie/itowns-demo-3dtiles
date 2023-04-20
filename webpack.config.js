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
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'main.js',
    publicPath: '/js/',
  },
  devServer: {
    watchFiles: ['src/*'],
  },
  devtool: 'source-map',
};

