import { get } from 'lodash'
import React from 'react'
import { ViewProps } from 'react-native'
import { WrappedFieldProps } from 'redux-form'
import { v4 as uuidv4 } from 'uuid';

import Images from '@assets/Images'

import Image from 'components/Image'
import ImagePickerButton from 'components/ImagePickerButton'

import { image } from 'styles/commons'
import { $siPlaceholderBackgroundColor } from 'styles/colors'

class FormImagePicker extends React.Component<ViewProps & WrappedFieldProps & {
  placeholder?: any,
  disabled?: boolean,
  onChange?: (value: any) => void
} > {

  public render() {
    const {
      input,
      placeholder,
      disabled,
    } = this.props
    // source from image picker
    const imageValue = get(input, 'value.path')
    const placeholderStyle = !imageValue ? { backgroundColor: $siPlaceholderBackgroundColor } : undefined

    if (disabled) {
      return (
        <Image
          style={[image.siHeaderMediumLarge, placeholderStyle]}
          source={imageValue || placeholder} />
      )
    }

    return (
      <Image
        style={[image.siHeaderMediumLarge, placeholderStyle]}
        source={imageValue || placeholder}>
          <ImagePickerButton
            style={[image.siAbsoluteLowerRight]}
            source={Images.actions.pickImage}
            onImage={this.handleImage} />
      </Image>
    )
  }

  protected handleImage = (value: any) => {
    const { input, onChange } = this.props
    if (!input || !input.onChange) {
      return
    }

    const imageData = {
      ...value,
      ...(value && { uuid: uuidv4() }),
    }

    input.onChange(imageData)
    if (onChange) {
      onChange(imageData)
    }
  }
}


export default FormImagePicker
