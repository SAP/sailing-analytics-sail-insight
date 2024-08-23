module.exports = {
  presets: [
    'module:@react-native/babel-preset'
  ],
  plugins: [
    [ "@babel/plugin-proposal-decorators", { "legacy": true } ],
    [ "transform-inline-environment-variables" ],
    [
      "module-resolver",
      {
        "root": ["./src"],
        "extensions": [".ts", ".tsx", ".js", ".jsx", ".ios.js", ".android.js", ".json"],
        "alias": {
          "@assets": "./src/assets"
        }
      }
    ],
    'react-native-reanimated/plugin'
  ]
};
