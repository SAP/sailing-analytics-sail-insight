const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

function resolveRequest(context, moduleName, platform) {
    const fixedModuleName = (
        moduleName === './index.android' ||
        moduleName.endsWith('/index.android') ||
        moduleName === 'index.android'
    ) ? moduleName.replace(/index\.android$/, 'index') : moduleName;

    return context.resolveRequest(context, fixedModuleName, platform);
}

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
    resolver: {
        resolveRequest,
        extraNodeModules: {
            react: path.resolve(__dirname, 'node_modules/react'),
            'react/jsx-runtime': path.resolve(__dirname, 'node_modules/react/jsx-runtime'),
            'react-native': path.resolve(__dirname, 'node_modules/react-native'),
            'react-native-reanimated': path.resolve(__dirname, 'node_modules/react-native-reanimated'),
        },
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
