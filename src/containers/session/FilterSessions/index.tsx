import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import Text from 'components/Text'
import TextButton from 'components/TextButton'
import I18n from 'i18n'
import { navigateBack } from 'navigation'

import { button } from 'styles/commons'
import styles from './styles'

class FilterSessions extends React.Component<{}> {
  public render() {
    return (
      <View style={styles.screenContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>
            {I18n.t('text_session_filter_header').toUpperCase()}
          </Text>
        </View>
        <View style={styles.selectionContainer} />
        <View style={styles.buttonContainer}>
          <TextButton
            style={styles.button}
            textStyle={button.textButtonTextBig}
            onPress={navigateBack}
          >
            {I18n.t('caption_close')}
          </TextButton>
          <TextButton
            style={[button.actionFullWidth, styles.button]}
            textStyle={button.actionText}
            onPress={() => {}}
          >
            {I18n.t('caption_confirm')}
          </TextButton>
        </View>
      </View>
    )
  }
}

export default connect(
  null,
  {},
)(FilterSessions)
