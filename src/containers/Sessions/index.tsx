import { connectActionSheet } from '@expo/react-native-action-sheet'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'


import Images from '@assets/Images'
import { navigateToTrackingSetup } from 'navigation'
import { button, container } from 'styles/commons'

import { settingsActionSheetOptions } from 'helpers/actionSheets'
import { ShowActionSheet, StyleSheetType } from 'helpers/types'
import I18n from 'i18n'
import { generateNewSession } from 'services/SessionService'
import styles from './styles'

import IconText from 'components/IconText'
import SessionList from 'components/SessionList'


@connectActionSheet
class Sessions extends React.Component<{
  style?: StyleSheetType,
  navigation: any,
  showActionSheetWithOptions: ShowActionSheet,
} > {

  public state = {
    hideAddButton: false,
  }

  public componentDidMount() {
    this.props.navigation.setParams({ onOptionsPressed: this.onOptionsPressed })
  }

  public renderAddItem() {
    return !this.state.hideAddButton && (
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
    )
  }

  public render() {
    return (
      <View style={container.list}>
        <SessionList
          style={container.list}
          onScrollBeginDrag={this.hideAdd}
          onScrollEndDrag={this.showAdd}
          onMomentumScrollBegin={this.hideAdd}
          onMomentumScrollEnd={this.showAdd}
        />
        {this.renderAddItem()}
      </View>
    )
  }

  protected onNewSessionPress = () => {
    navigateToTrackingSetup(generateNewSession())
  }

  protected onOptionsPressed = () => {
    this.props.showActionSheetWithOptions(...settingsActionSheetOptions)
  }

  protected showAdd = () => {
    this.setState({ hideAddButton: false })
  }

  protected hideAdd = () => {
    this.setState({ hideAddButton: true })
  }
}

export default Sessions
