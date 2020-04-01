import Snackbar from 'react-native-snackbar'

export const showNetworkRequiredSnackbarMessage = () =>
  Snackbar.show({
    title: 'Network connection required to perform this action',
    duration: Snackbar.LENGTH_LONG
  })
