const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
        extraNodeModules: {
            'react-native': path.resolve(__dirname, 'node_modules/react-native'),
            'react-native-reanimated': path.resolve(__dirname, 'node_modules/react-native-reanimated'),
            // add more modules here if needed
        },
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
