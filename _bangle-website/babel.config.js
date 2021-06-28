module.exports = {
  presets: [
    '@babel/preset-typescript',
    require.resolve('@docusaurus/core/lib/babel/preset'),
  ],
  plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
};
