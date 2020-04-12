import React from 'react'
import { FlatList, View, ViewProps } from 'react-native'
import { connect } from 'react-redux'

import {
  fetchCommunicationInfo,
  setCommunicationState,
  startExpeditionCommunicationMessagesChannel,
} from 'actions/communications'
import EditItemSwitch from 'components/EditItemSwitch'
import Text from 'components/Text'
import I18n from 'i18n'
import {
  getExpeditionMessages,
  getServerIP,
  getServerPort,
  getServerProtocol,
  getServerState,
  getServerValid,
} from 'selectors/communications'
import { container } from 'styles/commons'
import styles from './styles'

class CommunicationSettings extends React.Component<ViewProps & {
  fetchCommunicationInfo: () => void,
  setCommunicationState: (value: boolean) => void,
  startExpeditionCommunicationMessagesChannel: () => void,
  serverState: boolean,
  serverValid: boolean,
  serverProtocol: string,
  serverIP: string,
  serverPort: string,
  expeditionMessages: string[],
}> {

  public componentWillMount() {
    this.props.fetchCommunicationInfo()
    this.props.startExpeditionCommunicationMessagesChannel()
  }

  public onServerState = (value: boolean) => {
    this.props.setCommunicationState(value)
  }

  public render() {
    return (
        <View style={[container.main, styles.container]}>
          {this.renderText(I18n.t('text_communications_server').toUpperCase(), '')}
          {this.renderText(I18n.t('text_communications_protocol').toUpperCase(), this.props.serverProtocol)}
          {this.renderText(I18n.t('text_communications_ip').toUpperCase(), this.props.serverIP)}
          {this.renderText(I18n.t('text_communications_port').toUpperCase(), this.props.serverPort)}
          <View >
            <EditItemSwitch
                style={styles.item}
                titleStyle={styles.title}
                title={this.props.serverState ?
                    I18n.t('text_communications_server_on').toUpperCase() :
                    I18n.t('text_communications_server_off').toUpperCase()}
                switchValue={this.props.serverState}
                onSwitchValueChange={this.onServerState}
            />
          </View>
          {this.props.serverState && this.renderOutputConsole()}
        </View>
    )
  }

  protected renderText = (leftText: string, rightText: string) => {
    return (
      <View style={[styles.item, styles.itemText]}>
        <Text style={styles.title}>{leftText}</Text>
        <Text style={styles.text}>{rightText}</Text>
      </View>
    )
  }

  private renderItem(item) {
    return (
        <View>
          <Text style={styles.title}>{item.item}</Text>
        </View>
    )
  }

  private keyExtractor(item) {
    return item.item
  }

  private renderOutputConsole() {
    return  (
        <View style={styles.textContainerBlack}>
          <FlatList
              data={this.props.expeditionMessages}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
          />
        </View>
    )
  }
}

const mapStateToProps = (state: any) => ({
  serverState: getServerState(state),
  serverValid: getServerValid(state),
  serverProtocol: getServerProtocol(state),
  serverIP: getServerIP()(state),
  serverPort: getServerPort()(state),
  expeditionMessages: getExpeditionMessages(state),
})

export default connect(mapStateToProps, {
  fetchCommunicationInfo,
  setCommunicationState,
  startExpeditionCommunicationMessagesChannel,
})(CommunicationSettings)
