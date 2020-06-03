const plugin = require('tailwindcss/plugin');

const centerXYUtil = {
  '.center-xy': {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
};

module.exports = {
  theme: {
    inset: {
      '1/2': '50%',
    },
    zIndex: {
      '9000': 9000,
      high: 10001,
    },
  },
  variants: {},
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities(centerXYUtil);
    }),
  ],
  corePlugins: {},
};
