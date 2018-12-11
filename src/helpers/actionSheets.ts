import I18n from 'i18n'
import { navigateToAppSettings } from 'navigation'

import { openEmailToContact, openTerms } from './user'


const settingsOptionsItems = [I18n.t('caption_settings'), I18n.t('caption_cancel')]

export const settingsActionSheetOptions = [
  {
    options: settingsOptionsItems,
    cancelButtonIndex: 1,
  },
  (buttonIndex: number) => {
    if (buttonIndex === 0) { navigateToAppSettings() }
  },
]

export const settingsWithCheckoutActionSheetOptions = (onCheckout?: () => void) => [
  {
    options: [I18n.t('caption_checkout'), ...settingsOptionsItems],
    cancelButtonIndex: 2,
    destructiveButtonIndex: 0,
  },
  (buttonIndex: number) => {
    switch (buttonIndex) {
      case 0:
        return onCheckout && onCheckout()
      case 1:
        return navigateToAppSettings()
      default:
        return
    }
  },
]

export const helpActionSheetOptions = () => [
  {
    options: [I18n.t('caption_need_help'), I18n.t('title_eula'), I18n.t('caption_cancel')],
    cancelButtonIndex: 2,
  },
  (buttonIndex: number) => {
    switch (buttonIndex) {
      case 0:
        return openEmailToContact()
      case 1:
        return openTerms()
      default:
        return
    }
  },
]
