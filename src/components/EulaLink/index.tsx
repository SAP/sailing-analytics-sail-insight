import React, { Component } from 'react'

import { openPrivacyPolicy, openTerms } from 'helpers/user'
import I18n from 'i18n'

import Text from 'components/Text'

import { button } from 'styles/commons'
import styles from './styles'


export default class EulaLink extends Component<{mode?: 'JOIN' | 'REGISTER'}> {
  public render() {
    const { mode = 'REGISTER' } = this.props
    return (
      <Text style={[styles.text, styles.size, { marginLeft: 'auto', marginRight: 'auto' }]}>
        <Text style={{ color: 'white' }}>
          {mode === 'REGISTER' ? I18n.t('text_register_grant_eula_01') : I18n.t('text_register_grant_eula_join_01')}
        </Text>
        <Text onPress={openTerms} style={[button.textButtonText, styles.size]}>
          {I18n.t('text_register_grant_eula_02')}
        </Text>
        <Text style={{ color: 'white' }}>
          {' & '}
        </Text>
        <Text onPress={openPrivacyPolicy} style={[button.textButtonText, styles.size]}>
          {I18n.t('text_register_grant_eula_03')}
        </Text>
      </Text>
    )
  }
}
