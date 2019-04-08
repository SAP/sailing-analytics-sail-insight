import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import { dismissCreateAccountOnboarding, dismissJoinRegattaOnboarding } from 'actions/onboarding'
import I18n from 'i18n'
import { navigateToCheckIn, navigateToUserRegistration } from 'navigation'
import { isCreateAccountDismissalExpired, isJoinRegattaDismissalExpired } from 'selectors/onboarding'
import { isSessionListEmpty } from 'selectors/session'
import styles from './styles'

import HintCard from 'components/HintCard'
import LoginButton from 'components/LoginButton'
import { isLoggedIn } from 'selectors/auth'


class EmptySessionsHeader extends React.Component<{
  showHints: boolean,
  showJoinRegatta: boolean,
  showCreateAccount: boolean,
  dismissCreateAccountOnboarding: () => void,
  dismissJoinRegattaOnboarding: () => void,
} > {

  public onJoinPress = () => {
    navigateToCheckIn()
  }

  public onAccountPress = () => {
    navigateToUserRegistration()
  }

  public onCancelJoinPress = () => {
    this.props.dismissJoinRegattaOnboarding()
  }

  public onCancelAccountPress = () => {
    this.props.dismissCreateAccountOnboarding()
  }

  public render() {
    const {
      showHints,
      showJoinRegatta,
      showCreateAccount,
    } = this.props
    return showHints ? (
      <View style={styles.container}>
        {
          showJoinRegatta &&
          <HintCard
            imageSource={Images.info.coloredBoat}
            title={I18n.t('text_empty_sessions_join_title')}
            text={I18n.t('text_empty_sessions_join_text')}
            actionText={I18n.t('caption_join_regatta')}
            onCancelPress={this.onCancelJoinPress}
            onPress={this.onJoinPress}
          />
        }
        {
          showCreateAccount &&
          <HintCard
            style={showJoinRegatta && styles.separator}
            imageSource={Images.info.coloredUser}
            title={I18n.t('text_empty_sessions_account_title')}
            text={I18n.t('text_empty_sessions_account_text')}
            actionText={I18n.t('caption_create_free_account')}
            onCancelPress={this.onCancelAccountPress}
            onPress={this.onAccountPress}
          >
            <LoginButton
              style={styles.loginButton}
              isModal={true}
            />
          </HintCard>
        }
      </View>
    ) :
    <View/>
  }
}

const mapStateToProps = (state: any) => ({
  showHints: isSessionListEmpty(state),
  showJoinRegatta: isJoinRegattaDismissalExpired(state),
  showCreateAccount: isCreateAccountDismissalExpired(state) && !isLoggedIn(state),
})

export default connect(mapStateToProps, {
  dismissCreateAccountOnboarding,
  dismissJoinRegattaOnboarding,
})(EmptySessionsHeader)
