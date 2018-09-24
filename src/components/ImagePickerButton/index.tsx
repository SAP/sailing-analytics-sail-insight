import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { ImageProps } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'

import Images from '@assets/Images'
import Logger from 'helpers/Logger'
import {
  requestPermissionsForImagePickerUsingCamera,
  requestPermissionsForImagePickerUsingPhotos,
} from 'helpers/permissions'
import I18n from 'i18n'

import ImageButton from 'components/ImageButton'

import { button } from 'styles/commons'
import styles from './styles'


export const PICKER_OPTIONS = {
  width: 500,
  height: 500,
  cropping: true,
  cropperCircleOverlay: false,
  // useFrontCamera: true,
  mediaType: 'photo',
  writeTempFile: true,
  includeBase64: true,
  smartAlbums: [
    'Generic',
    'PhotoStream',
    'RecentlyAdded',
    'SelfPortraits',
    'LivePhotos',
    'Favorites',
    'Panoramas',
    'Animated',
    'LongExposure',
    'DepthEffect',
    'Screenshots',
    'UserLibrary',
  ],
}

@connectActionSheet
class ImagePickerButton extends React.Component<ImageProps & {
  onImage?: (image: any) => void,
  showActionSheetWithOptions?: any,
}> {

  public render() {
    const { style, onImage, ...remainingProps } = this.props
    return (
      <ImageButton
        style={[button.secondaryActionIcon, styles.button, style]}
        source={Images.actions.pickImage}
        onPress={this.onPress}
        circular={true}
        {...remainingProps}
      />
    )
  }

  protected onPress = () => {
    this.props.showActionSheetWithOptions(
      {
        options: [
          I18n.t('caption_open_photos'),
          I18n.t('caption_take_photo'),
          I18n.t('caption_cancel'),
        ],
        cancelButtonIndex: 2,
      },
      (buttonIndex: number) => {
        switch (buttonIndex) {
          case 0:
            return this.handleOpenPhotos()
          case 1:
            return this.handleOpenCamera()
          default:
            return
        }
      },
    )
  }

  protected handleOpenPhotos = async () => {
    const showPicker = await requestPermissionsForImagePickerUsingPhotos()
    if (!showPicker) {
      return
    }
    this.handleOpenPicker(ImagePicker.openPicker)
  }

  protected handleOpenCamera = async () => {
    const showPicker = await requestPermissionsForImagePickerUsingCamera()
    if (!showPicker) {
      return
    }
    this.handleOpenPicker(ImagePicker.openCamera)
  }

  protected handleSelectedPhoto = (img: any) => {
    const value = img
    const { onImage } = this.props
    if (!value || !onImage) {
      return
    }
    onImage(img)
  }

  protected handleOpenPicker = async (method: any) => {
    // workaround for issue opening image picker from modal dialog in ios:
    // waiting for modal sheet to close
    setTimeout(
      async () => {
        try {
          const image = await method(PICKER_OPTIONS)
          this.handleSelectedPhoto(image)
        } catch (e) {
          Logger.warn(e)
        }
      },
      200,
    )
  }
}


export default ImagePickerButton
