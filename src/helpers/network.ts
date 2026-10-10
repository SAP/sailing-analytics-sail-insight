import I18n from 'i18n'
import { Alert } from 'react-native'
import Snackbar from 'react-native-snackbar'
import { getShowErrorDetailsSetting } from 'selectors/settings'
import { getStore } from 'store'
import { showTechnicalErrorDetails } from './errorAlert'

export const getErrorSnackbarAction = (error?: any) => {
  let enabled = false
  try {
    enabled = getShowErrorDetailsSetting(getStore().getState())
  } catch (_) {
    return undefined
  }
  if (!enabled) return undefined
  return {
    text: I18n.t('caption_error_details'),
    textColor: '#ffffff',
    onPress: () => showTechnicalErrorDetails(error),
  }
}

export const showFailureSnackbarMessage = (text: string, error?: any) =>
  Snackbar.show({
    text,
    duration: Snackbar.LENGTH_LONG,
    action: getErrorSnackbarAction(error),
  })

export const showNetworkRequiredSnackbarMessage = () =>
  Snackbar.show({
    text: I18n.t('error_network_required_snackbar'),
    duration: Snackbar.LENGTH_LONG,
  })

// Shown when a server call failed for any other reason than a missing
// connection. Failures used to be swallowed into Crashlytics only, which left
// the user staring at a screen that silently did nothing (issue #64).
export const showServerErrorSnackbarMessage = (error?: any) =>
  showFailureSnackbarMessage(I18n.t('error_data_retrieval'), error)

// Counterpart of the above for calls that write to the server. Reusing the
// "retrieving data failed" wording there would tell a user whose save just
// failed that nothing more than a read went wrong.
export const showSaveFailedSnackbarMessage = (error?: any) =>
  showFailureSnackbarMessage(I18n.t('error_unknown'), error)

export const showNetworkRequiredAlert = () =>
  Alert.alert(I18n.t('error_title'), I18n.t('error_network_required_alert'))
