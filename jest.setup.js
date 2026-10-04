/* eslint-disable no-undef */
jest.mock('react-native-device-info', () =>
    require('react-native-device-info/jest/react-native-device-info-mock'));
jest.mock('react-native-localize', () => require('react-native-localize/mock'));

// Native modules pulled in by sagas/actions. Saga tests assert on these mocks.
jest.mock('@react-native-firebase/crashlytics', () => {
    const instance = { recordError: jest.fn(), setAttribute: jest.fn(), log: jest.fn(), setUserId: jest.fn() };
    return () => instance;
});
jest.mock('@react-native-firebase/analytics', () => () => ({ logEvent: jest.fn(), setUserId: jest.fn() }));
jest.mock('react-native-snackbar', () => ({ show: jest.fn(), dismiss: jest.fn(), LENGTH_SHORT: 0, LENGTH_LONG: 1, LENGTH_INDEFINITE: -2 }));
jest.mock('@react-native-community/netinfo', () => require('@react-native-community/netinfo/jest/netinfo-mock.js'));
