import React, { useState } from 'react'
import { FlatList, Share, TouchableOpacity, View, ViewProps } from 'react-native'

import {
  resetExpeditionCommunicationMessages,
  startExpeditionCommunicationMessagesChannel,
  stopExpeditionCommunicationMessagesChannel,
} from 'actions/communications'
import Text from 'components/Text'
import I18n from 'i18n'
import {
  getExpeditionMessages,
} from 'selectors/communications'
import { container } from 'styles/commons'
import styles from './styles'
import ConsoleItem from '../../components/ConsoleItem'
import { connect } from 'react-redux'

interface OutputConsoleProps {
  startExpeditionCommunicationMessagesChannel: (shouldClearPreviousData: boolean) => void,
  stopExpeditionCommunicationMessagesChannel: () => void,
  resetExpeditionCommunicationMessages: () => void,
  expeditionMessages: any[],
}

interface OutputConsoleState  {
  isRunning: boolean
}

class OutputConsole extends React.Component<OutputConsoleProps, OutputConsoleState> {

  constructor(props: any) {
    super(props)
    this.state = { isRunning: true }
  }

  public componentDidMount(): void {
    this.onReset = this.onReset.bind(this)
    this.onShare = this.onShare.bind(this)
    this.onPauseResume = this.onPauseResume.bind(this)

    console.log('componentDidMount')

    this.props.startExpeditionCommunicationMessagesChannel(false)
  }

  public componentWillUnmount(): void {
    this.props.stopExpeditionCommunicationMessagesChannel()
  }

  public render() {
    return (
        <View>
          <View style={[container.main, styles.console]}>
            <FlatList
                data={this.props.expeditionMessages}
                keyExtractor={(item, index) => item.timestamp}
                renderItem={this.renderItem}
            />
          </View>
          <View style={styles.consoleBtnsContainer}>
            <TouchableOpacity
                style={[styles.button, this.props.expeditionMessages.length > 0 ? styles.active : styles.disabled]}
                onPress={this.onShare}
                disabled={this.props.expeditionMessages.length === 0}>
              <Text style={styles.buttonContent}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button]} onPress={this.onReset}>
              <Text style={styles.buttonContent}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button]} onPress={this.onPauseResume}>
              <Text style={styles.buttonContent}>{this.state.isRunning ? 'Pause' : 'Resume'}</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }

  private onShare() {
    const message = this.props.expeditionMessages.map(item => item.message).join('\n\r')
    try {
      Share.share({
        message,
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  private onReset() {
    this.props.resetExpeditionCommunicationMessages()
  }

  private onPauseResume() {
    if (this.state.isRunning) {
      this.props.stopExpeditionCommunicationMessagesChannel()
    } else {
      this.props.startExpeditionCommunicationMessagesChannel(false)
    }
    this.setState(prevState => ({ isRunning: !prevState.isRunning }))
  }

  private renderItem(item: any) {
    const event = item.item
    return (
        <ConsoleItem
            message={event.message}
            source={event.source}
            timestamp={event.timestamp}
        />)
  }
}

const mapStateToProps = (state: any) => ({
  expeditionMessages: getExpeditionMessages(state),
})

export default connect(mapStateToProps, {
  startExpeditionCommunicationMessagesChannel,
  stopExpeditionCommunicationMessagesChannel,
  resetExpeditionCommunicationMessages,
})(OutputConsole)
