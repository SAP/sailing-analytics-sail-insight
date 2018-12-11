import React from 'react'
import { View, WebView as RNWebView } from 'react-native'
import { connect } from 'react-redux'

import { getCustomScreenParamData } from 'navigation/utils'
import { getAccessToken } from 'selectors/auth'

import { container } from 'styles/commons'
import styles from './styles'


class WebView extends React.Component<{
  url: string,
  withAuthToken?: boolean,
  accessToken?: string,
} > {

  public defaultProps = {
    withAccessToken: true,
  }

  public render() {
    const { url, withAuthToken, accessToken } = this.props
    console.log(url, withAuthToken, accessToken)
    return (
      <View style={container.list}>
        <RNWebView
          onLoadStart={this.onLoadStart}
          source={{
            uri: url,
            ...(withAuthToken && accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : {}),
          }}
          style={styles.web}
          scalesPageToFit={true}
        />
      </View>
    )
  }

  protected onLoadStart = (navState: any) => this.setState({ url: navState.nativeEvent.url })
}

const mapStateToProps = (state: any, props: any) => ({
  url: getCustomScreenParamData(props),
  accessToken: getAccessToken(state),
})


export default connect(mapStateToProps)(WebView)
