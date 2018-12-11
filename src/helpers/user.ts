import { get } from 'lodash'
import { Linking } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import VersionNumber from 'react-native-version-number'

import I18n from 'i18n'

import { openEmailTo } from './utils'


export const eulaUrl = 'http://www.sapsailing.com/EULA_iOS_SailingBoatTracker.html'
export const contactEmail = 'sailing_analytics@sap.com'

export const openTerms = () => Linking.openURL(eulaUrl)

export const openEmailToContact = () => openEmailTo(
  contactEmail,
  I18n.t('text_email_help_subject', { subject: DeviceInfo.getApplicationName(), version: getAppVersionText() }),
  I18n.t('text_email_help_body'),
)

export const getAppVersionText = () => `v${get(VersionNumber, 'appVersion')}.${get(VersionNumber, 'buildVersion')}`
