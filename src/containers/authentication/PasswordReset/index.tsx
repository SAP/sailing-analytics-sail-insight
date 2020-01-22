import { isEmpty } from 'lodash'
import React from 'react'
import { Alert, ImageBackground, View } from 'react-native'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import { FORM_KEY_EMAIL, FORM_KEY_USERNAME } from 'forms/registration'
import I18n from 'i18n'

import TextInputForm from 'components/base/TextInputForm'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TextInput from 'components/TextInput'

import { button, container } from 'styles/commons'
import { registration } from 'styles/components'
import { requestPasswordReset } from '../../../actions/auth'
import { navigateBack } from '../../../navigation/NavigationService'
import styles from './styles'


class PasswordReset extends TextInputForm<{
  requestPasswordReset: (u: string, e: string) => any,
}> {
  public state = {
    username: '',
    email: '',
    isLoading: false,
    error: null,
  }

  public onSubmit = async () => {
    this.setState({ error: null })
    const { username, email } = this.state
    if (isEmpty(username) && isEmpty(email)) {
      return
    }
    try {
      this.setState({ isLoading: true })
      await this.props.requestPasswordReset(username, email)
    } catch (err) {
      // do not show any indication for error.
      // this.setState({ error: getErrorDisplayMessage(err) })
    } finally {
      this.setState({ isLoading: false })
      Alert.alert(
        I18n.t('text_passwort_reset_confirm_title'),
        I18n.t('text_passwort_reset_confirm_message'),
        [
          {
            text: I18n.t('caption_ok'), onPress: async () => {
              navigateBack()
            },
          },
        ],
        { cancelable: false },
      )
    }
  }

  public onUsernameChange = (newValue: string) => this.setState({ username: newValue })
  public onEmailChange = (newValue: string) => this.setState({ email: newValue })

  public render() {
    const { error, isLoading } = this.state
    return (
      <View style={{ width: '100%', height: '100%' }}>
        <ScrollContentView style={styles.scrollContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.claim}>
              <Text>{I18n.t('text_passwort_reset_title_info').toUpperCase()}</Text>
            </Text>
          </View>
          <View style={styles.inputField}>
            <TextInput
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputStyle}
              value={this.state.username}
              onChangeText={this.onUsernameChange}
              placeholder={I18n.t('text_placeholder_your_username')}
              keyboardType={'default'}
              returnKeyType="go"
              autoCapitalize="none"
              onSubmitEditing={this.onSubmit}
              inputRef={this.handleInputRef(FORM_KEY_USERNAME)}
            />
            <Text style={styles.message}>{I18n.t('text_passwort_reset_or').toUpperCase()}</Text>
            <TextInput
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputStyle}
              value={this.state.email}
              onChangeText={this.onEmailChange}
              style={styles.email}
              placeholder={I18n.t('text_placeholder_email')}
              keyboardType={'default'}
              returnKeyType="go"
              autoCapitalize="none"
              onSubmitEditing={this.onSubmit}
              inputRef={this.handleInputRef(FORM_KEY_EMAIL)}
            />
            {error && <View style={styles.redBalloon}><Text style={styles.redBalloonText}>{error}</Text><Image resizeMode='center' style={styles.attention} source={Images.defaults.attention} /></View>}
          </View>
          <View style={styles.bottomButtonField}>
            <TextButton
              style={styles.resetButton}
              textStyle={styles.resetButtonText}
              onPress={this.onSubmit}
              isLoading={isLoading}
            >
              {I18n.t('text_passwort_reset_submit').toUpperCase()}
            </TextButton>
          </View>
        </ScrollContentView>
      </View>
    )
  }
}

export default connect(null, { requestPasswordReset })(PasswordReset)
