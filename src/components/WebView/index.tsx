import React from 'react'
import { View } from 'react-native'
import { WebView as RNWebView } from 'react-native-webview'
import { connect } from 'react-redux'
import { getCustomScreenParamData } from 'navigation/utils'
import { getAccessToken } from 'selectors/auth'
import { container } from 'styles/commons'
import styles from './styles'

class WebView extends React.Component<{
  url: string,
  withAccessToken?: boolean,
  accessToken?: string,
} > {

  public defaultProps = {
    withAccessToken: true,
  }

  public state = {}

  public render() {
    const { url, accessToken } = this.props
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
      </View>
    )
  }

  protected onLoadStart = (navState: any) => {
    this.setState({ url: navState.nativeEvent.url })
  }
}

const mapStateToProps = (state: any, props: any) => ({
  url: getCustomScreenParamData(props).url,
  accessToken: getAccessToken(state),
})


export default connect(mapStateToProps)(WebView)
