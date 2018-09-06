import React from 'react'
import { Image, View } from 'react-native'

import Images from '@assets/Images'
import I18n from 'i18n'
import { navigateToQRScanner } from 'navigation'
import { button, container, text } from 'styles/commons'
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
      <ScrollContentView>
        <View style={container.stretchContent}>
          <Image
            style={styles.boat}
            source={Images.info.coloredBoat}
          />
          <Text style={[text.claim, styles.claim, container.mediumHorizontalMargin]}>
            <Text>{I18n.t('text_join_and_track')}</Text>
          </Text>
          <Text style={[container.mediumHorizontalMargin, text.propertyValue, styles.claim]}>
            {I18n.t('text_join_code_on_confirmation')}
          </Text>
        </View>
        <TextButton
          style={[button.actionFullWidth, container.mediumHorizontalMargin, styles.qrButton]}
          textStyle={button.actionText}
          onPress={this.onQRPress}
        >
          {I18n.t('caption_qr_scanner')}
        </TextButton>
      </ScrollContentView>
    )
  }
}

export default CheckIn
