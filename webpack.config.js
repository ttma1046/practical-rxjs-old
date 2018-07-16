const path = require('path');

module.exports = {
  entry: './lesson.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  }
};