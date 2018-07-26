import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  View,
  Text,
} from 'react-native'

import I18n from 'i18n'
import { checkIn } from 'actions/checkIn'
import { container, buttons } from 'styles/commons'
import { navigateToQRScanner } from 'navigation'

import GradientContainer from 'components/GradientContainer'
import TextButton from 'components/TextButton'

import styles from './styles'


class CheckIn extends Component {
  static propTypes = {
    checkIn: PropTypes.func.isRequired,
  }

  onSuccess = (url) => {
    console.log(url)
  }

  onQRPress = () => {
    navigateToQRScanner({ onSuccess: this.onSuccess })
  }

  render() {
    return (
      <GradientContainer style={[container.main, styles.container]}>
        <TextButton
          textStyle={buttons.actionText}
          style={buttons.actionFullWidth}
          onPress={this.onQRPress}
        >
          {I18n.t('caption_qr_scanner')}
        </TextButton>
      </GradientContainer>
    )
  }
}

export default connect(null, { checkIn })(CheckIn)
