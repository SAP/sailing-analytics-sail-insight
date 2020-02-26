import React from 'react'
import { when, isEmpty, always, either, isNil } from 'ramda'
import { ImageBackground, Text, View, ViewProps, BackHandler } from 'react-native'
import TextButton from 'components/TextButton'
import I18n from 'i18n'
import {
  navigateToQRScanner,
  navigateToTrackingList,
} from 'navigation'
import { button, container } from 'styles/commons'
import Images from '../../../../assets/Images'
import styles from './styles'
import User from 'models/User'
import { connect } from 'react-redux'
import {
  getUserInfo,
  isLoggedIn as isLoggedInSelector,
} from '../../../selectors/auth'
import { NavigationScreenProps } from 'react-navigation'

class WelcomeTracking extends React.Component<ViewProps & NavigationScreenProps & {
  isLoggedIn: boolean
  user: User,
}> {

  constructor(props: any) {
    super(props)
    this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this)
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
  }

  onBackButtonPressAndroid = () => {
    if (this.props.navigation.isFocused()) {
      BackHandler.exitApp()
      return true
    }
    return false
  };

  public render() {
    const { isLoggedIn, user } = this.props

    return (
      <ImageBackground source={Images.defaults.background_map} style={{ width: '100%', height: '100%' }}>
        <View style={[container.main, styles.container]}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
            {isLoggedIn ? I18n.t('text_welcome_logged_in', { name: when(either(isEmpty, isNil), always(user.username))(user.fullName) }) : I18n.t('text_welcome')}
            </Text>
          </View>
          <View style={styles.bottomContainer}>
            <TextButton
              style={[button.actionFullWidth, container.largeHorizontalMargin, styles.bigButton]}
              textStyle={styles.bigButtonText}
              onPress={navigateToTrackingList}
            >
              {I18n.t('caption_start_tracking').toUpperCase()}
            </TextButton>
            <TextButton
              style={[container.largeHorizontalMargin, styles.bigButtonWhite]}
              textStyle={styles.bigButtonTextInverse}
              onPress={navigateToQRScanner}
            >
              {I18n.t('caption_qr_scanner').toUpperCase()}
            </TextButton>
          </View>
        </View>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: getUserInfo(state) || {},
  isLoggedIn: isLoggedInSelector(state),
})

export default connect(mapStateToProps)(WelcomeTracking)
