import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
} from 'react-native'
import Hyperlink from 'react-native-hyperlink'

import I18n from 'i18n'
import { navigateToQRScanner } from 'navigation'
import { container } from 'styles/commons'

import GradientContainer from 'components/GradientContainer'
import styles from './styles'
import ImageButton from '../../components/ImageButton';

class Welcome extends Component {
  startQRScanner = () => {
    navigateToQRScanner()
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
        <TouchableOpacity
          style={{ alignItems: 'center' }}
          onPress={this.startQRScanner}
        >
          <ImageButton
        </TouchableOpacity>
      </GradientContainer>
    )
  }
}

export default Welcome
