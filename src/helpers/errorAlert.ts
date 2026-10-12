import { Alert } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'

import I18n from 'i18n'
import { getShowErrorDetailsSetting } from 'selectors/settings'
import { getStore } from 'store'

import { getErrorDetails, getErrorDisplayMessage } from './texts'
import Logger from './Logger'
import { readPersistentLogs } from './PersistentLog'
let diagnosticsReadPending = false

const showDiagnosticsUnavailable = () => Alert.alert(
  I18n.t('caption_error_details'),
  I18n.t('error_diagnostics_unavailable'),
  [{ text: I18n.t('caption_ok') }],
)

const copyText = (text: string) => {
  try {
    Clipboard.setString(text)
  } catch (_) {
    Alert.alert(I18n.t('caption_error_details'), I18n.t('error_copy_diagnostics'), [
      { text: I18n.t('caption_ok') },
    ])
  }
}

export const showTechnicalErrorDetails = (error?: any) => {
  if (error) {
    const details = getErrorDetails(error)
    if (details) {
      Alert.alert(I18n.t('caption_error_details'), details, [
        { text: I18n.t('caption_copy_error_details'), onPress: () => copyText(details) },
        { text: I18n.t('caption_ok') },
      ])
      return
    }
  }

  // The operation error was swallowed upstream. These are recent app diagnostics,
  // not necessarily records of the failure that triggered this snackbar.
  if (diagnosticsReadPending) return
  diagnosticsReadPending = true
  void readPersistentLogs().then(logs => {
    diagnosticsReadPending = false
    const details = logs
      ? `${I18n.t('error_recent_diagnostics_notice')}\n\n${logs}`
      : I18n.t('error_diagnostics_empty')
    Alert.alert(I18n.t('caption_error_details'), details, [
      ...(logs ? [{ text: I18n.t('caption_copy_error_details'), onPress: () => copyText(details) }] : []),
      { text: I18n.t('caption_ok') },
    ])
  }).catch(() => {
    diagnosticsReadPending = false
    showDiagnosticsUnavailable()
  })
}

const isShowErrorDetailsEnabled = () => {
  try {
    return getShowErrorDetailsSetting(getStore().getState())
  } catch (e) {
    // store not initialized (e.g. in tests)
    return false
  }
}

/**
 * Alert for a failed operation. With the "show technical error details"
 * expert setting on, a "Details" button opens a second alert with the details.
 */
export const showErrorAlert = (title: string | undefined, error: any, friendlyMessage?: string) => {
  const message = friendlyMessage || getErrorDisplayMessage(error)
  Logger.warn('Error shown to user (alert):', title || '', message, ...(error ? [error] : []))
  const expertDetailsEnabled = isShowErrorDetailsEnabled()
  const details = expertDetailsEnabled ? getErrorDetails(error) : undefined
  const buttons = details ? [
    { text: I18n.t('caption_error_details'), onPress: () => Alert.alert(I18n.t('caption_error_details'), details, [
      { text: I18n.t('caption_copy_error_details'), onPress: () => copyText(details) },
      { text: I18n.t('caption_ok') },
    ]) },
    { text: I18n.t('caption_ok') },
  ] : expertDetailsEnabled && !error ? [
    { text: I18n.t('caption_error_details'), onPress: () => showTechnicalErrorDetails() },
    { text: I18n.t('caption_ok') },
  ] : undefined
  if (title) {
    Alert.alert(title, message, buttons)
  } else {
    Alert.alert(message, undefined, buttons)
  }
}
