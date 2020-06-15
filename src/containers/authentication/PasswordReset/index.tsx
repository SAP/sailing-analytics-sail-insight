import React from 'react'
import { Alert, View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import LinearGradient from 'react-native-linear-gradient';

import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TextInput from 'components/TextInput'
import TextInputForm from 'components/base/TextInputForm'

import { FORM_KEY_EMAIL, FORM_KEY_USERNAME } from 'forms/registration'
import { requestPasswordReset } from '../../../actions/auth'

import I18n from 'i18n'

import Images from '../../../../assets/Images'
import styles from './styles'
import { text, form, button } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

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
              this.props.navigation.goBack()
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
      <ImageBackground source={Images.defaults.dots} style={{ width: '100%', height: '100%' }}>
        <LinearGradient colors={[$siTransparent, $siDarkBlue]} style={{ width: '100%', height: '100%' }} start={{ x: 0, y: 0 }} end={{ x: 0, y: 0.35 }}>
          <ScrollContentView style={styles.container}>
            <View style={styles.contentContainer}>
              <Text style={[text.longFormH1, styles.longFormH1]}>
                {I18n.t('text_passwort_reset_title_info')}
              </Text>
              <View style={form.formSegment1}>
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
                  inputRef={this.handleInputRef(FORM_KEY_USERNAME)} />
              </View>
              <View style={form.formDivider}>
                <View style={form.formDividerLine}></View>
                <Text style={form.formDividerText}>
                  {I18n.t('text_passwort_reset_or').toUpperCase()}
                </Text>
                <View style={form.formDividerLine}></View>
              </View>
              <View style={form.formSegment3}>
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
                  inputRef={this.handleInputRef(FORM_KEY_EMAIL)} />
              </View>
              <View style={form.lastFormSegment}>
                {/* {error && <View style={styles.redBalloon}><Text style={styles.redBalloonText}>{error}</Text><Image resizeMode='center' style={styles.attention} source={Images.defaults.attention} /></View>} */}
                <TextButton
                  style={[button.primary, button.fullWidth, styles.resetButton]}
                  textStyle={button.primaryText}
                  onPress={this.onSubmit}
                  isLoading={isLoading}>
                    {I18n.t('text_passwort_reset_submit').toUpperCase()}
                </TextButton>
              </View>
            </View>
          </ScrollContentView>
       </LinearGradient>
      </ImageBackground>
    )
  }
}

export default connect(null, { requestPasswordReset })(PasswordReset)
