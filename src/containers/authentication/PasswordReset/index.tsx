import React from 'react'
import { Alert, View, ImageBackground } from 'react-native'
import Snackbar from 'react-native-snackbar'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import LinearGradient from 'react-native-linear-gradient';

import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TextInput from 'components/TextInput'
import TextInputForm from 'components/base/TextInputForm'
import ErrorBalloon from 'components/ErrorBalloon'
import NetworkTimeoutException from 'api/NetworkTimeoutException'
import { getErrorDisplayMessage } from 'helpers/texts'
import { isNetworkConnected } from 'selectors/network'

import { requestPasswordReset } from '../../../actions/auth'

import I18n from 'i18n'

import Images from '../../../../assets/Images'
import styles from './styles'
import { text, form, button } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

const isNetworkOrServerError = (err: any) => !!err && (
  err.name === NetworkTimeoutException.NAME ||
  (err.name === 'TypeError' && /network request failed/i.test(err.message || '')) ||
  err.status >= 500)

class PasswordReset extends TextInputForm<{
  requestPasswordReset: (uoe: string) => any,
  isNetworkConnected: boolean,
}> {
  public state = {
    usernameOrEmail: '',
    isLoading: false,
    error: null,
    rawError: null,
    usernameError: null,
  }

  public onSubmit = async () => {
    let usernameError = null
    
    this.setState({ error: null, rawError: null })
    const { usernameOrEmail } = this.state
    if (isEmpty(usernameOrEmail)) {
      usernameError = I18n.t('error_need_email_or_username')
      this.setState({usernameError: usernameError})
      return
    }
    if (!this.props.isNetworkConnected) {
      this.setState({ error: I18n.t('error_network_required_snackbar') })
      return
    }
    try {
      this.setState({ isLoading: true, usernameError })
      await this.props.requestPasswordReset(usernameOrEmail)
    } catch (err) {
      // Request never reached the server or the server is down: say so.
      // Other failures (e.g. unknown user, 4xx) get the generic confirmation
      // below on purpose, so accounts can't be enumerated.
      if (isNetworkOrServerError(err)) {
        const errorMessage = getErrorDisplayMessage(err)
        this.setState({ error: errorMessage, rawError: err, isLoading: false })
        Snackbar.show({ text: errorMessage, duration: Snackbar.LENGTH_LONG })
        return
      }
    }
    this.setState({ isLoading: false })
    Alert.alert(
      I18n.t('text_passwort_reset_confirm_title'),
      I18n.t('text_passwort_reset_confirm_message'),
      [
        {
          text: I18n.t('caption_ok'), onPress: async () => {
            this.props.navigation.goBack()
          },
        },
      ],
      { cancelable: false },
    )
  }

  public onUsernameOrEmailChange = (newValue: string) => this.setState({ usernameOrEmail: newValue })

  public render() {
    const { error, rawError, usernameError, isLoading } = this.state
    return (
      <ImageBackground source={Images.defaults.dots} style={{ width: '100%', height: '100%' }}>
        <LinearGradient colors={[$siTransparent, $siDarkBlue]} style={{ width: '100%', height: '100%' }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.35 }}>
          <ScrollContentView style={styles.container}>
            <View style={styles.contentContainer}>
              <Text style={[text.longFormH1, styles.longFormH1]}>
                {I18n.t('text_passwort_reset_title_info')}
              </Text>
              <View style={form.formSegment1}>
                <TextInput
                  testID="e2e-reset-username"
                  value={this.state.usernameOrEmail}
                  error={usernameError}
                  onChangeText={this.onUsernameOrEmailChange}
                  placeholder={I18n.t('text_placeholder_your_username_or_email')}
                  keyboardType={'email-address'}
                  returnKeyType="go"
                  autoCapitalize="none"
                  textContentType="emailAddress"
                  autoCompleteType="email"
                  //  autoCorrect={false}
                  onSubmitEditing={this.onSubmit}
                />
              </View>
              <View style={form.lastFormSegment}>
                <TextButton
                  testID="e2e-reset-submit"
                  style={[button.primary, button.fullWidth, styles.resetButton]}
                  textStyle={button.primaryText}
                  onPress={this.onSubmit}
                  isLoading={isLoading}>
                    {I18n.t('text_passwort_reset_submit').toUpperCase()}
                </TextButton>
                <ErrorBalloon message={error} error={rawError} />
              </View>
            </View>
          </ScrollContentView>
       </LinearGradient>
      </ImageBackground>
    )
  }
}

const mapStateToProps = (state: any) => ({
  isNetworkConnected: isNetworkConnected(state),
})

export default connect(mapStateToProps, { requestPasswordReset })(PasswordReset)
