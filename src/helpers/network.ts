import I18n from 'i18n'
import { Alert } from 'react-native'
import Snackbar from 'react-native-snackbar'

export const showNetworkRequiredSnackbarMessage = () =>
  Snackbar.show({
    title: I18n.t('error_network_required_snackbar'),
    duration: Snackbar.LENGTH_LONG,
  })

export const showNetworkRequiredAlert = () =>
  Alert.alert(I18n.t('error_title'), I18n.t('error_network_required_alert'))
