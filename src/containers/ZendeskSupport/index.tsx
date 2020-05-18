import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import { connect } from 'react-redux'
import { getCustomScreenParamData } from 'navigation/utils'

const FAQ_URL =
  'https://sailinsight.zendesk.com/hc/en-us/sections/360001223820-FAQ'
const KNOWN_ISSUES_URL =
  'https://sailinsight.zendesk.com/hc/en-us/sections/360003420079-Known-Issues'

class ZendeskSupport extends React.Component<{
  supportType: string
}> {
  public render() {
    const url = this.props.supportType === 'FAQ' ? FAQ_URL : KNOWN_ISSUES_URL
    return (
      <View style={{ flex: 1 }}>
        <WebView
          source={{
            uri: url,
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = (state: any, props: any) => ({
  supportType: getCustomScreenParamData(props).supportType,
})

export default connect(mapStateToProps)(ZendeskSupport)
