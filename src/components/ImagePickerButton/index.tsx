import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { Dimensions, ImageProps } from 'react-native'
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

// The heightPercentage should be something like 0.30
// which is the percentage of the windowHeight of the
// headerMediumLarge style class in `styles/commons/image.ts`
// which is currently used everywhere where images are displayed
const getAspectRatio = (heightPercentage: number) => {
  const { height, width } = Dimensions.get('window')
  const adjustedHeight = height * heightPercentage
  return width / adjustedHeight
}

// Arbitrary
const BASE_HEIGHT = 500

export const PICKER_OPTIONS = {
  // These BASE_HEIGHT and aspect ratio calculations are to enforce the
  // aspect ratio in the image picker which is used to actually display
  // the images
  width: BASE_HEIGHT * getAspectRatio(0.30),
  height: BASE_HEIGHT,
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
          I18n.t('caption_clear_photo'),
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
          case 2:
            return this.handleClearPhoto()
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

  protected handleClearPhoto = async () => {
    const { onImage } = this.props
    onImage(null)
  }
}


export default ImagePickerButton
