import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import { dismissCreateAccountOnboarding, dismissJoinRegattaOnboarding } from 'actions/onboarding'
import I18n from 'i18n'
import { navigateToCheckIn, navigateToUserRegistration } from 'navigation'
// import { isCreateAccountDismissalExpired, isJoinRegattaDismissalExpired } from 'selectors/onboarding'
import { isSessionListEmpty } from 'selectors/session'
import styles from './styles'

// import HintCard from 'components/HintCard'
// import LoginButton from 'components/LoginButton'
// import { isLoggedIn } from 'selectors/auth'
import Image from '../Image'


class EmptySessionsHeader extends React.Component<{
  showHints: boolean,
  // showJoinRegatta: boolean,
  // showCreateAccount: boolean,
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
      // showJoinRegatta,
      // showCreateAccount,
    } = this.props
    return showHints ? (
      <View style={styles.container}>
        <Image
          source={I18n.locale.substring(0,3) === 'de-' ? Images.defaults.background_empty_de: Images.defaults.background_empty}
          style={styles.image}
        />
      </View>
    ) :
    <View/>
  }
}

const mapStateToProps = (state: any) => ({
  showHints: isSessionListEmpty(state),
  // showJoinRegatta: isJoinRegattaDismissalExpired(state),
  // showCreateAccount: isCreateAccountDismissalExpired(state) && !isLoggedIn(state),
})

export default connect(mapStateToProps, {
  dismissCreateAccountOnboarding,
  dismissJoinRegattaOnboarding,
})(EmptySessionsHeader)
