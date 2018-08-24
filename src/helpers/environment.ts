import { Platform } from 'react-native'

export const DEV_MODE = __DEV__

export const isPlatformAndroid: boolean = Platform.OS === 'android'
