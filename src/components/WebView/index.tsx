import React from 'react'
import { BackHandler, View } from 'react-native'
import { WebView as RNWebView } from 'react-native-webview'
import { connect } from 'react-redux'
import { once } from 'ramda'
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import HeaderBackButton from 'components/HeaderBackButton'
import * as Screens from 'navigation/Screens'
import { getCustomScreenParamData } from 'navigation/utils'
import { getAccessToken } from 'selectors/auth'
import { container } from 'styles/commons'
import styles from './styles'

class WebView extends React.Component<{
  url: string,
  withAccessToken?: boolean,
  accessToken?: string,
  comingFromTrackingScreen: boolean,
} > {

  public static defaultProps = {
    withAccessToken: true,
  }

  public state = {}

  public render() {
    const { url, accessToken, children} = this.props

    useFocusEffect(
        useCallback(() => {
          this.handleWillFocus();

          return () => {
            this.handleWillBlur();
          };
        }, [this.handleWillBlur, this.handleWillFocus]) // Add any dependencies if needed
    );

    return (
      <View style={container.list}>
        <RNWebView
          onLoadStart={this.onLoadStart}
          source={{
            uri: url,
            ...(accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}),
          }}
          style={styles.web}
          scalesPageToFit={true}
        />
        {children}
      </View>
    )
  }

  protected onLoadStart = (navState: any) => {
    this.setState({ url: navState.nativeEvent.url })
  }

  protected goBack = once(() => {
    if (this.props.comingFromTrackingScreen) {
      this.props.navigation.goBack()
      this.props.navigation.navigate(Screens.Tracking)
    } else {
      this.props.navigation.goBack()
    }
  })

  protected handleHardwareBackButton = () => {
    this.goBack()
    return true
  }

  protected handleWillBlur = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleHardwareBackButton)
  }

  protected handleWillFocus = () => {
    BackHandler.addEventListener('hardwareBackPress', this.handleHardwareBackButton)
    this.props.navigation.setOptions({
      headerLeft: HeaderBackButton({
        onPress: this.goBack,
      }),
    })
  }
}

const mapStateToProps = (state: any, props: any) => ({
  url: getCustomScreenParamData(props).url,
  comingFromTrackingScreen: !!getCustomScreenParamData(props).comingFromTrackingScreen,
  accessToken: getAccessToken(state),
})


export default connect(mapStateToProps)(WebView)
