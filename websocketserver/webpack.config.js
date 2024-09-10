// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',  // Entry point of your application
  output: {
    filename: 'bundle.js',   // Output bundle file
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  module: {
    rules: [
      {
        test: /\.js$/,                // Files to be transformed
        exclude: /node_modules/,      // Exclude node_modules
        use: {
          loader: 'babel-loader',     // Use Babel to transpile JavaScript
          options: {
            presets: ['@babel/preset-env'],  // Babel presets
          },
        },
      },
    ],
  },
  mode: 'development',   // or 'production' for minified output
};
