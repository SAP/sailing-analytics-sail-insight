import React from 'react'
import { FlatList, Share, View, ViewProps } from 'react-native'
import { connect } from 'react-redux'

import {
  resetExpeditionCommunicationMessages,
  startExpeditionCommunicationMessagesChannel,
} from 'actions/communications'
import Text from 'components/Text'
import {
  getExpeditionMessages,
} from 'selectors/communications'
import { container } from 'styles/commons'
import styles from './styles'

class OutputConsole extends React.Component<ViewProps & {
  startExpeditionCommunicationMessagesChannel: () => void,
  resetExpeditionCommunicationMessages: () => void,
  expeditionMessages: any[],
}> {

  private flatList: any

  constructor(props: any) {
    super(props)
    this.getFlatListRef = this.getFlatListRef.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
    this.onMessagesReset = this.onMessagesReset.bind(this)
    this.onMessagesShare = this.onMessagesShare.bind(this)
  }

  public componentWillMount() {
    this.props.startExpeditionCommunicationMessagesChannel()
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

  private onMessagesReset() {
    this.props.resetExpeditionCommunicationMessages()
  }

  private async onMessagesShare() {
    const message = this.props.expeditionMessages.map(item => item.message).join('\n\r')
    try {
      await Share.share({
        message,
      })
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.log(error.message)
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

export default connect(mapStateToProps, {
  startExpeditionCommunicationMessagesChannel,
  resetExpeditionCommunicationMessages,
})(OutputConsole)
