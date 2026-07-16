/* eslint-disable no-undef */
jest.mock('react-native-device-info', () =>
    require('react-native-device-info/jest/react-native-device-info-mock'));
jest.mock('react-native-localize', () => require('react-native-localize/mock'));
