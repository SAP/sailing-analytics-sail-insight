import React, { Component } from 'react'

import { openPrivacyPolicy } from 'helpers/user'
import I18n from 'i18n'
import { renderFormattedMessage } from 'i18n/format'

import Text from 'components/Text'

import styles from './styles'
import { text } from 'styles/commons'

export default class EulaLink extends Component<{mode?: 'JOIN' | 'REGISTER' | 'LOGIN'}> {
  public render() {
    const { mode = 'REGISTER' } = this.props
    const messageKey = mode === 'JOIN' ? 'text_join_privacy_policy' : 'text_register_privacy_policy'
    const link = (label: string, key: number) => (
      <Text key={key} onPress={openPrivacyPolicy} style={[styles.text, styles.textLink]}>
        {label}
      </Text>
    )
    return (
      <Text style={[text.caption, styles.text]}>
        {mode === 'LOGIN'
          ? link(I18n.t('title_privacy_policy'), 0)
          : renderFormattedMessage(I18n.t(messageKey), { privacyPolicy: link })}
      </Text>
    )
  }
}
