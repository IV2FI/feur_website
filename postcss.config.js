const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    'postcss-preset-env',
    require('autoprefixer'),
    tailwindcss
  ],
};