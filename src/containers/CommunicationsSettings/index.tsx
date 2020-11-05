import React from 'react'
import { View, ViewProps } from 'react-native'
import { connect } from 'react-redux'

import {
  fetchCommunicationInfo,
  setCommunicationState,
} from 'actions/communications'
import EditItemSwitch from 'components/EditItemSwitch'
import Text from 'components/Text'
import I18n from 'i18n'
import {
  getServerIP,
  getServerPort,
  getServerProtocol,
  getServerState,
  getServerValid,
} from 'selectors/communications'
import { container } from 'styles/commons'
import ScrollContentView from '../../components/ScrollContentView'
import styles from './styles'
import OutputConsole from '../../components/OutputConsole'

class CommunicationSettings extends React.Component<ViewProps & {
  fetchCommunicationInfo: () => void,
  setCommunicationState: (value: boolean) => void,
  startExpeditionCommunicationMessagesChannel: () => void,
  stopExpeditionCommunicationMessagesChannel: () => void,
  serverState: boolean,
  serverValid: boolean,
  serverProtocol: string,
  serverIP: string,
  serverPort: string,
}> {

  public componentDidMount() {
    this.props.fetchCommunicationInfo()
  }

  public onServerState = (value: boolean) => {
    this.props.setCommunicationState(value)
  }

  public render() {
    return (
        <ScrollContentView>
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
            {
              this.props.serverState ? (<OutputConsole/>) : null
            }
          </View>
        </ScrollContentView>
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
}

const mapStateToProps = (state: any) => ({
  serverState: getServerState(state),
  serverValid: getServerValid(state),
  serverProtocol: getServerProtocol(state),
  serverIP: getServerIP()(state),
  serverPort: getServerPort()(state),
})

export default connect(mapStateToProps, {
  fetchCommunicationInfo,
  setCommunicationState,
})(CommunicationSettings)
