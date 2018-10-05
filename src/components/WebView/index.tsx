import React from 'react'
import { View, WebView as RNWebView } from 'react-native'
import { connect } from 'react-redux'

import { getCustomScreenParamData } from 'navigation/utils'
import { container } from 'styles/commons'
import styles from './styles'


class WebView extends React.Component<{
  url: string,
} > {
  public render() {
    return (
      <View style={container.list}>
        <RNWebView
          source={{ uri: this.props.url }}
          style={styles.web}
          scalesPageToFit={true}
        />
      </View>
    )
  }
}

const mapStateToProps = (state: any, props: any) => ({
  url: getCustomScreenParamData(props),
})


export default connect(mapStateToProps)(WebView)
