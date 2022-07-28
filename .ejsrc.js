const colors = require('./src/config/colors.json');

module.exports = {
  ejs: {
    root: './src',
    _with: true,
    cache: false,
    rmWhitespace: true,
    views: ['./assets/icons/', './src/components/', './src/patterns/'],
    // context: {},
    localsName: '_',
  },
  data: {
    colors,
  },
};
