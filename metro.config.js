const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {resolve} = require('metro-resolver');

function resolveRequest(context, moduleName, platform) {
    // Rewrite any request for 'index.android' to 'index'
    if (
        moduleName === './index.android' ||
        moduleName.endsWith('/index.android') ||
        moduleName === 'index.android'
    ) {
        const fixed = moduleName.replace(/index\.android$/, 'index');
        return resolve(context, fixed, platform);
    }
    return resolve(context, moduleName, platform);
}

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
        resolveRequest,
        extraNodeModules: {
            react: path.resolve(__dirname, 'node_modules/react'),
            'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
            'react-native': path.resolve(__dirname, 'node_modules/react-native'),
            'react-native-reanimated': path.resolve(__dirname, 'node_modules/react-native-reanimated'),
            // add more modules here if needed
        },
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
