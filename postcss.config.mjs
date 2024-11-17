import tailwindcss from 'tailwindcss';
import renameClass from 'postcss-rename-class';

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    tailwindcss,
    renameClass({
      rename: (className) => `obf-${className}-${Math.random().toString(36).substr(2, 5)}`,
    }),
  ],
};

export default config;
