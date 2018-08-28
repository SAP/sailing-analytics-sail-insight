import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { View } from 'react-native'


import Images from '@assets/Images'
import { navigateToCheckIn } from 'navigation'
import { buttons, container } from 'styles/commons'

import ImageButton from 'components/ImageButton'
import RegattaList from 'components/RegattaList'

import { settingsActionSheetOptions } from 'helpers/actionSheets'
import { ShowActionSheet, StyleSheetType } from 'helpers/types'
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
        <ImageButton
          style={[buttons.action, styles.addButton]}
          onPress={this.onAddPress}
          source={Images.actionables.add}
          circular={true}
        />
      </View>
    )
  }
}

export default Sessions
