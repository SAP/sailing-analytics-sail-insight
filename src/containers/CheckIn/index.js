import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import I18n from 'i18n'
import { checkIn } from 'actions/checkIn'
import { container, buttons } from 'styles/commons'
import { navigateToQRScanner } from 'navigation'
import { Logger } from 'helpers/Logger'

import GradientContainer from 'components/GradientContainer'
import TextButton from 'components/TextButton'

import styles from './styles'


class CheckIn extends Component {
  static propTypes = {
    checkIn: PropTypes.func.isRequired,
  }

  state = {
    isLoading: false,
  }

  onSuccess = async (url) => {
    this.setState({ isLoading: true })
    try {
      await this.props.checkIn(url)
      this?.props?.navigation?.goBack?.()
    } catch (err) {
      Logger.debug(err)
    } finally {
      this.setState({ isLoading: false })
    }
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
          isLoading={this.state.isLoading}
        >
          {I18n.t('caption_qr_scanner')}
        </TextButton>
      </GradientContainer>
    )
  }
}

export default connect(null, { checkIn })(CheckIn)
