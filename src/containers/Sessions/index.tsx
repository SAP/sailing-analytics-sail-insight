import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'


import Images from '@assets/Images'
import { navigateToTrackingSetup } from 'navigation'
import { button, container } from 'styles/commons'

import RegattaList from 'components/RegattaList'

import IconText from 'components/IconText'
import { settingsActionSheetOptions } from 'helpers/actionSheets'
import { ShowActionSheet, StyleSheetType } from 'helpers/types'
import I18n from 'i18n'
import { generateNewSession } from 'services/SessionService'
import styles from './styles'


@connectActionSheet
class Sessions extends React.Component<{
  style?: StyleSheetType,
  navigation: any,
  showActionSheetWithOptions: ShowActionSheet,
} > {
  public componentDidMount() {
    this.props.navigation.setParams({ onOptionsPressed: this.onOptionsPressed })
  }

  public onNewSessionPress = () => {
    navigateToTrackingSetup(generateNewSession())
  }

  public onOptionsPressed = () => {
    this.props.showActionSheetWithOptions(...settingsActionSheetOptions)
  }

  public render() {
    return (
      <View style={container.list}>
        <RegattaList style={container.list} />
        <TouchableOpacity
          style={[button.actionRectangular, styles.addButton]}
          onPress={this.onNewSessionPress}
        >
          <IconText
            source={Images.actions.add}
            textStyle={button.actionText}
            iconTintColor="white"
            alignment="horizontal"
          >
            {I18n.t('caption_new_session')}
          </IconText>
        </TouchableOpacity>
      </View>
    )
  }
}

export default Sessions
