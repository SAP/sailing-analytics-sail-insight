import { Alert, Linking, NativeModules, Platform } from 'react-native'
import { PERMISSIONS, RESULTS, request, check, Permission } from 'react-native-permissions'
import I18n from 'i18n'

export const PermissionType = {
  Photo : Platform.select({ ios: PERMISSIONS.IOS.PHOTO_LIBRARY, android: Platform.Version >= 34
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    }),
  Camera : Platform.select({ ios: PERMISSIONS.IOS.CAMERA, android: PERMISSIONS.ANDROID.CAMERA }),
  Location : Platform.select({ ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION }),
  Contacts : Platform.select({ ios: PERMISSIONS.IOS.CONTACTS, android: PERMISSIONS.ANDROID.READ_CONTACTS })
}

export const openSettings = () => {
  if (Platform.OS === 'android') {
    NativeModules.ShowAppSettings.show()
  } else {
    Linking.openURL('app-settings:')
  }
}

export const requestPermission = async (permissionType: Permission) =>
  await request(permissionType) === RESULTS.GRANTED


export const checkPermissionWithSettingsCTA = async (
  permission: Permission,
  alertTitle: string,
  alertMessage: string,
) => {
  const status = await check(permission);
  if (status === RESULTS.DENIED || status === RESULTS.GRANTED) {
    return true
  }
  if (status === RESULTS.BLOCKED) {
    Alert.alert(
      alertTitle,
      alertMessage,
      [
        { text: I18n.t('caption_cancel'), style: 'cancel' },
        { text: I18n.t('caption_settings'), onPress: openSettings },
      ],
      { cancelable: false },
    )
  }
  // if unavailable return false
  return false
}

export const requestPermissionsForImagePickerUsingCamera = async () =>
  await checkPermissionWithSettingsCTA(
    PermissionType.Camera,
    I18n.t('caption_take_photo'),
    I18n.t('text_permission_camera_settings_cta'),
  ) &&
  await requestPermission(PermissionType.Camera)

export const requestPermissionsForImagePickerUsingPhotos = async () =>
  await checkPermissionWithSettingsCTA(
    PermissionType.Photo,
    I18n.t('caption_open_photos'),
    I18n.t('text_permission_photo_gallery_settings_cta'),
  ) &&
  await requestPermission(PermissionType.Photo)
