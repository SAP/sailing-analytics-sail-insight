import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
} from 'react-native'
import Hyperlink from 'react-native-hyperlink'

import I18n from 'i18n'
import { navigateToCheckIn } from 'navigation'
import { container, buttons } from 'styles/commons'

import GradientContainer from 'components/GradientContainer'
import ImageButton from 'components/ImageButton'
import Images from '@assets/Images'

import styles from './styles'


class Welcome extends Component {
  onAddPress = () => {
    navigateToCheckIn()
  }

  render() {
    return (
      <GradientContainer style={[container.main, { alignItems: 'center' }]}>
        <Text style={styles.moreInformationText}>
          {I18n.t('text_more_information_at')}
        </Text>
        <Hyperlink
          style={styles.hyperLink}
          linkStyle={styles.hyperLinkText}
          linkDefault
        >
          <Text>
            {'https://sapsailing.com'}
          </Text>
        </Hyperlink>
        <ImageButton
          style={[buttons.action, styles.addButton]}
          onPress={this.onAddPress}
          source={Images.actionables.add}
          circular
        />
      </GradientContainer>
    )
  }
}

export default Welcome
