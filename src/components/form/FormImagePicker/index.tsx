import { get } from 'lodash'
import React from 'react'
import { ViewProps } from 'react-native'
import { WrappedFieldProps } from 'redux-form'
import uuidv4 from 'uuid/v4'

import Images from '@assets/Images'

import Image from 'components/Image'
import ImagePickerButton from 'components/ImagePickerButton'

import { $placeholderBackgroundColor } from 'styles/colors'
import { image } from 'styles/commons'
import Logger from '../../../helpers/Logger'

class FormImagePicker extends React.Component<ViewProps & WrappedFieldProps & {
  placeholder?: any,
  disabled?: boolean,
} > {

  public render() {
    const {
      input,
      placeholder,
      disabled,
    } = this.props
    // source from image picker
    const imageValue = get(input, 'value.path')
    const placeholderStyle = !imageValue ? { backgroundColor: $placeholderBackgroundColor } : undefined

    if (disabled) {
      return (
        <Image
          style={[image.headerMediumLarge, placeholderStyle]}
          source={imageValue || placeholder}
        />
      )
    }

    return (
      <Image
        style={[image.headerMediumLarge, placeholderStyle]}
        source={imageValue || placeholder}
      >
        <ImagePickerButton
          style={[image.absoluteLowerRight]}
          source={Images.actions.pickImage}
          onImage={this.handleImage}
        />
      </Image>
    )
  }

  protected handleImage = (value: any) => {
    const { input } = this.props
    if (!input || !input.onChange) {
      return
    }
    input.onChange({
      ...value,
      ...(value && { uuid: uuidv4() }),
    })
  }
}


export default FormImagePicker
