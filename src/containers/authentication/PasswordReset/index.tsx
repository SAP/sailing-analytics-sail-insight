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

import { requestPasswordReset } from '../../../actions/auth'

import I18n from 'i18n'

import Images from '../../../../assets/Images'
import styles from './styles'
import { text, form, button } from 'styles/commons'
import { $siDarkBlue, $siTransparent } from 'styles/colors';

class PasswordReset extends TextInputForm<{
  requestPasswordReset: (uoe: string) => any,
}> {
  public state = {
    usernameOrEmail: '',
    isLoading: false,
    error: null,
    usernameError: null,
  }

  public onSubmit = async () => {
    let usernameError = null
    
    this.setState({ error: null })
    const { usernameOrEmail } = this.state
    if (isEmpty(usernameOrEmail)) {
      usernameError = I18n.t('error_need_email_or_username')
      this.setState({usernameError: usernameError})
      return
    }
    try {
      this.setState({ isLoading: true, usernameError })
      await this.props.requestPasswordReset(usernameOrEmail)
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

  public onUsernameOrEmailChange = (newValue: string) => this.setState({ usernameOrEmail: newValue })

  public render() {
    const { usernameError, isLoading } = this.state
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
                  value={this.state.usernameOrEmail}
                  error={usernameError}
                  onChangeText={this.onUsernameOrEmailChange}
                  placeholder={I18n.t('text_placeholder_your_username_or_email')}
                  keyboardType={'default'}
                  returnKeyType="go"
                  autoCapitalize="none"
                  onSubmitEditing={this.onSubmit}
                />
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
