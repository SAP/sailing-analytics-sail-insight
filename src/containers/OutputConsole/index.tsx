import React from 'react'
import { FlatList, Share, View, ViewProps } from 'react-native'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import {
  resetExpeditionCommunicationMessages,
  startExpeditionCommunicationMessagesChannel,
} from 'actions/communications'
import Text from 'components/Text'
import { __, always, call, compose, identity, inc, last, take } from 'ramda'
import {
  getExpeditionMessages,
} from 'selectors/communications'
import { container } from 'styles/commons'
import { Component, connectActionSheet, fold, fromClass, reduxConnect } from '../../components/fp/component'
import { touchableOpacity } from '../../components/fp/react-native'
import IconText from '../../components/IconText'
import styles from './styles'
import { getStore } from '../../store';

class OutputConsole extends React.Component<ViewProps & {
  expeditionMessages: any[],
}> {

  private flatList: any

  constructor(props: any) {
    super(props)
    this.getFlatListRef = this.getFlatListRef.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
  }

  public render() {
    return (
        <View style={[container.main]}>
          {this.renderOutputConsole()}
        </View>
    )
  }

  private renderItem(item: any) {
    const event = item.item
    return (
        <View>
         <Text style={[styles.item, styles.itemText, event.source === 'expedition' ? styles.green : styles.red]}>
           {event.message}
         </Text>
        </View>
    )
  }

  private getFlatListRef(component: any) {
    this.flatList = component
  }

  private scrollToBottom() {
    if (this.flatList && this.props.expeditionMessages && this.props.expeditionMessages.length > 0) {
      this.flatList.scrollToEnd({ animated: true })
    }
  }

  private renderOutputConsole() {
    return  (
        <FlatList
            ref={this.getFlatListRef}
            data={this.props.expeditionMessages}
            renderItem={this.renderItem}
            onContentSizeChange={this.scrollToBottom}
        />
    )
  }
}

const mapStateToProps = (state: any) => ({
  expeditionMessages: getExpeditionMessages(state),
})

const moreIcon = fromClass(IconText).contramap(always({
  source: Images.actions.expandMore,
  iconTintColor: 'white',
  style: { justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  iconStyle: { width: 25, height: 25 },
}))

export const MoreButton = Component(props => compose(
    fold(props),
    reduxConnect(null, { resetExpeditionCommunicationMessages }),
    connectActionSheet,
    touchableOpacity({
      onPress: props => props.showActionSheetWithOptions({
        options: ['Reset', 'Share', 'Cancel'],
        cancelButtonIndex: 2,
      },                                                 compose(
          call,
          last,
          take(__, [props.resetExpeditionCommunicationMessages, props.shareMessage, identity]),
          inc)),
    }))(
    moreIcon))

export const shareMessages = async () => {
  const expeditionMessages = getExpeditionMessages(getStore().getState())
  const messageToShare = expeditionMessages.map(item => item.message).join('\n\r')
  try {
    await Share.share({
      message: messageToShare,
    })
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.log(error.message)
  }
}

export default connect(mapStateToProps)(OutputConsole)

