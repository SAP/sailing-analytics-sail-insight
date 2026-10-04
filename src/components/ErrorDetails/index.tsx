import React, { useState } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'

import Text from 'components/Text'
import I18n from 'i18n'

/**
 * Collapsible technical error details for pro users, meant to sit under an
 * existing (red) error text. The details are selectable so they can be copied.
 */
const ErrorDetails = ({ details }: { details?: string }) => {
  const [expanded, setExpanded] = useState(false)
  if (!details) {
    return null
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity testID="e2e-error-details-toggle" onPress={() => setExpanded(!expanded)}>
        <Text style={styles.toggle}>
          {I18n.t(expanded ? 'caption_hide_error_details' : 'caption_show_error_details')}
        </Text>
      </TouchableOpacity>
      {expanded && <Text selectable style={styles.details}>{details}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginTop: 4,
  },
  toggle: {
    color: '#FFFFFF',
    fontSize: 13,
    textDecorationLine: 'underline',
    textAlign: 'center',
    paddingVertical: 4,
  },
  details: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
    padding: 8,
    borderRadius: 4,
    textAlign: 'left',
  },
})

export default ErrorDetails
