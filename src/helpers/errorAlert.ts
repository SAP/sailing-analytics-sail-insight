import { Alert } from 'react-native'

import I18n from 'i18n'
import { getShowErrorDetailsSetting } from 'selectors/settings'
import { getStore } from 'store'

import { getErrorDetails, getErrorDisplayMessage } from './texts'

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
export const showErrorAlert = (title: string | undefined, error: any) => {
  const message = getErrorDisplayMessage(error)
  const details = isShowErrorDetailsEnabled() ? getErrorDetails(error) : undefined
  const buttons = details ? [
    { text: I18n.t('caption_error_details'), onPress: () => Alert.alert(I18n.t('caption_error_details'), details) },
    { text: I18n.t('caption_ok') },
  ] : undefined
  if (title) {
    Alert.alert(title, message, buttons)
  } else {
    Alert.alert(message, undefined, buttons)
  }
}
