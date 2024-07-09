import React from 'react'
import {AppState, AppStateStatus, NativeEventSubscription, View, ViewProps} from 'react-native'
import NetInfo, {NetInfoState, NetInfoSubscription} from "@react-native-community/netinfo"
import Svg, { Circle } from 'react-native-svg'
import { connect } from 'react-redux'
import { getUnsentGpsFixCount } from 'selectors/location'
import Text from 'components/Text'
import I18n from 'i18n'
import { $importantHighlightColor, $secondaryTextColor } from 'styles/colors'
import { text } from 'styles/commons'
import styles from './styles'

class ConnectivityIndicator extends React.Component<ViewProps & {
  unsentPositionFixCount: number,
}> {

  public state = { isConnected: true };
  private appStateSubscription?: NativeEventSubscription;
  private unsubscribeNetInfoSubscription?: NetInfoSubscription;

  public componentDidMount() {
    this.unsubscribeNetInfoSubscription = NetInfo.addEventListener(this.setNetworkStatus);
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange)
  }

  public componentWillUnmount() {
    if (!NetInfo) {
      return
    }

    if (this.unsubscribeNetInfoSubscription) {
      this.unsubscribeNetInfoSubscription();
    }

    this.appStateSubscription?.remove();
  }

  public render() {
    const {
      style,
      unsentPositionFixCount,
    } = this.props
    const { isConnected } = this.state

    const isBuffering = unsentPositionFixCount > 5
    const showStatus = isBuffering || !isConnected

    return !showStatus ? <View style={style}/> : (
      <View style={[styles.container, style]}>
        <View style={styles.line}/>
        <Svg
          style={styles.dot}
          height="8"
          width="8"
        >
          <Circle
            cx="4"
            cy="4"
            r="4"
            fill={isConnected ? $secondaryTextColor : $importantHighlightColor}
          />
        </Svg>
        <Text style={[text.propertyName, styles.text]}>
          {(!isConnected && !isBuffering ? I18n.t('text_offline') : I18n.t('text_buffering')).toUpperCase()}
          {isBuffering ? ` (${unsentPositionFixCount})` : undefined}
        </Text>
        <View style={styles.line}/>
      </View>
    )
  }

  protected setNetworkStatus = (state: NetInfoState) => {
    this.setState({ isConnected: state.isConnected && state.isInternetReachable });
  }

  protected handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState !== 'active' || !NetInfo) {
      return;
    }

    NetInfo.fetch().then(this.setNetworkStatus);
  }
}


const mapStateToProps = (state: any) => ({
  unsentPositionFixCount: getUnsentGpsFixCount(state),
})

export default connect(mapStateToProps)(ConnectivityIndicator)
