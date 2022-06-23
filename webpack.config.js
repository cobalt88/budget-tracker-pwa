const path = require('path');

module.exports = {
  entry: {
    app: './public/js/index.js'
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
};