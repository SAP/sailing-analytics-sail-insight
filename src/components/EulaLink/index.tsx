import React, { Component } from 'react'

import { openPrivacyPolicy, openTerms } from 'helpers/user'
import I18n from 'i18n'

import Text from 'components/Text'

import styles from './styles'
import { text } from 'styles/commons'


export default class EulaLink extends Component<{mode?: 'JOIN' | 'REGISTER'}> {
  public render() {
    const { mode = 'REGISTER' } = this.props
    return (
      <Text style={[text.caption]}>
        <Text>
          {mode === 'REGISTER' ? I18n.t('text_register_grant_eula_01') : I18n.t('text_register_grant_eula_join_01')}{"\n"}
        </Text>
        <Text
          onPress={openTerms}
          style={[styles.textLink]}
        >
          {I18n.t('text_register_grant_eula_02')}
        </Text>
        <Text style={styles.textColorRegister}>
          {' & '}
        </Text>
        <Text
          onPress={openPrivacyPolicy}
          style={[styles.textLink]}
        >
          {I18n.t('text_register_grant_eula_03')}
        </Text>
      </Text>
    )
  }
}
