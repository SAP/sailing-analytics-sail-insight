import { Alert, Linking, NativeModules, Platform } from 'react-native'
import { PERMISSIONS, request, check } from 'react-native-permissions'
import I18n from 'i18n'

export const PermissionType = {
  Photo : Platform.select({ ios: PERMISSIONS.IOS.PHOTO_LIBRARY, android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE }),
  Camera : Platform.select({ ios: PERMISSIONS.IOS.CAMERA, android: PERMISSIONS.ANDROID.CAMERA }),
  Location : Platform.select({ ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION }),
  Contacts : Platform.select({ ios: PERMISSIONS.IOS.CONTACTS, android: PERMISSIONS.ANDROID.READ_CONTACTS })
}

export const PERMISSION_DENIED = 'denied'
export const PERMISSION_AUTHORIZED = 'authorized'
export const PERMISSION_UNDETERMINED = 'undetermined'
export const PERMISSION_RESTRICTED = 'restricted'

const SETTINGS_CTA_PERMISSION_STATE = Platform.OS === 'ios' ? PERMISSION_DENIED : PERMISSION_RESTRICTED

export const openSettings = () => {
  if (Platform.OS === 'android') {
    NativeModules.ShowAppSettings.show()
  } else {
    Linking.openURL('app-settings:')
  }
}

export const requestPermission = async (permissionType: string) =>
  await request(permissionType) === PERMISSION_AUTHORIZED


export const checkPermissionWithSettingsCTA = async (
  permission: string,
  alertTitle: string,
  alertMessage: string,
) => {
  if (await check(permission) !== SETTINGS_CTA_PERMISSION_STATE) {
    return true
  }
  Alert.alert(
    alertTitle,
    alertMessage,
    [
      { text: I18n.t('caption_cancel'), style: 'cancel' },
      { text: I18n.t('caption_settings'), onPress: openSettings },
    ],
    { cancelable: false },
  )
  return false
}

export const requestPermissionsForImagePickerUsingCamera = async () =>
  checkPermissionWithSettingsCTA(
    PermissionType.Camera,
    I18n.t('caption_take_photo'),
    I18n.t('text_permission_camera_settings_cta'),
  ) &&
  await checkPermissionWithSettingsCTA(
    PermissionType.Photo,
    I18n.t('caption_take_photo'),
    I18n.t('text_permission_camera_settings_cta'),
  ) &&
  await requestPermission(PermissionType.Camera) &&
  requestPermission(PermissionType.Photo)

export const requestPermissionsForImagePickerUsingPhotos = async () =>
  await checkPermissionWithSettingsCTA(
    PermissionType.Photo,
    I18n.t('caption_open_photos'),
    I18n.t('text_permission_photo_gallery_settings_cta'),
  ) &&
  requestPermission(PermissionType.Photo)
