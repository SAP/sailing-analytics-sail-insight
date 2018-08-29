import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import { checkIn } from 'actions/checkIn'
import Logger from 'helpers/Logger'
import I18n from 'i18n'
import { navigateBack, navigateToQRScanner } from 'navigation'
import { button, container } from 'styles/commons'

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
      <View style={[container.main, styles.container]}>
        <TextButton
          textStyle={button.actionText}
          style={button.actionFullWidth}
          onPress={this.onQRPress}
          isLoading={this.state.isLoading}
        >
          {I18n.t('caption_qr_scanner')}
        </TextButton>
      </View>
    )
  }
}

export default connect(null, { checkIn })(CheckIn)
