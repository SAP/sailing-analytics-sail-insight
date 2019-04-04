import { get } from 'lodash'
import { Linking } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import VersionNumber from 'react-native-version-number'

import I18n from 'i18n'

import { openEmailTo } from './utils'


export const eulaUrl = 'http://konzeptwerft.com/sail-insight-powered-by-sap-app/'
export const contactEmail = 'sailinsight@sailtracks.tv'

export const openTerms = () => Linking.openURL(eulaUrl)

export const openEmailToContact = () => openEmailTo(
  contactEmail,
  I18n.t('text_email_help_subject', { subject: DeviceInfo.getApplicationName(), version: getAppVersionText() }),
  I18n.t('text_email_help_body'),
)

export const getAppVersionText = () => `v${get(VersionNumber, 'appVersion')}.${get(VersionNumber, 'buildVersion')}`
