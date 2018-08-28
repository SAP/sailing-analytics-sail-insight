import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'


import Images from '@assets/Images'
import { navigateToCheckIn } from 'navigation'
import { buttons, container } from 'styles/commons'

import ImageButton from 'components/ImageButton'
import RegattaList from 'components/RegattaList'

import IconText from 'components/IconText'
import { settingsActionSheetOptions } from 'helpers/actionSheets'
import { ShowActionSheet, StyleSheetType } from 'helpers/types'
import I18n from 'i18n'
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

  public onAddPress = () => {
    navigateToCheckIn()
  }

  public onOptionsPressed = () => {
    this.props.showActionSheetWithOptions(...settingsActionSheetOptions)
  }

  public render() {
    return (
      <View style={container.list}>
        <RegattaList style={container.list} />
        <TouchableOpacity
          style={[buttons.actionRectangular, styles.addButton]}
          onPress={this.onAddPress}
        >
          <IconText
            source={Images.actionables.add}
            textStyle={buttons.actionText}
            style={container.row}
          >
            {I18n.t('caption_new_session')}
          </IconText>
        </TouchableOpacity>
      </View>
    )
  }
}

export default Sessions
