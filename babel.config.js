module.exports = {
  presets: ['@react-native/babel-preset'],
  plugins: [
    // Map absolute/aliased imports first
    ['module-resolver', {
      cwd: 'packagejson',
      root: ['./src'],
      alias: {
        '@assets': ['./assets'], // first path wins; keep both if unsure
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    }],

    // decorators MUST come before class-properties
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],

    // keep this LAST
    'react-native-reanimated/plugin',
  ],
};
