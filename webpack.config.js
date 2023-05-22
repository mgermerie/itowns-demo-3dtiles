const path = require('path');
const mode = process.env.ENVIRONMENT;

module.exports = {
  mode,
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

