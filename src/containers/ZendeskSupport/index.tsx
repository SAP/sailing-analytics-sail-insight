import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'
import { connect } from 'react-redux'
import { getCustomScreenParamData } from 'navigation/utils'

const FAQ_URL =
  'https://wiki.sapsailing.com/wiki/howto/tutorials/sailinsight/faq-answers.md'
const KNOWN_ISSUES_URL =
  'https://bugzilla.sapsailing.com/bugzilla/buglist.cgi?bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&component=Sail%20Insight%20Powered%20by%20SAP&list_id=661661&order=Importance&product=Sailing%20Race%20Analytics&query_format=advanced&resolution=---'

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
