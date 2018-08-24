import React from 'react'
import { connect } from 'react-redux'

import { checkIn } from 'actions/checkIn'
import Logger from 'helpers/Logger'
import I18n from 'i18n'
import { navigateBack, navigateToQRScanner } from 'navigation'
import { buttons, container } from 'styles/commons'

import GradientContainer from 'components/GradientContainer'
import TextButton from 'components/TextButton'

import styles from './styles'


class CheckIn extends React.Component<{
  checkIn: any,
} > {
  public state = {
    isLoading: false,
  }

  public onSuccess = async (url: string) => {
    this.setState({ isLoading: true })
    try {
      await this.props.checkIn(url)
      navigateBack()
    } catch (err) {
      Logger.debug(err)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public onQRPress = () => {
    navigateToQRScanner({ onSuccess: this.onSuccess })
  }

  public render() {
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
