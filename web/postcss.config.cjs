module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      stage: 2,                    // sensible balance of features
      autoprefixer: { grid: false }, // set true only if you support old IE grid
      features: {
        'nesting-rules': true,         // native-like CSS nesting
        'custom-media-queries': true,  // enables @custom-media
        // 'custom-media': true,
      }
    }
  }
};
