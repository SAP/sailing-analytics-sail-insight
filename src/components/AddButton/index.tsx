import React from 'react'
import { TouchableOpacity, TouchableOpacityProps, ViewProps } from 'react-native'

import Images from '@assets/Images'

import IconText from 'components/IconText'

import { button } from 'styles/commons'


class AddButton extends React.Component<ViewProps & TouchableOpacityProps> {

  public render() {
    const { onPress, children } = this.props
    return (
      <TouchableOpacity
          style={button.actionRectangular}
          onPress={onPress}
      >
        <IconText
          source={Images.actions.add}
          textStyle={button.actionText}
          iconTintColor="white"
          alignment="horizontal"
        >
          {children}
        </IconText>
      </TouchableOpacity>
    )
  }

}

export default AddButton
