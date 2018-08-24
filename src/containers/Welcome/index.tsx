import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'

import Images from '@assets/Images'
import { navigateToCheckIn } from 'navigation'
import { buttons, container } from 'styles/commons'

import GradientContainer from 'components/GradientContainer'
import ImageButton from 'components/ImageButton'
import RegattaList from 'components/RegattaList'

import { settingsActionSheetOptions } from 'helpers/actionSheets'
import { ShowActionSheet, StyleSheetType } from 'helpers/types'
import styles from './styles'


@connectActionSheet
class Welcome extends React.Component<{
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
      <GradientContainer style={container.main}>
        <RegattaList style={container.main} />
        <ImageButton
          style={[buttons.action, styles.addButton]}
          onPress={this.onAddPress}
          source={Images.actionables.add}
          circular={true}
        />
      </GradientContainer>
    )
  }
}

export default Welcome
