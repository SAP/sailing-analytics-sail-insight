import React from 'react'
import { ImageBackground, View } from 'react-native'

import Images from '@assets/Images'
import I18n from 'i18n'
import { navigateToQRScanner } from 'navigation'
import { button, container } from 'styles/commons'
import styles from './styles'

import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'


class CheckIn extends React.Component<{
  checkIn: any,
} > {
  public onQRPress = () => {
    navigateToQRScanner()
  }

  public render() {
    return (
      <ImageBackground source={Images.defaults.background_map} style={{ width: '100%', height: '100%' }}>
        <ScrollContentView style={styles.scrollContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.claim}>
              {I18n.t('text_join_and_track').toUpperCase()}
            </Text>
            <Text style={styles.subClaim}>
              {I18n.t('text_join_code_on_confirmation')}
            </Text>
          </View>
          <TextButton
            style={[button.actionFullWidth, container.largeHorizontalMargin, styles.qrButton]}
            textStyle={styles.qrButtonText}
            onPress={this.onQRPress}
          >
            {I18n.t('caption_qr_scanner').toUpperCase()}
          </TextButton>
        </ScrollContentView>
      </ImageBackground>
    )
  }
}

export default CheckIn
