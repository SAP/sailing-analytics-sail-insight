import I18n from 'i18n'
import Snackbar from 'react-native-snackbar'

export const ErrorCodes = {
  UNAUTHORIZED: 'error_unauthorized',
  MISSING_DATA: 'error_data_retrieval',
  FORBIDDEN: 'error_forbidden',
  USER_EXISTS: 'error_user_already_exists',
  PRECONDITION_FAILED: 'error_precondition_failed',
  NO_VENUE: 'error_no_venue',
  NO_BOAT_CLASS: 'error_no_boat_class',
  LEADERBOARD_GROUP_ALREADY_EXISTS: 'error_leaderboard_group_already_exists',
  REGATTA_ALREADY_EXISTS: 'error_regatta_already_exists',
  LEADERBOARD_ALREADY_EXISTS: 'error_leaderboard_already_exists'
}

export const showUnknownErrorSnackbarMessage = () =>
  Snackbar.show({
    text: I18n.t('error_unknown'),
    duration: Snackbar.LENGTH_SHORT
  })
