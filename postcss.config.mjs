/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require('tailwindcss'),
    require('postcss-rename-class')({
      rename: (className) => `obf-${className}-${Math.random().toString(36).substr(2, 5)}`,
    }),
  ],
};

export default config;