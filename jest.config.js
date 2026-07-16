module.exports = {
    preset: 'react-native',
    // query-string (and its deps) ship untranspiled ESM
    transformIgnorePatterns: [
        'node_modules/(?!((jest-)?react-native|@react-native(-community)?|query-string|decode-uri-component|split-on-first|filter-obj|uuid)/)',
    ],
    setupFiles: ['./jest.setup.js'],
};
