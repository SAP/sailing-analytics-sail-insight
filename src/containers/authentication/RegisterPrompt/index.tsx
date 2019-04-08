import React from 'react'
import { View } from 'react-native'

import Images from '@assets/Images'
import I18n from 'i18n'
import { navigateToUserRegistration } from 'navigation'
import { container } from 'styles/commons'

import HintCard from 'components/HintCard'
import LoginButton from 'components/LoginButton'

import styles from './styles'


class RegisterPrompt extends React.Component {

  public render() {
    return (
      <View style={container.main}>
        <HintCard
          style={styles.card}
          imageSource={Images.info.coloredUser}
          title={I18n.t('text_empty_sessions_account_title')}
          text={I18n.t('text_empty_sessions_account_text')}
          actionText={I18n.t('caption_create_free_account')}
          onPress={navigateToUserRegistration}
          elementContainerStyle={styles.elementContainer}
        />
        <LoginButton
          style={styles.loginButton}
          isModal={true}
        />
      </View>
    )
  }
}

export default RegisterPrompt
