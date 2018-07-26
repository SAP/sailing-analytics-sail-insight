import React from 'react'
import PropTypes from 'prop-types'
import { TouchableOpacity, Text } from 'react-native'

import { stylesheetPropType } from 'helper/proptypes'

import Spinner from 'components/ActivityIndicator'

import styles from './styles'


const TextButton = (props) => {
  const {
    style,
    children,
    textStyle,
    isLoading,
    disabled,
    ...remainingProps
  } = props
  return (
    <TouchableOpacity
      style={[styles.containerStyle, style]}
      disabled={isLoading || disabled}
      {...remainingProps}
    >
      {
      isLoading
        ? <Spinner style={styles.spinnerStyle} size="small" />
        : (
          <Text style={textStyle}>
            {children}
          </Text>
        )
  }
    </TouchableOpacity>
  )
}

TextButton.propTypes = {
  children: PropTypes.string,
  style: stylesheetPropType,
  textStyle: stylesheetPropType,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
}

TextButton.defaultProps = {
  children: '',
  style: null,
  textStyle: null,
  isLoading: false,
  disabled: false,
}

export default TextButton
