import { get } from 'lodash'
import { Linking } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import VersionNumber from 'react-native-version-number'

import I18n from 'i18n'

import { openEmailTo } from './utils'

export const sapUrl = 'https://www.sap.com'
export const contactEmail = 'sailinsight@sailtracks.tv'

export const openTerms = () => Linking.openURL(I18n.t('url_eula'))
export const openPrivacyPolicy = () => Linking.openURL(I18n.t('url_privacy_policy'))

export const openSAPWebsite = () => Linking.openURL(sapUrl)

export const openEmailToContact = () => openEmailTo(
  contactEmail,
  I18n.t('text_email_help_subject', { subject: DeviceInfo.getApplicationName(), version: getAppVersionText() }),
  I18n.t('text_email_help_body'),
)

export const getAppVersionText = () => `v${get(VersionNumber, 'appVersion')}.${get(VersionNumber, 'buildVersion')}`
