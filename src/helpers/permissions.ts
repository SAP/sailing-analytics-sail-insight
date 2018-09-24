import { Alert, Linking, NativeModules, Platform } from 'react-native'
import Permissions from 'react-native-permissions'

import I18n from 'i18n'


export const PermissionType = {
  Photo : 'photo',
  Camera : 'camera',
  Location : 'location',
  Contacts : 'contacts',
  Notifications : 'notification',
}

export const PERMISSION_DENIED = 'denied'
export const PERMISSION_AUTHORIZED = 'authorized'
export const PERMISSION_UNDETERMINED = 'undetermined'
export const PERMISSION_RESTRICTED = 'restricted'


export const openSettings = () => {
  if (Platform.OS === 'android') {
    NativeModules.ShowAppSettings.show()
  } else {
    Linking.openURL('app-settings:')
  }
}

export const requestPermission = async (permissionType: string) =>
  await Permissions.request(permissionType) === PERMISSION_AUTHORIZED

export const checkPermissionWithSettingsAlertFallback = async (
  permissionType: string,
  alertTitle: string,
  alertText: string,
) => {
  const permissionStateToShowSettingsAlert = Platform.OS === 'ios' ? PERMISSION_DENIED : PERMISSION_RESTRICTED

  const permissionResult = await Permissions.check(permissionType)
  if (permissionResult !== permissionStateToShowSettingsAlert) {
    return true
  }

  Alert.alert(
    alertTitle,
    alertText,
    [
      { text: I18n.t('caption_cancel'), style: 'cancel' },
      { text: I18n.t('caption_settings'), onPress: openSettings },
    ],
    { cancelable: false },
  )
  return false
}

export const requestPermissionsForImagePickerUsingCamera = async () =>
  checkPermissionWithSettingsAlertFallback(
    PermissionType.Camera,
    I18n.t('caption_camera'),
    I18n.t('text_missing_camera_permission_show_settings'),
  ) &&
  await checkPermissionWithSettingsAlertFallback(
    PermissionType.Photo,
    I18n.t('caption_library'),
    I18n.t('text_missing_camera_permission_show_settings'),
  ) &&
  await requestPermission(PermissionType.Camera) &&
  requestPermission(PermissionType.Photo)

export const requestPermissionsForImagePickerUsingPhotos = async () =>
  await checkPermissionWithSettingsAlertFallback(
    PermissionType.Photo,
    I18n.t('caption_library'),
    I18n.t('text_missing_photo_permission_show_settings'),
  ) &&
  requestPermission(PermissionType.Photo)
