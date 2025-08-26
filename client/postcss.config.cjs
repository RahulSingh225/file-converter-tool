// PostCSS configuration using the @tailwindcss/postcss plugin and autoprefixer
// Ensures the newer Tailwind PostCSS plugin is used when installed.
module.exports = {
  plugins: [
    // Use the package installed: @tailwindcss/postcss
    require('@tailwindcss/postcss')(),
    require('autoprefixer')(),
  ],
};
