import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Image } from 'react-native'

import { stylesheetPropType, imageSourcePropType } from 'helpers/propTypes'
import { $defaultImageButtonSize } from 'styles/dimensions'

import styles from './styles'


class ImageButton extends Component {
  static propTypes = {
    style: stylesheetPropType,
    source: imageSourcePropType,
    onPress: PropTypes.func,
    circular: PropTypes.bool,
    autoWidth: PropTypes.bool,
  }

  static defaultProps = {
    style: null,
    source: null,
    onPress: null,
    circular: false,
    autoWidth: false,
  }

  constructor() {
    super()
    this.handleContentSizeChange = this.handleContentSizeChange.bind(this)

    this.state = {
      borderRadius: $defaultImageButtonSize / 2,
      width: $defaultImageButtonSize,
    }
  }

  handleContentSizeChange(event) {
    const height = event?.nativeEvent?.layout?.height
    if (!height) {
      return
    }
    this.setState({
      borderRadius: height / 2,
      width: height,
    })
  }

  render() {
    return (
      <TouchableOpacity
        onLayout={this.handleContentSizeChange}
        style={[
          styles.containerStyle,
          this.props.circular && { borderRadius: this.state.borderRadius },
          this.props.autoWidth && { width: this.state.width },
          this.props.style,
        ]}
        onPress={this.props.onPress}
      >
        <Image
          source={this.props.source}
          style={styles.imageStyle}
        />
      </TouchableOpacity>
    )
  }
}

export default ImageButton
