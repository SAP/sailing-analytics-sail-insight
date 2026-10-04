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

    // Only inline the dev-only E2E backend seam, not unrelated environment variables.
    ['transform-inline-environment-variables', { include: ['E2E_BACKEND_URL'] }],

    // keep this LAST
    'react-native-reanimated/plugin',
  ],
};
