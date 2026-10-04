module.exports = {
    preset: 'react-native',
    // query-string (and its deps) ship untranspiled ESM
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?|query-string|decode-uri-component|split-on-first|filter-obj|uuid|@react-navigation|@react-native-firebase|react-native-.*|@expo|@sayem314|@react-native-picker|@react-native-masked-view)/)',
    ],
    setupFiles: ['./jest.setup.js'],
};
