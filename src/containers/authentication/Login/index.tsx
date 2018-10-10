import { isEmpty } from 'lodash'
import React from 'react'
import { Image, View } from 'react-native'
import { connect } from 'react-redux'

import Images from '@assets/Images'
import { login } from 'actions/auth'
import { FORM_KEY_EMAIL, FORM_KEY_PASSWORD } from 'forms/registration'
import { getErrorDisplayMessage } from 'helpers/texts'
import I18n from 'i18n'
import { navigateToMain } from 'navigation'

import TextInputForm from 'components/base/TextInputForm'
import ScrollContentView from 'components/ScrollContentView'
import Text from 'components/Text'
import TextButton from 'components/TextButton'
import TextInput from 'components/TextInput'

import { button, container, image, text } from 'styles/commons'
import { registration } from 'styles/components'
import { $extraSpacingScrollContent } from 'styles/dimensions'
import styles from './styles'


class Login extends TextInputForm<{
  login: (u: string, p: string) => any,
}> {
  public state = {
    email: '',
    password: '',
    isLoading: false,
    error: null,
  }

  public onSubmit = async () => {
    this.setState({ error: null })
    const { email, password } = this.state
    if (isEmpty(email) || isEmpty(password)) {
      return
    }
    try {
      this.setState({ isLoading: true })
      await this.props.login(email, password)
      navigateToMain()
    } catch (err) {
      this.setState({ error: getErrorDisplayMessage(err) })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  public onEmailChange = (newValue: string) => this.setState({ email: newValue })
  public onPasswordChange = (newValue: string) => this.setState({ password: newValue })

  public render() {
    const { error, isLoading } = this.state
    return (
      <ScrollContentView extraHeight={$extraSpacingScrollContent}>
        <View style={container.stretchContent}>
          <Image style={image.headerMedium} source={Images.header.sailors}/>
          <Image style={image.tagLine} source={Images.corporateIdentity.sapTagLine}/>
          <View style={[registration.topContainer(), styles.textContainer]}>
            <Text style={registration.claim()}>
              <Text>{I18n.t('text_login_claim_01')}</Text>
              <Text style={text.claimHighlighted}>{I18n.t('text_login_claim_02')}</Text>
            </Text>
          </View>
        </View>
        <View style={registration.bottomContainer()}>
          <TextInput
            value={this.state.email}
            onChangeText={this.onEmailChange}
            placeholder={I18n.t('text_placeholder_your_email')}
            keyboardType={'email-address'}
            returnKeyType="next"
            autoCapitalize="none"
            onSubmitEditing={this.handleOnSubmitInput(FORM_KEY_PASSWORD)}
            inputRef={this.handleInputRef(FORM_KEY_EMAIL)}
          />
          <TextInput
            value={this.state.password}
            onChangeText={this.onPasswordChange}
            style={styles.password}
            placeholder={I18n.t('text_placeholder_enter_password')}
            keyboardType={'default'}
            returnKeyType="go"
            onSubmitEditing={this.onSubmit}
            secureTextEntry={true}
            inputRef={this.handleInputRef(FORM_KEY_PASSWORD)}
          />
          {error && <Text style={registration.errorText()}>{error}</Text>}
          <TextButton
            style={registration.nextButton()}
            textStyle={button.actionText}
            onPress={this.onSubmit}
            isLoading={isLoading}
          >
            {I18n.t('caption_lets_go')}
          </TextButton>
        </View>
      </ScrollContentView >
    )
  }
}

export default connect(null, { login })(Login)
