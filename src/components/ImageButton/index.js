import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity } from 'react-native'
import { get } from 'lodash'

import Image from 'components/Image'
import { stylesheetPropType, imageSourcePropType } from 'helpers/proptypes'
import { $defaultImageButtonSize } from 'styles/dimensions'

import styles from './styles'

class ImageButton extends Component {
  static propTypes = {
    style: stylesheetPropType,
    source: imageSourcePropType,
    onPress: PropTypes.func,
    resizeMode: PropTypes.string,
    circular: PropTypes.bool,
    autoWidth: PropTypes.bool,
  }

  static defaultProps = {
    style: null,
    source: null,
    onPress: null,
    resizeMode: Image.resizeMode.contain,
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
    this.setState({
      borderRadius: get(event, 'nativeEvent.layout.height') / 2,
      width: get(event, 'nativeEvent.layout.height'),
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
          resizeMode={this.props.resizeMode}
        />
      </TouchableOpacity>
    )
  }
}

export default ImageButton
