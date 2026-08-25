import I18n from 'i18n'
import { Alert } from 'react-native'
import Snackbar from 'react-native-snackbar'

export const showNetworkRequiredSnackbarMessage = () =>
  Snackbar.show({
    text: I18n.t('error_network_required_snackbar'),
    duration: Snackbar.LENGTH_LONG,
  })

// Shown when a server call failed for any other reason than a missing
// connection. Failures used to be swallowed into Crashlytics only, which left
// the user staring at a screen that silently did nothing (issue #64).
export const showServerErrorSnackbarMessage = () =>
  Snackbar.show({
    text: I18n.t('error_data_retrieval'),
    duration: Snackbar.LENGTH_LONG,
  })

// Counterpart of the above for calls that write to the server. Reusing the
// "retrieving data failed" wording there would tell a user whose save just
// failed that nothing more than a read went wrong.
export const showSaveFailedSnackbarMessage = () =>
  Snackbar.show({
    text: I18n.t('error_unknown'),
    duration: Snackbar.LENGTH_LONG,
  })

export const showNetworkRequiredAlert = () =>
  Alert.alert(I18n.t('error_title'), I18n.t('error_network_required_alert'))
