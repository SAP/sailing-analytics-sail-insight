import { Alert, Linking, Platform } from 'react-native'
import { PERMISSIONS, RESULTS, request, check, Permission } from 'react-native-permissions'
import I18n from 'i18n'

export const PermissionType = {
  Photo: PERMISSIONS.IOS.PHOTO_LIBRARY,
  Camera: Platform.select({ ios: PERMISSIONS.IOS.CAMERA, android: PERMISSIONS.ANDROID.CAMERA }) as Permission,
  Location: Platform.select({ ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION }) as Permission,
  Contacts: Platform.select({ ios: PERMISSIONS.IOS.CONTACTS, android: PERMISSIONS.ANDROID.READ_CONTACTS }) as Permission,
}

export const openSettings = () => Linking.openSettings()

export const requestPermission = async (permissionType: Permission) =>
  await request(permissionType) === RESULTS.GRANTED

export const checkPermissionWithSettingsCTA = async (
  permission: Permission,
  alertTitle: string,
  alertMessage: string,
) => {
  const status = await check(permission)
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
  return false
}

export const requestPermissionsForImagePickerUsingCamera = async () =>
  await checkPermissionWithSettingsCTA(
    PermissionType.Camera,
    I18n.t('caption_take_photo'),
    I18n.t('text_permission_camera_settings_cta'),
  ) &&
  await requestPermission(PermissionType.Camera)

export const requestPermissionsForImagePickerUsingPhotos = async () => {
  // Android's picker grants access to the selected URI; broad media permission is not required.
  if (Platform.OS === 'android') {
    return true
  }
  return await checkPermissionWithSettingsCTA(
    PermissionType.Photo,
    I18n.t('caption_open_photos'),
    I18n.t('text_permission_photo_gallery_settings_cta'),
  ) && await requestPermission(PermissionType.Photo)
}
