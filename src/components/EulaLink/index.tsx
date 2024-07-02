import React, { Component } from 'react'

import { openPrivacyPolicy, openTerms } from 'helpers/user'
import I18n from 'i18n'

import Text from 'components/Text'

import styles from './styles'
import { text } from 'styles/commons'


export default class EulaLink extends Component<{mode?: 'JOIN' | 'REGISTER' | 'LOGIN'}> {
  public render() {
    const { mode = 'REGISTER' } = this.props
    return (
      <Text style={[text.caption, styles.text]}>
        <Text>
          {mode === 'REGISTER' ? I18n.t('text_register_grant_eula_01') :
           mode === 'JOIN' ? I18n.t('text_register_grant_eula_join_01') :
           mode === 'LOGIN' ? "" : ""}
        </Text>
        <Text
          onPress={openPrivacyPolicy}
          style={[styles.text, styles.textLink]}>
          {I18n.t('text_register_grant_eula_03')}
        </Text>
      </Text>
    )
  }
}
